import { expect } from "chai";
import { ethers } from "hardhat";

describe("EscrowContract", async () => {
  let Escrow: any,
    accounts: any,
    escrow: any,
    buyer: any,
    seller: any,
    judge: any,
    thirdPartyToken: string,
    evidence: any,
    agreementId: number;

  beforeEach(async () => {
    //const [owner, addr1, addr2] = await ethers.getSigners();
    accounts = await ethers.getSigners();
    buyer = accounts[0];
    seller = accounts[1];
    judge = accounts[2];
    thirdPartyToken = "0x0000000000000000000000000000000000000001";
    evidence =
      "0x4e6e6d38797a31356d356632717a4c344c564a3254426b436a51663933586e584d784d42626e3446507a5374";
    agreementId = 0;

    escrow = await (
      await ethers.getContractFactory("EscrowContract")
    ).deploy(judge.address);
  });

  it("Should allow buyer to create an agreement", async function () {
    const value = ethers.parseEther("1.0");

    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.buyer).to.equal(buyer.address);
    expect(agreement.seller).to.equal(seller.address);
    expect(agreement.value).to.equal(value);
  });

  it("Should allow buyer to add evidence of the agreement terms", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;

    const evidenceCID = evidence;
    await escrow.connect(buyer).addEvidence(agreementId, evidenceCID);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.evidenceCID).to.equal(evidenceCID);
  });

  it("Should allow buyer to send payments to the escrow", async function () {
    const initBalance: bigint = await ethers.provider.getBalance(buyer);
    const value: bigint = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    const remainingBalance: bigint = await ethers.provider.getBalance(buyer);
    expect((initBalance - remainingBalance).toString()).to.equal(
      "1000369300307827978"
    );
  });

  it("Should allow buyer to reclaim payments before seller confirms", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );

    agreementId = 0;
    await escrow.connect(buyer).buyerReclaims(agreementId);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.status).to.equal(1); // Corresponds to Funds_Reclaimed
  });

  it("Should allow seller to confirm the agreement", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    await escrow.connect(seller).sellerConfirmsAgreement(agreementId);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.sellerConfirmedAgreement).to.be.true;
  });

  it("Should lock the agreement after seller confirmation", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    await escrow.connect(seller).sellerConfirmsAgreement(agreementId);
    const isLocked = await escrow.agreementIsLocked(agreementId);
    expect(isLocked).to.be.true;
  });

  it("Should allow buyer to confirm receipt of service", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    await escrow.connect(seller).sellerConfirmsAgreement(agreementId);
    await escrow.connect(buyer).confirmReceived(agreementId);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.status).to.equal(5); // Corresponds to Concluded
  });

  it("Should allow buyer to reject receipt of service", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    await escrow.connect(buyer).buyerRejectsReceipt(agreementId);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.status).to.equal(2); // Corresponds to Pending_Resolution
  });

  it("Should allow the judge to decide in favor of the buyer", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    await escrow.connect(seller).sellerConfirmsAgreement(agreementId);
    await escrow.connect(buyer).buyerRejectsReceipt(agreementId);
    await escrow.connect(judge).executeDecision(agreementId, true);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.status).to.equal(3); // Corresponds to Resolved_To_Buyer
  });

  it("Should allow the judge to decide in favor of the seller", async function () {
    const value = ethers.parseEther("1.0");
    await escrow
      .connect(buyer)
      .createAgreement(
        buyer.address,
        seller.address,
        value,
        thirdPartyToken,
        evidence,
        {
          value,
        }
      );
    agreementId = 0;
    await escrow.connect(seller).sellerConfirmsAgreement(agreementId);
    await escrow.connect(buyer).buyerRejectsReceipt(agreementId);
    await escrow.connect(judge).executeDecision(agreementId, false);
    const agreement = await escrow.agreements(agreementId);
    expect(agreement.status).to.equal(4); // Corresponds to Resolved_To_Seller
  });
});
