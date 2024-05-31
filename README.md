# QBFT Network Faucet Contract & Web Application
This project is a contract and web application that allows you to implement a faucet on a QBFT network. This README document provides detailed instructions on how to set up and use the application.

## Configuration File Overview
Below is an example of the config section. This configuration is essential for setting up your QBFT network.

```
{
  "config": {
    ...
    "qbft": {
      "blockperiodseconds": 2,
      "epochlength": 30000,
      "requesttimeoutseconds": 4,
      // Block Reward Option
      "blockreward": "50000000"
    }
  },
  ...
}
```
blockreward: Configures the reward for mining a block, specified in Wei. In the provided example, the reward is 50,000,000 Wei per block.

## Installation and Execution Guide
Follow these steps to set up and run the project.

### Step 1: Install Dependencies
First, install the project dependencies:

```
npm install
```

### Step 2: Deploy the Faucet Contract
Deploy the faucet contract to your QBFT network:

```
npx hardhat run scripts/deploy.js --network <your-network-name>
```
### Step 3: Run the Web Application
To start the web application, use the following command:

```
cd web

npm install
npm start
```

## Test Guide
```
npx hardat test
```

## Further Information
For more detailed guidance or support, please refer to the official Besu documentation.

This README aims to guide you through the setup and operation of your QBFT network faucet contract and web application. For any questions or further assistance, please contact the project management team.
