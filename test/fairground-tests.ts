import { ethers, network } from 'hardhat';
import { Fairground, Fairground__factory } from '../frontend/typechain';
import { expect } from 'chai';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BigNumber } from 'ethers';

const rentRatio = 0.05;
const bidRatio = 0.95;
const bidToReserve = (val: number) => val * bidRatio * rentRatio;
const { parseEther, formatEther } = ethers.utils;
const setValue = (val: number) => ({ value: parseEther(String(val)) });
const auctionDuration = 3 * 60;
const LeaseDuration = 10 * 60;
const getTimestamp = (time: BigNumber) => Number(time) * 1000;

const propertyDiagnosticLogging = async (fairground: Fairground) => {
    const properties = await fairground.propertyList(1, 5);
    properties.forEach((prop) => {
        console.log('id', Number(prop.id));
        console.log('bid', formatEther(prop.currentBid));
        console.log('auctionEnd', new Date(getTimestamp(prop.auctionEnd)).toISOString());
        console.log('leaseEnd', new Date(getTimestamp(prop.leaseEnd)).toISOString());
        console.log('owner', prop.owner);
        console.log('topBidder', prop.topBidder);
        console.log('today', new Date().toISOString());
    });
};

describe('Fairground', () => {
    let FairgroundFactory: Fairground__factory;
    let fairground: Fairground;
    let signers: SignerWithAddress[];
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;
    let addr2: SignerWithAddress;
    let addr3: SignerWithAddress;

    beforeEach(async () => {
        await network.provider.send('evm_setAutomine', [true]);
        FairgroundFactory = (await ethers.getContractFactory('Fairground')) as Fairground__factory;
        fairground = await FairgroundFactory.deploy();
        await fairground.deployed();
        signers = await ethers.getSigners();
        owner = signers[0];
        addr1 = signers[1];
        addr2 = signers[2];
        addr3 = signers[3];
    });

    describe('mint', () => {
        it('Should mint a property to a given address', async () => {
            await fairground.mint(addr1.address);
            expect(await fairground.connect(addr1).isOwner(1)).to.equal(true);
        });
    });

    describe('propertyList', () => {
        beforeEach(async () => {
            await fairground.mint(owner.address);
            await fairground.mint(addr1.address);
            await fairground.mint(addr1.address);
            await fairground.mint(addr1.address);
            await fairground.mint(addr1.address);
        });

        it('Should return a list of properties', async () => {
            const properties = await fairground.propertyList(1, 5);

            expect(properties.length).to.equal(5);
            expect(properties[0].id).to.equal(1);
            expect(properties[1].owner).to.equal(addr1.address);
        });

        it('Should limit the property count by pageSize', async () => {
            const properties = await fairground.propertyList(1, 3);

            expect(properties.length).to.equal(3);
        });

        it('Should select properties by page number', async () => {
            const properties = await fairground.propertyList(2, 2);

            expect(properties.length).to.equal(2);
            expect(properties[0].id).to.equal(3);
            expect(properties[1].id).to.equal(4);
        });

        it('Should return partial pages when count is larger than remaining', async () => {
            const properties = await fairground.propertyList(2, 3);

            expect(properties.length).to.equal(2);
            expect(properties[0].id).to.equal(4);
            expect(properties[1].id).to.equal(5);
        });

        it('Should revert when selection is out of range', async () => {
            await expect(fairground.propertyList(6, 5)).to.be.revertedWith('Out of range');
        });
    });

    describe('bid', () => {
        beforeEach(async () => {
            await fairground.mint(owner.address);
        });

        it('Should stop insufficient bid amount', async () => {
            await expect(fairground.connect(addr1).placeBid(1, setValue(0))).to.be.revertedWith('Must be greater than 0');
        });

        describe('when reserve price is set', () => {
            const reserveTarget = 2;
            const reserve = bidToReserve(reserveTarget);
            const outbid = setValue(3);
            beforeEach(async () => {
                await fairground.mint(owner.address);
                await fairground.connect(owner).increaseReserve(1, setValue(reserve));
            });

            it('Should prevent bids of equal or lesser value', async () => {
                await expect(fairground.connect(addr1).placeBid(1, setValue(1))).to.be.revertedWith('Bid too low');
                await expect(fairground.connect(addr1).placeBid(1, setValue(2))).to.be.revertedWith('Bid too low');
            });

            it('Should add reserve funds to treasury', async () => {
                const treasury = await fairground.communityFunds();

                expect(Number(formatEther(treasury))).to.equal(reserve);
            });

            it('Should refund prorated reserve funds when bid is accepted', async () => {
                await fairground.connect(addr1).placeBid(1, outbid);
                const startingBalance = await owner.getBalance();
                const auctionEnd = await fairground.auctionEndDate(1);
                const LeaseEnd = await fairground.leaseEndDate(1);

                await network.provider.send('evm_setNextBlockTimestamp', [Number(auctionEnd) + 1]);
                await network.provider.send('evm_mine');

                await fairground.connect(addr1).updateClaim(1);
                const balance = await owner.getBalance();

                const auctionWinnings = Number(outbid.value) * bidRatio;
                const remainingTime = Number(LeaseEnd) - Number(auctionEnd) + 1;
                const refund = (Number(parseEther(String(reserve))) * remainingTime) / LeaseDuration;
                const expectedIncrease = refund + auctionWinnings;
                const balanceIncrease = Number(balance) - Number(startingBalance);
                const variance = Number(parseEther('0.01'));

                expect(Math.abs(balanceIncrease - expectedIncrease)).to.be.lessThan(variance);
            });

            describe('when reserve is outbid and auction ends', () => {
                let reserve: BigNumber;
                let outbid: BigNumber;
                let newReserve: BigNumber;

                beforeEach(async () => {
                    reserve = await fairground.currentBid(1);
                    await fairground.connect(addr2).placeBid(1, setValue(Number(formatEther(reserve)) + 1));
                    outbid = await fairground.currentBid(1);
                    const auctionEndDate = await fairground.auctionEndDate(1);
                    await network.provider.send('evm_setNextBlockTimestamp', [Number(auctionEndDate) + 1]);
                    await network.provider.send('evm_mine');
                    const expired = await fairground.isAuctionExpired(1);
                    newReserve = await fairground.currentBid(1);
                    expect(expired).to.be.true;
                });

                it('Should set reserve to winning bid', async () => {
                    expect(outbid).to.be.greaterThan(reserve);
                    expect(outbid).to.equal(newReserve);
                });

                describe('when rent period expires', () => {
                    beforeEach(async () => {
                        const LeaseEnd = await fairground.leaseEndDate(1);
                        await network.provider.send('evm_setNextBlockTimestamp', [Number(LeaseEnd) + 1]);
                        await network.provider.send('evm_mine');
                        const expired = await fairground.isLeaseExpired(1);
                        expect(expired).to.equal(true);
                    });

                    it('Should keep reserve set to winning bid when rent period expires', async () => {
                        const reserve = await fairground.currentBid(1);
                        expect(reserve).to.equal(outbid);
                    });

                    it('Should allow previous owner to bid', async () => {
                        const reserve = await fairground.currentBid(1);
                        await fairground.connect(addr1).placeBid(1, setValue(Number(formatEther(reserve)) + 1));
                        const newBid = await fairground.currentBid(1);
                        expect(newBid).to.be.greaterThan(reserve);
                    });

                    it('Should allow new owner to set reserve', async () => {
                        const reserve = await fairground.currentBid(1);
                        await fairground.connect(addr2).increaseReserve(1, setValue(Number(formatEther(reserve)) + 1));
                        const newBid = await fairground.currentBid(1);
                        expect(newBid).to.be.greaterThan(reserve);
                    });

                    it('Should allow a 3rd party to bid', async () => {
                        const reserve = await fairground.currentBid(1);
                        await fairground.connect(addr3).placeBid(1, setValue(Number(formatEther(reserve)) + 1));
                        const newBid = await fairground.currentBid(1);
                        expect(newBid).to.be.greaterThan(reserve);
                    });
                });
            });
        });

        describe('When valid bid is made', async () => {
            const valueOf1 = setValue(1);
            let bidAmount: BigNumber;

            beforeEach(async () => {
                await fairground.connect(addr1).placeBid(1, valueOf1);
                bidAmount = await fairground.currentBid(1);
            });

            it('Should set current bid to bid amount', async () => {
                expect(bidAmount).to.equal(valueOf1.value);
            });

            it('Should set top bidder to bidders address', async () => {
                const property = await fairground.propertyList(1, 1);
                expect(property[0].topBidder).to.equal(addr1.address);
            });

            describe('When competing bid is made', async () => {
                const valueOf2 = setValue(2);

                beforeEach(async () => {
                    await fairground.connect(addr2).placeBid(1, valueOf2);
                });

                it('Should update current bid and top bidder', async () => {
                    const currentBid = await fairground.currentBid(1);
                    const property = await fairground.propertyList(1, 1);

                    expect(currentBid).to.equal(valueOf2.value);
                    expect(property[0].topBidder).to.equal(addr2.address);
                });

                describe('When auction expires and bid is accepted', async () => {
                    let ownerStartingBalance: BigNumber;
                    const previousBid = Number(valueOf2.value);
                    const groundRent = previousBid * rentRatio;
                    const ownerCompensation = previousBid - groundRent;

                    beforeEach(async () => {
                        ownerStartingBalance = await owner.getBalance();
                        let expired = await fairground.isAuctionExpired(1);
                        expect(expired).to.equal(false);

                        await network.provider.send('evm_increaseTime', [auctionDuration + 1]);
                        await network.provider.send('evm_mine');

                        await fairground.updateClaim(1);

                        expired = await fairground.isAuctionExpired(1);
                        expect(expired).to.equal(true);
                    });

                    it('Should set highest bidder to new owner', async () => {
                        const newOwner = await fairground.ownerOf(1);
                        expect(newOwner).to.equal(addr2.address);
                    });

                    it('Should set previous bid as new reserve', async () => {
                        const reserveAmount = await fairground.currentBid(1);
                        await fairground.updateClaim(1);
                        expect(reserveAmount).to.equal(valueOf2.value);
                    });

                    it('Should compensate previous owner', async () => {
                        const newBalance = await owner.getBalance();
                        const expectedNewBalance = Number(ownerStartingBalance) + ownerCompensation;
                        const difference = Math.abs(Number(newBalance) - expectedNewBalance);
                        const variance = Number(parseEther('0.0001'));

                        expect(difference).to.be.lessThan(variance);
                    });

                    it('Should collect ground rent from previous auction', async () => {
                        const newTreasury = await fairground.communityFunds();
                        expect(Number(newTreasury)).to.equal(groundRent);
                    });

                    describe('When rent period expires', async () => {
                        let expired;

                        beforeEach(async () => {
                            await network.provider.send('evm_increaseTime', [LeaseDuration + 1]);
                            await network.provider.send('evm_mine');

                            expired = await fairground.isLeaseExpired(1);
                            expect(expired).to.equal(true);
                        });

                        it('Should set bid to zero', async () => {
                            const bid = await fairground.currentBid(1);
                            expect(bid).to.equal(0);
                        });
                    });

                    describe('When new bid is made', async () => {
                        let newAuctionStartDate: number;

                        beforeEach(async () => {
                            expect(bidAmount).to.equal(valueOf1.value);
                            await fairground.connect(addr3).placeBid(1, setValue(3));
                            expect(await fairground.ownerOf(1)).to.equal(addr2.address);

                            const block = await ethers.provider.getBlock('latest');
                            newAuctionStartDate = block.timestamp;
                        });

                        it('Should relaunch the auction', async () => {
                            const auctionEndDate = await fairground.auctionEndDate(1);
                            const expectedEndDate = Number(newAuctionStartDate * 1000) + auctionDuration * 1000;
                            expect(getTimestamp(auctionEndDate)).to.equal(expectedEndDate);
                        });
                    });
                });
            });
        });
    });

    describe('targetBid', () => {
        beforeEach(async () => {
            await fairground.mint(owner.address);
            await fairground.connect(addr1).placeBid(1, setValue(1));
        });

        it('Should not take into account refunded previous bids', async () => {
            const firstBid = await fairground.currentBid(1);
            const secondBid = setValue(4);
            await fairground.connect(addr2).placeBid(1, secondBid);
            const target = parseEther('8');
            const bidRequired = await fairground.connect(addr1).targetBid(1, target);
            expect(Number(target)).to.equal(Number(bidRequired));
        });

        it('Should return payment amount needed to set target reserve', async () => {
            const bid = await fairground.currentBid(1);
            const match = await fairground.connect(owner).targetBid(1, parseEther('1'));
            expect(Number(match)).to.equal(bidToReserve(Number(bid)));
        });

        it('Should take into account previous reserve rent paid', async () => {
            const firstReserve = setValue(bidToReserve(1));
            await fairground.connect(owner).increaseReserve(1, firstReserve);
            const secondReserve = setValue(bidToReserve(1));
            await fairground.connect(owner).increaseReserve(1, secondReserve);
            const targetReserve = parseEther('3');
            const targetIncrease = await fairground.connect(owner).targetBid(1, targetReserve);
            expect(Number(targetIncrease)).to.equal(bidToReserve(Number(targetReserve)) - Number(firstReserve.value) - Number(secondReserve.value));
        });
    });
});
