# Info

This project is a simple ERC721 (ethereum) NFT minting contract & user interface.
It uses IPFS Protocol to create unique CIDs that point to the NFT data, it then stores this information on Filecoin for reliable & persistent storage.

It takes advantage of the very handy IPFS & Filecoin dev ecosystem tool NFT.Storage to make doing this easy (& free!).

The DApp UI is deployed on fleek.co. Fleek makes it easy to deploy websites and apps on the new open web: permissionless, trustless, censorship resistant, and free of centralized gatekeepers.

You can see the project live here: https://shrill-wave-1303.on.fleek.co/ 


# Notes
Be aware the way I am storing the svg in the front-end is not secure. It's easily hackable. The main point of the repo is really to show how easy it is to use NFT.storage to save and retrieve files, as well as how easy it is to use Fleek as your decentralised front end server (instead of say netlify or vercel).

I'll be doing some updates on this package in future to build on it and ensure more security. :)

# Quick start
1. Clone the project & move to project directory `>git clone ... && cd ..`
2. Create a .env file in the root `>touch .env`
3. Get an NFT.Storage API key https://nft.storage/ and add this to the .env
4. Add your rinkeby blockchain server api and url to the .env file (ive used alchemy here, though moralis & infura are also awesome)
5. Install packages `>npm install`
6. Deploy the solidity contract to the rinkeby testnet using hardhat `>npx hardhat run scripts/deploy.js --network rinkeby`
7. Add your contract address to the .env file
8. Run your front end in dev mode `>npm start` OR deploy with Fleek https://fleek.co/

# Read-me still a work in progress.... watch this git commit! XD

Dev Things (contracts):
- Solidity
- Hardhat
- Alchemy 

Ways to save your NFT SVG

1. You can save it in the contract itself
2. You can save it as an IPFS CID
3. You can use web2... (we wouldn't do that though would we!)

Run contract: npx hardhat

> run scripts/run.js  
> Deploy contract to rinkeby:
> npx hardhat run scripts/deploy.js --network rinkeby

Running the front end localy (or host on Fleek)
npm install && npm start

To make this project from scratch:

Dependencies:
Node installed.
Metamask, https://metamask.io/download.html
Alchemy server details (or infura/moralis),
etherscan account (for verifying contract)

Setup from scratch instead:

> npx create-react-app my-app-name
> cd my-app-name
> npm install --save-dev hardhat
> npx hardhat (to get a sample project - choose basic project so we get all the folders. Choose no to gitignore and y to dependencies)

install dependencies:

> npm install --save-dev @nomiclabs/hardhat-waffle ethereum-waffle chai @nomiclabs/hardhat-ethers @nomiclabs/hardhat-etherscan @openzeppelin/contracts
> npm install ethers dotenv

Tasks - development of contract

> touch .env
> add .env to the .gitignore file
> rm ./contracts/Greeter.sol
> rm ./scripts/sample-script.js

> touch ./contracts/FilecoinNFTHack.sol
> touch ./scripts/run.js
> touch ./scripts/deploy.js

Write solidity contract
Write run.js and test your contract

> npx hardhat run scripts/run.js

Tasks - Deployment of Solidity contract
Sign up for Moralis and get a QuickNode
Add it to hardhat config
Sign up for etherscan / get an API key & add it to hardhat.config
networks: {
rinkeby: {
url: process.env.MORALIS_RINKEBY_API_URL,
accounts: [process.env.METAMASK_RINKEBY_PRIVATE_KEY],
},
},
etherscan: {
// Your API key for Etherscan
// Obtain one at https://etherscan.io/
apiKey: process.env.ETHERSCAN_API_KEY,
}

> npx hardhat run scripts/deploy.js --network rinkeby

Tasks - development of front end

- create a utils folder and put the deployed contract ABI json here

Tasks - deployment of front end

- Use Fleek.co

Resources

- Read the IPFS best practice guide for NFT's https://docs.ipfs.io/how-to/mint-nfts-with-ipfs/#a-short-introduction-to-nfts
- See the NFT.School guide https://nftschool.dev/
- Public Gateway status checker: https://ipfs.github.io/public-gateway-checker/
- Faucets for rinkeby eth: https://faucets.chain.link/rinkeby
