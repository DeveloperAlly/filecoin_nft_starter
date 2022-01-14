# Info

This project is a simple ERC721 (ethereum) NFT minting contract & user interface.
It uses IPFS Protocol to create unique CIDs that point to the NFT data, it then stores this information on Filecoin for reliable & persistent storage.

It takes advantage of the very handy IPFS & Filecoin dev ecosystem tool NFT.Storage to make doing this easy (& free!).

The DApp UI is deployed on fleek.co. Fleek makes it easy to deploy websites and apps on the new open web: permissionless, trustless, censorship resistant, and free of centralized gatekeepers.

You can see the project live here: https://shrill-wave-1303.on.fleek.co/ 


# Read-me still a work in progress.... watch this git commit! XD

Dev Things (contracts):
- Solidity
- Hardhat
- Alchemy 

Ways to save your NFT SVG

1. You can save it in the contrct itself
2. You can save it as an IPFS CID
3. You can use web2... (we wouldn't do that though would we!)

Run contract: npx hardhat

> run scripts/run.js  
> Deploy contract to rinkeby:
> npx hardhat run scripts/deploy.js --network rinkeby

Running the front end localy (host on Fleek)
npm install && npm start

To make this project from scratch:

Dependencies:
Node installed.
Metamask, https://metamask.io/download.html
Moralis Quick server details (or infure/achemy),
etherscan account (for verifying contract)

Tasks - setup:

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

- Build the front end
- create a utils folder and put the deployed contract ABI json here

Tasks - deployment of front end

- Use Fleek.co

Resources

- Read the IPFS best practice guide for NFT's https://docs.ipfs.io/how-to/mint-nfts-with-ipfs/#a-short-introduction-to-nfts
- See the NFT.School guide https://nftschool.dev/
- Public Gateway status checker: https://ipfs.github.io/public-gateway-checker/
- Faucets for rinkeby eth:
