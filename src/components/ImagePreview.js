import React from "react";

const ImagePreview = ({imgLink, ...props}) => {
return(
      <div>
      <img
        src={imgLink}
        alt="NFT image preview"
        height="200px"
        width="200px"
        style={{ backgroundColor: "white" }}
      />
    </div>)
}

export default ImagePreview;