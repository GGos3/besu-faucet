require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  accounts: [
    process.env.OWNER_PRIVATE_KEY,
    process.env.OTHER_PRIVATE_KEY
  ],
};
