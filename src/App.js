import "./styles/App.css";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Layout from "./components/Layout";
import StatusMessage from "./components/StatusMessage";
import filecoinNFTHack from "./utils/FilecoinNFTHack.json";
import { baseSVG } from "./utils/BaseSVG";

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
  const [nftCollectionData, setNftCollectionData] = useState("");
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
    console.log("linksObj changed", linksObj);
  });

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
      fetchNFTCollection();
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }

    //make sure on right network
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

  //Create the IPFS CID of the json data
  const createNFTData = async () => {
    //lets load up this token with some metadata and our image and save it to NFT.storage
    //need status indicators
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
          console.log("metadata saved", metadata);
          let imgViewArray = metadata.data.image.pathname.split("/");
          setImageView(
            `https://${imgViewArray[2]}.ipfs.dweb.link/${imgViewArray[3]}`
          );
          console.log("linksObjMeta", linksObj);
          // const status = await client.status(metadata.ipnft);
          // console.log("status", status);
          askContractToMintNft(metadata.url);
        });
    } catch (error) {
      console.log("Could not save NFT to NFT.Storage - Aborted minting");
    }
  };

  const askContractToMintNft = async (IPFSurl) => {
    //should check the wallet chain is correct here
    console.log("name value", name, linksObj);
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
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNFTCollection = async () => {
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

        let collection = await connectedContract.getNFTCollection();

        console.log(`Got Collection`, collection);
        setNftCollectionData(collection);

        //testing fetching data to display image
        let link = collection[0][1].split("/");
        console.log(link);
        let fetchURL = `https:${link[2]}.ipfs.dweb.link/${link[3]}`;
        fetch(fetchURL)
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
          });
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
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
        disabled={!name}
      >
        Mint NFT
      </button>
    </div>
  );

  const renderImagePreview = () => {
    console.log("image", imageView);
    return (
      <div>
        <img
          src={imageView}
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
        <p className="sub-sub-text">Remaining NFTS:</p>
        {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        {linksObj.etherscan &&
          renderLink(linksObj.etherscan, "See your Transaction on Etherscan")}
        {linksObj.opensea &&
          renderLink(linksObj.opensea, "See your NFT on OpenSea")}
        {linksObj.rarible &&
          renderLink(linksObj.rarible, "See your NFT on Rarible")}
        {imageView && renderLink(imageView, "See IPFS image link")}
        {imageView && renderImagePreview()}
      </>
    </Layout>
  );
};

export default App;
