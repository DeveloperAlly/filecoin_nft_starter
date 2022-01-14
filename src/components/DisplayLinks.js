import React from "react";

const DisplayLinks = ({linksObj, ...props}) => {

  const renderLink = (link, description) => {
    return (
      <p>
      <a className="footer-text" href={link} target="_blank" rel="noreferrer">
        {description}
      </a>
    </p>
    )
  }

  return (
    <>
    {linksObj.etherscan &&
      renderLink(linksObj.etherscan, "See your Transaction on Etherscan")}
    {linksObj.opensea &&
      renderLink(linksObj.opensea, "See your NFT on OpenSea")}
    {linksObj.rarible &&
      renderLink(linksObj.rarible, "See your NFT on Rarible")}
      </>
  )
}
export default DisplayLinks;
