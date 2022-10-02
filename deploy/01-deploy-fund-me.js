const { network } = require("hardhat");
const {
  networkConfig,
  developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const { chainId } = network.config;

  let ethUSDPriceFeedAddress;
  if (developmentChains.includes(network.name)) {
    const ethUSDAggregator = await deployments.get("MockV3Aggregator");
    ethUSDPriceFeedAddress = ethUSDAggregator.address;
  } else {
    ethUSDPriceFeedAddress = networkConfig[chainId].ethUSDPriceFeed;
  }

  const args = [ethUSDPriceFeedAddress];
  const fundMe = await deploy("FundMe", {
    from: deployer,
    args, // put price feed address,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  log("----------------------------------");

  if (
    !developmentChains.includes(network.name) &&
    process.env.ETHERSCAN_API_KEY
  ) {
    await verify(fundMe.address, args);
  }
};

module.exports.tags = ["all", "fundme"];
