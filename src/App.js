import "./styles/App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "./components/Layout";
import filecoinNFTHack from "./utils/FilecoinNFTHack.json";
import { baseSVG } from "./utils/BaseSVG";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

import { NFTStorage, File } from "nft.storage";

const INITIAL_LINK_STATE = {
  etherscan: "",
  opensea: "",
  rarible: "",
};

const INITIAL_TRANSACTION_STATE = {
  loading: "",
  error: "",
  success: "",
  warning: "",
};

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const App = () => {
  const client = new NFTStorage({
    token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [linksObj, setLinksObj] = useState(INITIAL_LINK_STATE);
  const [imageView, setImageView] = useState("");
  const [remainingNFTs, setRemainingNFTs] = useState("");
  const [nftCollectionData, setNftCollectionData] = useState("");
  const [recentlyMinted, setRecentlyMinted] = useState("");
  const [transactionState, setTransactionState] = useState(
    INITIAL_TRANSACTION_STATE
  );
  const { loading, error, success } = transactionState;

  /**
   * Runs once when page loads
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    setUpEventListener();
    fetchNFTCollection();
  }, [currentAccount]);

  useEffect(() => {
    console.log("data", nftCollectionData);
  }, [nftCollectionData]);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      setUpEventListener();
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }

    //TODO: make sure on right network or change programatically
    // let chainId = await ethereum.request({ method: 'eth_chainId' });
    // console.log("Connected to chain " + chainId);

    // // String, hex code of the chainId of the Rinkebey test network
    // const rinkebyChainId = "0x4";
    // if (chainId !== rinkebyChainId) {
    //   alert("You are not connected to the Rinkeby Test Network!");
    // }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const setUpEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          filecoinNFTHack.abi,
          signer
        );

        connectedContract.on("RemainingMintableNFTChange", (remainingNFTs) => {
          setRemainingNFTs(remainingNFTs);
        });
        connectedContract.on(
          "NewFilecoinNFTMinted",
          (sender, tokenId, tokenURI) => {
            console.log("event - new minted NFT");
            fetchNFTCollection();
          }
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTCollection = async () => {
    console.log("fetching nft collection");
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          filecoinNFTHack.abi,
          signer
        );
        let remainingNFTs = await connectedContract.remainingMintableNFTs();
        setRemainingNFTs(remainingNFTs.toNumber());
        let collection = await connectedContract.getNFTCollection();

        setNftCollectionData(collection);
        console.log("collection", collection);

        /***
         * Going to put these in the view collection
         */
        let dataCollection = collection
          .slice()
          .reverse()
          .slice(0, 5)
          .map((el) => {
            return el;
          });

        let imgURLs = await Promise.all(
          dataCollection.map(async (el) => {
            console.log(el)
            let link = el[1].split("/");
            let fetchURL = `https:${link[2]}.ipfs.dweb.link/${link[3]}`;
            console.log("fetchURL", fetchURL);
            const response = await fetch(fetchURL);
            console.log("response", response)
            const json = await response.json();
            console.log("json", json)
            return json;
          })
        );
        console.log("imgURLs2", imgURLs);
        setRecentlyMinted(imgURLs);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderMostRecentlyMinted = () => {
    // let myLinks = recentlyMinted.map((el) => {
    //   let link = el.image.split("/");
    //   return `https:${link[2]}.ipfs.dweb.link/${link[3]}`;
    // });
    return (
      <div className="nft-viewer-outer">
        <p className="sub-text">Most Recently Minted</p>
        <div className="nft-viewer-container">
          {recentlyMinted.map((el, idx) => {
            let linkArr = el.image.split("/");
            let link = `https:${linkArr[2]}.ipfs.dweb.link/${linkArr[3]}`;
            return (
              <div className="nft-viewer-column" key={idx}>
                {renderImagePreview(link)}
                <p>Name: {el.name}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  //Create the IPFS CID of the json data
  const createNFTData = async () => {
    console.log("saving to NFT storage");
    //lets load up this token with some metadata and our image and save it to NFT.storage
    //need status indicators
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Saving NFT data to NFT.Storage...",
    });
    setImageView("");
    try {
      await client
        .store({
          name: `${name}: Filecoin @ NFTHack 2022`,
          description:
            "NFT created for EthGlobal NFTHack 2022 and limited to 100 personalised tokens",
          image: new File(
            [
              `${baseSVG}${name}</text>
      </svg>`,
            ],
            `FilecoinNFTHack.svg`,
            {
              type: "image/svg+xml",
            }
          ),
          traits: {
            awesomeness: "100", //probs should use 0-1 for solidity
          },
        })
        .then((metadata) => {
          setTransactionState({
            ...transactionState,
            success: "Saved NFT data to NFT.Storage...",
            loading: "",
          });
          console.log("metadata saved", metadata);
          let imgViewArray = metadata.data.image.pathname.split("/");
          let imgViewString = `https://${imgViewArray[2]}.ipfs.dweb.link/${imgViewArray[3]}`;
          setImageView(
            imgViewString
          );
          console.log(
            "image view set",
            `https://${imgViewArray[2]}.ipfs.dweb.link/${imgViewArray[3]}`
          );
          // const status = await client.status(metadata.ipnft);
          // console.log("status", status);
          askContractToMintNft(metadata.url);
        });
    } catch (error) {
      console.log("Could not save NFT to NFT.Storage - Aborted minting");
      setTransactionState({
        ...INITIAL_TRANSACTION_STATE,
        error: "Could not save NFT to NFT.Storage - Aborted minting",
      });
    }
  };

  const askContractToMintNft = async (IPFSurl) => {
    //should check the wallet chain is correct here
    setTransactionState({
      ...INITIAL_TRANSACTION_STATE,
      loading: "Approving & minting NFT...",
    });

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          filecoinNFTHack.abi,
          signer
        );

        console.log("Opening wallet");
        let nftTxn = await connectedContract.mintMyNFT(IPFSurl);

        connectedContract.on(
          "NewFilecoinNFTMinted",
          (from, tokenId, tokenURI) => {
            console.log("event listener", from, tokenId.toNumber(), tokenURI);
            setLinksObj({
              ...linksObj,
              opensea: `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
              rarible: `https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`,
              etherscan: `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
            });
          }
        );

        //SHOULD UPDATE IMAGELINK to returned value
        await nftTxn.wait();
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          success: "NFT Minted!",
        });
      } else {
        console.log("Ethereum object doesn't exist!");
        setTransactionState({
          ...INITIAL_TRANSACTION_STATE,
          error: `No Wallet connected`,
        });
      }
    } catch (error) {
      setTransactionState({
        ...INITIAL_TRANSACTION_STATE,
        error: `Error Minting NFT. ${error.message}`,
      });
    }
  };

  const renderStatus = () => {
    const { loading, error, success } = transactionState;
    return (
      <div
        style={{
          height: `${loading ? "100px" : "50px"}`,
          width: "100%",
          display: "flex",
          color: "white",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Box sx={{ width: "30%" }}>
          {loading ? loading : success ? success : error}
        </Box>
        {loading && (
          <Box sx={{ width: "20%", marginTop: "30px" }}>
            <LinearProgress />
          </Box>
        )}
      </div>
    );
  };

  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-to-wallet-button"
    >
      Connect to Wallet
    </button>
  );

  const renderMintUI = () => (
    <div>
      <p>
        <input
          className="input"
          placeholder="Enter your name"
          type="text"
          // pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </p>
      <button
        onClick={createNFTData}
        className={
          name
            ? "cta-button connect-wallet-button"
            : "cta-button connect-wallet-button-disabled"
        }
        disabled={!name || transactionState.loading}
      >
        Mint NFT
      </button>
    </div>
  );

  const renderImagePreview = (imgLink) => {
    return (
      <div>
        <img
          src={imgLink}
          alt="NFT image preview"
          height="200px"
          width="200px"
          style={{ backgroundColor: "white" }}
        />
      </div>
    );
  };

  const renderLink = (link, description) => {
    return (
      <p>
        <a className="footer-text" href={link} target="_blank" rel="noreferrer">
          {description}
        </a>
      </p>
    );
  };

  return (
    <Layout connected={currentAccount === ""} connectWallet={connectWallet}>
      <>
        <p className="sub-sub-text">{`Remaining NFTS: ${remainingNFTs}`}</p>
        {transactionState !== INITIAL_TRANSACTION_STATE && renderStatus()}
        {imageView &&
          !linksObj.etherscan &&
          renderLink(imageView, "See IPFS image link")}
        {imageView && renderImagePreview(imageView)}
        {linksObj.etherscan &&
          renderLink(linksObj.etherscan, "See your Transaction on Etherscan")}
        {linksObj.opensea &&
          renderLink(linksObj.opensea, "See your NFT on OpenSea")}
        {linksObj.rarible &&
          renderLink(linksObj.rarible, "See your NFT on Rarible")}
        {currentAccount === "" ? (
          renderNotConnectedContainer()
        ) : transactionState.loading ? (
          <div />
        ) : (
          renderMintUI()
        )}
        {recentlyMinted && renderMostRecentlyMinted()}
      </>
    </Layout>
  );
};

export default App;
