import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import filecoinNFTHack from "./utils/FilecoinNFTHack.json";
import { baseSVG } from "./utils/BaseSVG";

import { NFTStorage, File } from "nft.storage";

const INITIAL_LINK_STATE = {
  etherscan: "",
  opensea: "",
  rarible: "",
  image: "",
};

const App = () => {
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
  const client = new NFTStorage({
    token: process.env.REACT_APP_NFT_STORAGE_API_KEY,
  });
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [links, setLinks] = useState(INITIAL_LINK_STATE);

  const [openseaLink, setOpenSeaLink] = useState("");
  const [raribleLink, setRaribleLink] = useState("");
  const [imageView, setImageView] = useState("");
  const [nftCollectionData, setNftCollectionData] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  // useEffect(() => {
  //   console.log("new minted");
  //   // fetchNFTCollection();
  // }, [openseaLink]);

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
      // Setup listener! This is for the case where a user comes to our site
      // and ALREADY had their wallet connected + authorized.
      setupEventListener();
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

  /*
   * Implement your connectWallet method here
   */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
       * Fancy method to request access to account.
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      /*
       * Boom! This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      // Setup listener! This is for the case where a user comes to our site
      // and connected their wallet for the first time.
      setupEventListener();
    } catch (error) {
      console.log(error);
    }
  };

  // Setup our listener.
  const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
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

        connectedContract.on("NewFilecoinNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setLinks({
            ...links,
            opensea: `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`,
            rarible: `https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`,
          });
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //Create the IPFS CID of the image data
  // const saveImageDatatoNFTStorage = async () => {
  //   const CID = await client.storeBlob(
  //     new Blob([
  //       `${baseSVG}${name}</text>
  // </svg>`,
  //     ])
  //   );
  //   console.log("cid", CID);
  //   const status = await client.status(CID);
  //   console.log("status", status);
  //   setImageCIDdata(status);
  //   setImageView(`https://ipfs.io/ipfs/${CID}`);
  //   saveDataToNFTSorage(CID);
  // };

  //Create the IPFS CID of the json data
  const createNFTData = async () => {
    //lets load up this token with some metadata and our image and save it to NFT.storage
    //need status indicators
    const metadata = await client.store({
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
    });

    let imgViewArray = metadata.data.image.pathname.split("/");
    const imgView = `https://${imgViewArray[2]}.ipfs.dweb.link/${imgViewArray[3]}`;
    setLinks({ ...links, image: imgView });
    const status = await client.status(metadata.ipnft);
    console.log("status", status);
    askContractToMintNft(metadata.url);
  };

  const askContractToMintNft = async (IPFSurl) => {
    //should check the wallet chain is correct here
    console.log("name value", name);
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

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintMyNFT(IPFSurl);

        console.log("Mining...please wait.");
        await nftTxn.wait();

        setLinks({
          ...links,
          etherscan: `https://rinkeby.etherscan.io/tx/${nftTxn.hash}`,
        });

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        //these look wrong...
        console.log(
          `See nft on opensea: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        console.log(
          `See it on rarible: https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:{tokenID}`
        );
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
      className="cta-button connect-wallet-button"
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
    return (
      <div>
        <img
          src={links.image}
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

  const renderFooter = () => {
    return (
      <div className="footer-container">
        <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
        <a
          className="footer-text"
          href="https://twitter.com/developerally"
          target="_blank"
          rel="noreferrer"
        >
          DeveloperAlly
        </a>
      </div>
    );
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFTHack NFT Collection</p>
          <p className="sub-text">
            Limited edition! 100 personalised NFTs made by Filecoin for
            EthGlobal NFTHack 2022
          </p>
          <p className="sub-text">Remaining NFTS:</p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
          {links.etherscan &&
            renderLink(links.etherscan, "See your Transaction on Etherscan")}
          {links.openseaLink &&
            renderLink(links.openseaLink, "See your NFT on OpenSea")}
          {links.raribleLink &&
            renderLink(links.raribleLink, "See your NFT on Rarible")}
          {links.image && renderLink(links.image, "See IPFS image link")}
          {links.image && renderImagePreview()}
        </div>
        {renderFooter()}
      </div>
    </div>
  );
};

export default App;
