const { getNamedAccounts, ethers } = require("hardhat");

console.log("HHHHH");
async function main() {
  const { deployer } = await getNamedAccounts();
  const fundMe = await ethers.getContract("FundMe", deployer);

  console.log("Funding..........");
  const tx = await fundMe.fund({ value: ethers.utils.parseEther("0.1") });
  await tx.wait(1);
  console.log("Funded.....");
}

main()
  .then()
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
