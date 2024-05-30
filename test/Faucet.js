const {loadFixture} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const {ethers} = require("hardhat");

describe("Faucet", async () => {
    let faucet, owner, addr1, snapshotId;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const Faucet = await ethers.getContractFactory("Faucet");

        faucet = await Faucet.deploy();

        await faucet.waitForDeployment();
        await faucet.initialize();

        const tx = await owner.sendTransaction({
            to: await faucet.getAddress(),
            value: ethers.parseEther("10.0")
        });

        await tx.wait();
        snapshotId = await ethers.provider.send("evm_snapshot", []);
    });

    afterEach(async () => {
        await ethers.provider.send("evm_revert", [snapshotId]);
    });

    describe("Initialize", async () => {
        it('contract balance should not be empty', async () => {
            expect(await ethers.provider.getBalance(await faucet.getAddress()))
                .to.be.gt(0);
        });

        it('should emit FaucetReceive Event', async () => {
            const filter = faucet.filters.FundsReceived;
            const events = await faucet.queryFilter(filter, -1);
            const args = events[0].args;

            expect(events.length).to.gt(0);
            expect(args.from).to.equal(await owner.getAddress());
            expect(args.amount).to.equal(ethers.parseEther("10.0"));
        });

        it('should only initialize once', async () => {
            expect(faucet.initialize())
                .to.be.revertedWithCustomError(faucet, "InvalidInitialization");
        });

        it('Owner Account should have DEFAULT_ADMIN_ROLE', async () => {
            const defaultAdminRole = ethers.ZeroHash;

            expect(await faucet.hasRole(defaultAdminRole, await owner.getAddress()))
                .to.be.true;
        });
    });

    describe("Faucet", async () => {
        it('should be addr1 balance is increase by 1eth', async () => {
            await faucet.faucet(await addr1.getAddress(), ethers.parseEther("1.0"));

            expect(await ethers.provider.getBalance(await addr1.getAddress()))
                .to.equal(ethers.parseEther("10001.0"));
        });

        it('should emit Faucet Event', async () => {
            await faucet.faucet(await addr1.getAddress(), ethers.parseEther("1.0"));

            const filter = faucet.filters.FaucetEvent;
            const events = await faucet.queryFilter(filter, -1);
            const args = events[0].args;

            expect(events.length).to.gt(0);
            expect(args.from).to.equal(await owner.getAddress());
            expect(args.to).to.equal(await addr1.getAddress());
            expect(args.amount).to.equal(ethers.parseEther("1.0"));
        });

        it('should be call faucet over one day', async () => {
            await faucet.faucet(await addr1.getAddress(), ethers.parseEther("1.0"));

            await ethers.provider.send("evm_increaseTime", [86400]);
            await ethers.provider.send("evm_mine");

            await faucet.faucet(await addr1.getAddress(), ethers.parseEther("1.0"));

            expect(await ethers.provider.getBalance(await addr1.getAddress()))
                .to.equal(ethers.parseEther("10002.0"));
        });

        it('should not allow to call faucet many time in the same day', async () => {
            await faucet.faucet(await addr1.getAddress(), ethers.parseEther("1.0"));

            expect(faucet.faucet(await addr1.getAddress(), ethers.parseEther("1.0")))
                .to.be.revertedWithCustomError(faucet, "DailyLimitReached");
        });

        it('should not allow to call faucet without admin role', async () => {
            expect(faucet.connect(addr1).faucet(await addr1.getAddress(), ethers.parseEther("1.0")))
                .to.be.revertedWithCustomError(faucet, "AccessControlUnauthorizedAccount");
        });
    });

    describe("Admin", async () => {

        const ROLE_ADMIN = ethers.solidityPackedKeccak256(["string"], ["ROLE_ADMIN"]);

        it('should allow to add new admin', async () => {
            await faucet.addAdmin(await addr1.getAddress());

            expect(await faucet.hasRole(ROLE_ADMIN, await addr1.getAddress()))
                .to.be.true;
        });

        it('should allow to remove admin', async () => {
            await faucet.addAdmin(await addr1.getAddress());
            await faucet.removeAdmin(await addr1.getAddress());

            expect(await faucet.hasRole(ROLE_ADMIN, await addr1.getAddress()))
                .to.be.false;
        });

        it('should not allow to add new admin with does have DEFAULT_ADMIN_ROLE', async () => {
            expect(faucet.connect(addr1).addAdmin(await addr1.getAddress()))
                .to.be.revertedWithCustomError(faucet, "AccessControlUnauthorizedAccount");
        });
    });
});
