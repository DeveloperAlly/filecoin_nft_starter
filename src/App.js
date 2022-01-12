import "./styles/App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import filecoinNFTHack from "./utils/FilecoinNFTHack.json";

import { NFTStorage, File } from "nft.storage";
import { pack } from "ipfs-car/pack";

// const apiKey = "YOUR_API_KEY";
// process.env.REACT_APP_NFT_STORAGE_API_KEY;
// const client = new NFTStorage({ token: apiKey });

// const metadata = await client.store({
//   name: "Pinpie",
//   description: "Pin is not delicious beef!",
//   image: new File(
//     [
//       /* data */
//     ],
//     "pinpie.jpg",
//     { type: "image/jpg" }
//   ),
// });
// console.log(metadata.url);

// Constants
const TWITTER_HANDLE = "developerally";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

const App = () => {
  const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [tx, setTx] = useState("");
  const [openseaLink, setOpenSeaLink] = useState("");
  const [raribleLink, setRaribleLink] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
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
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          filecoinNFTHack.abi,
          signer
        );

        // THIS IS THE MAGIC SAUCE.
        // This will essentially "capture" our event when our contract throws it.
        // If you're familiar with webhooks, it's very similar to that!
        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          setOpenSeaLink(
            `https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
          setRaribleLink(
            `https://rinkeby.rarible.com/token/${CONTRACT_ADDRESS}:${tokenId.toNumber()}`
          );
          // alert(
          //   `Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          // );
        });

        console.log("Setup event listener!");
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
          pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{1,63}$"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </p>
      <button
        onClick={askContractToMintNft}
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

  const askContractToMintNft = async () => {
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
        let nftTxn = await connectedContract.makeAnEpicNFT(name);

        console.log("Mining...please wait.");
        await nftTxn.wait();

        setTx(`https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  /*
   * Added a conditional render! We don't want to show Connect to Wallet if we're already conencted :).
   */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFTHack NFT Collection</p>
          <p className="sub-text">Each unique. Only 50 copies.</p>
          {currentAccount === ""
            ? renderNotConnectedContainer()
            : renderMintUI()}
          {}
          {tx && (
            <p>
              <a
                className="footer-text"
                href={tx}
                target="_blank"
                rel="noreferrer"
              >
                See your Transaction on Etherscan
              </a>
            </p>
          )}
          {openseaLink && (
            <p>
              <a
                className="footer-text"
                href={openseaLink}
                target="_blank"
                rel="noreferrer"
              >
                See your NFT on OpenSea
              </a>
            </p>
          )}
          {raribleLink && (
            <p>
              <a
                className="footer-text"
                href={raribleLink}
                target="_blank"
                rel="noreferrer"
              >
                See your NFT on Rarible
              </a>
            </p>
          )}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
