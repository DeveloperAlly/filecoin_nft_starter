// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

// We first import some OpenZeppelin Contracts.
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol"; //alows for console.logs in a solidity contract"

//extending from 
contract FilecoinNFTHackOLD is ERC721URIStorage {
    // Variables
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public maxNFTs;
    uint256 public remainingMintableNFTs;

    struct myNFT {
        address owner;
        string tokenURI;
        uint256 tokenId;
    }
    myNFT [] public nftCollection;

    /* tokenURI
    {
        "name": "Their name + Filecoin @ NFTHack 2022"
        "description": "NFT created for EthGlobal NFTHack 2022 and limited to 100 tokens"
        "image": //IPFS pinned image content CID
        "version": 1
        "strength": ""
        "intelligence": ""
    }
    */
    event NewFilecoinNFTMinted(address sender, uint256 tokenId, string tokenURI);

    //This sets our collection details. Anything minted by this contract will fall under this header
    constructor() ERC721 ("EthGlobal NFTHack2022", "Filecoin Starter NFTs") {
        console.log("This is my NFT contract");
        maxNFTs=100; //set a limit to number of nft's that are mintable
    }

    // Random function to pick some random traits for this NFT
    // better to use chainlink VRF for this
    // We are going to use our front end to compute all of these things before saving the IPFS TokenURI here
    // function random(string memory input) internal pure returns (uint256) {
    //     return uint256(keccak256(abi.encodePacked(input)));
    // }

    // function getRemainingMintableNFTs() public view returns (uint256) {
    //     return maxNFTs - _tokenIds.current();
    // }

    function mintMyNFT(string memory ipfsURI) public {
        require(_tokenIds.current() < maxNFTs);
        uint256 newItemId = _tokenIds.current();

        myNFT memory newNFT = myNFT ({
            owner: msg.sender,
            tokenURI: ipfsURI,
            tokenId: newItemId
        });

        _safeMint(msg.sender, newItemId);
    
        // Update your URI!!!
        _setTokenURI(newItemId, ipfsURI);
    
        _tokenIds.increment();

        remainingMintableNFTs = maxNFTs-_tokenIds.current();

        nftCollection.push(newNFT);

        emit NewFilecoinNFTMinted(msg.sender, newItemId, ipfsURI);
    }

    /**
    * @notice helper function to display NFTs for frontends
    */
    function getNFTCollection() public view returns (myNFT [] memory) {
        return nftCollection;
    }
    

    //function stubs from https://docs.openzeppelin.com/contracts/4.x/api/token/erc721
    // balanceOf(owner)

    // ownerOf(tokenId)

    // safeTransferFrom(from, to, tokenId)

    // transferFrom(from, to, tokenId)

    // approve(to, tokenId)

    // getApproved(tokenId)

    // setApprovalForAll(operator, _approved)

    // isApprovedForAll(owner, operator)

    // safeTransferFrom(from, to, tokenId, data)

    //events:
    // Transfer(from, to, tokenId)

    // Approval(owner, approved, tokenId)

    // ApprovalForAll(owner, operator, approved)

}