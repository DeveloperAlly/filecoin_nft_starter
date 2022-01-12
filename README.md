# Basic Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```

Ways to save your NFT SVG

1. You can save it in the contrct itself
2. You can save it as an IPFS CID
3. You can use web2 (we wouldn't do that though would we!)

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
