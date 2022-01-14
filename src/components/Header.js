import React from "react";
import nftHackLogo from "../assets/nfthack-logo.svg";

const Header = () => {
  return (
    <>
      <a
        href="https://hackathons.filecoin.io/"
        target="_blank"
        rel="noreferrer"
      >
        <img
          alt="NFTHack Logo"
          style={{ height: "200px" }}
          src={nftHackLogo}
        ></img>
      </a>
      <p className="header gradient-text">NFTHack NFT Collection</p>
      <p className="sub-text">
        Limited edition! 100 personalised NFTs made by Filecoin for EthGlobal
        NFTHack 2022
      </p>
    </>
  );
};

export default Header;
