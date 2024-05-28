const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("Faucet", async () => {
    let faucet, owner, addr1;

    beforeEach(async () => {
        const Faucet = await ethers.getContractFactory("Faucet");

        faucet = await Faucet.deploy();

        await faucet.waitForDeployment();
        await faucet.initialize();

        [owner, addr1] = await ethers.getSigners();
    });

    describe("Initialize", async () => {
        it('should initialize once', async () => {
            await expect(
                faucet.initialize()
            ).to.be.revertedWithCustomError(faucet, "InvalidInitialization");
        });

        it('should Owner Account Has Role DEFAULT_ADMIN_ROLE', async () => {
            const defaultAdminRole = ethers.ZeroHash;

            expect(await faucet.hasRole(defaultAdminRole, await owner.getAddress())).to.be.true;
        });
    });
}