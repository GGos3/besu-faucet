const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const {ethers} = require("hardhat");


describe("Faucet", function () {

    async function setup() {
        const [owner, addr1] = await ethers.getSigners();
        const Faucet = await ethers.getContractFactory("Faucet");
        const faucet = await Faucet.deploy();
        await faucet.waitForDeployment();

        return {owner, addr1, faucet};
    }

    describe("Initialize", function () {
        it('should initialize once', async function () {
            const {owner, faucet} = await loadFixture(setup);

            await faucet.initialize();

            await expect(faucet.initialize()).to.be.revertedWithCustomError(faucet, "InvalidInitialization");
        });

        it('should Owner Account Has Role DEFAULT_ADMIN_ROLE', async function () {
            const {owner, faucet} = await loadFixture(setup);

            await faucet.initialize();

            const role = ethers.ZeroHash;

            expect(await faucet.hasRole(role, await owner.getAddress())).to.be.true;
        });
    });
});