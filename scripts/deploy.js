const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory(
    "FilecoinNFTHack"
  );
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Call the function.
  // let txn = await nftContract.mintMyNFT(
  //   "ipfs://bafyreiah6nfc5ht2rifpnwuqssq6mkxhtjurrrcgnn7ms42d755edt7nqy/metadata.json"
  //   // "https://bafybeiggaxhjtplbrn26mox5npfd7rif3wt43h4oy55q5wfzyonmmrcqty.ipfs.dweb.link/nft.json"
  // );
  // // Wait for it to be mined.
  // await txn.wait();
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
