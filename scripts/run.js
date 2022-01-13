// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");

const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "FilecoinNFTHack"
  );
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function will base svg and the name?
  let txn = await nftContract.mintMyNFT(
    "ipfs://bafyreiah6nfc5ht2rifpnwuqssq6mkxhtjurrrcgnn7ms42d755edt7nqy/metadata.json"
  );
  // Wait for it to be mined.
  await txn.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
