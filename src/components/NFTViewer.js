import React from "react";
import ImagePreview from "./ImagePreview";

//all logic for NFT viewing here
const NFTViewer = ({recentlyMinted, ...props}) => {
    return (
        <div className="nft-viewer-outer">
        <p className="sub-text">Most Recently Minted</p>
        <div className="nft-viewer-container">
            {recentlyMinted.map((el, idx) => {
            let linkArr = el.image.split("/");
            let link = `https://${linkArr[2]}.ipfs.dweb.link/${linkArr[3]}`;
            return (
                <div className="nft-viewer-column" key={idx}>
                {<ImagePreview imgLink={link}/>}
                <p>Name: {el.name}</p>
                </div>
            );
            })}
        </div>
        </div>
    );
}

export default NFTViewer;
