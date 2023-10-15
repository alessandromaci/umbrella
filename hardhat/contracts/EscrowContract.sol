// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";
import {Errors} from "./lib/Errors.sol";

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title Escrow Contract
 * @notice This contract manages trustless escrows for buyer-seller transactions.
 * @dev This contract has been developed to facilitate escrowed transactions between parties.
 * @author alessandromaci
 */
contract EscrowContract {

    enum Status {
        No_Litigation,
        Funds_Reclaimed,
        Pending_Resolution,
        Resolved_To_Buyer,
        Resolved_To_Seller,
        Concluded
    }

    struct Agreement {
        address payable buyer;
        address payable seller;
        uint256 value; // expressed in wei
        address tokenAddress;  // 0x0000000000000000000000000000000000000001 means ETH
        bool sellerConfirmedAgreement;
        Status status;
        bytes evidenceCID;
    }

    uint256 public numAgreements;
    address public judge;
    address private ethereum = 0x0000000000000000000000000000000000000001;
    mapping (uint256 => Agreement) public agreements;
    mapping (address => uint256[]) public agreementIdsByParticipant;

    // Events
    event AgreementCreated(uint256 agreementId, address indexed buyer, address indexed seller, uint256 value, address tokenAddress);
    event EvidenceAdded(uint256 agreementId, bytes evidenceCID);
    event AgreementConfirmed(uint256 agreementId);
    event ReceiptConfirmed(uint256 agreementId);
    event FundsReclaimed(uint256 agreementId);
    event BuyerRejectedReceipt(uint256 agreementId);
    event DecisionExecuted(uint256 agreementId, bool inFavorOfBuyer);

    constructor(address _judge) {
        judge = _judge;
    }

    /**
     * @notice Creates an agreement between a buyer and seller.
     * @param buyer Address of the buyer.
     * @param seller Address of the seller.
     * @param value Amount to be escrowed.
     * @param tokenAddress Address of the ERC20 token (use ethereum for ETH).
     */
    function createAgreement(address payable buyer, address payable seller, uint256 value, address tokenAddress) public payable {
        // Check sender is buyer
        if (msg.sender != buyer) revert Errors.NotABuyer();

        // Validate payment
        if (msg.sender == seller) revert Errors.NotSameBuyerAndSeller();
        if (tokenAddress == ethereum && msg.value != value) revert Errors.InsufficientPayment();
        if (tokenAddress != ethereum) {
            IERC20(tokenAddress).transferFrom(msg.sender, address(this), value);
            if (IERC20(tokenAddress).balanceOf(address(this)) < value) revert Errors.InsufficientPayment();
        }

        Agreement memory agreement = Agreement(buyer, seller, value, tokenAddress, false, Status.No_Litigation, "");
        uint256 agreementId = numAgreements++;
        agreements[agreementId] = agreement;
        agreementIdsByParticipant[buyer].push(agreementId);
        agreementIdsByParticipant[seller].push(agreementId);

        emit AgreementCreated(agreementId, buyer, seller, value, tokenAddress);
    }

    /**
     * @notice Add evidence to an agreement.
     * @param agreementId The ID of the agreement.
     * @param evidenceCID The content identifier for the evidence.
     */
    function addEvidence(uint256 agreementId, bytes memory evidenceCID) external {
        Agreement storage agreement = agreements[agreementId];
        if (msg.sender != agreement.buyer && msg.sender != agreement.seller) revert Errors.NotAParticipant();

        agreement.evidenceCID = evidenceCID;
        emit EvidenceAdded(agreementId, evidenceCID);
    }

    /**
     * @notice Confirm an agreement as the seller.
     * @param agreementId The ID of the agreement.
     */
    function sellerConfirmsAgreement(uint256 agreementId) external {
        Agreement storage agreement = agreements[agreementId];
        if (msg.sender != agreement.seller) revert Errors.NotASeller();

        agreement.sellerConfirmedAgreement = true;
        emit AgreementConfirmed(agreementId);
    }

    /**
     * @notice Confirm receipt of the item/service.
     * @param agreementId The ID of the agreement.
     */
    function confirmReceived(uint256 agreementId) external {
        Agreement storage agreement = agreements[agreementId];
        if (msg.sender != agreement.buyer) revert Errors.NotABuyer();
        if (!agreementIsLocked(agreementId)) revert Errors.AgreementNotLocked();

        agreement.status = Status.Concluded;

        bool sentSeller;
        if (agreement.tokenAddress == ethereum) {
            (sentSeller, ) = agreement.seller.call{value: agreement.value}("");
        } else {
            sentSeller = IERC20(agreement.tokenAddress).transferFrom(address(this), agreement.seller, agreement.value);
        }
        if (!sentSeller) revert Errors.TransferFailed();

        emit ReceiptConfirmed(agreementId);
    }

    /**
     * @notice Reclaim funds as the buyer.
     * @param agreementId The ID of the agreement.
     */
    function buyerReclaims(uint256 agreementId) external {
        Agreement storage agreement = agreements[agreementId];
        if (msg.sender != agreement.buyer) revert Errors.NotABuyer();
        if (agreementIsLocked(agreementId) || agreement.sellerConfirmedAgreement) revert Errors.AgreementLocked();

        bool sentBack;
        if (agreement.tokenAddress == ethereum) {
            (sentBack, ) = agreement.buyer.call{value: agreement.value}("");
        } else {
            sentBack = IERC20(agreement.tokenAddress).transferFrom(address(this), agreement.buyer, agreement.value);
        }
        if (!sentBack) revert Errors.TransferFailed();

        agreement.status = Status.Funds_Reclaimed;
        emit FundsReclaimed(agreementId);
    }

    /**
     * @notice Check if an agreement is locked.
     * @param agreementId The ID of the agreement.
     * @return bool True if the agreement is locked, otherwise false.
     */
    function agreementIsLocked(uint256 agreementId) public view returns (bool) {
        Agreement memory agreement = agreements[agreementId];
        return agreement.sellerConfirmedAgreement;
    }

    /**
     * @notice Reject the receipt as a buyer.
     * @param agreementId The ID of the agreement.
     */
    function buyerRejectsReceipt(uint256 agreementId) external {
        Agreement storage agreement = agreements[agreementId];
        if (msg.sender != agreement.buyer) revert Errors.NotABuyer();

        agreement.status = Status.Pending_Resolution;
        emit BuyerRejectedReceipt(agreementId);
    }
    /**
     * @notice Execute the decision of the judge.
     * @param agreementId The ID of the agreement.
     * @param inFavorOfBuyer Boolean indicating if the decision is in favor of the buyer.
     */
    function executeDecision(uint256 agreementId, bool inFavorOfBuyer) external {
        Agreement storage agreement = agreements[agreementId];

        // Ensure only the judge can make a decision
        if (msg.sender != judge) revert Errors.NotAJudge();

        // Ensure there's a litigation to be resolved
        if (agreement.status != Status.Pending_Resolution) revert Errors.NoPendingResolution();

        // Update the agreement status based on judge's decision
        agreement.status = inFavorOfBuyer ? Status.Resolved_To_Buyer : Status.Resolved_To_Seller;

        bool success;

        // Transfer funds based on the judge's decision
        if (inFavorOfBuyer) {
            if (agreement.tokenAddress == ethereum) {
                (success, ) = agreement.buyer.call{value: agreement.value}("");
            } else {
                success = IERC20(agreement.tokenAddress).transferFrom(address(this), agreement.buyer, agreement.value);
            }
        } else {
            if (agreement.tokenAddress == ethereum) {
                (success, ) = agreement.seller.call{value: agreement.value}("");
            } else {
                success = IERC20(agreement.tokenAddress).transferFrom(address(this), agreement.seller, agreement.value);
            }
        }

        // Check if the transfer was successful
        if (!success) revert Errors.TransferFailed();

        emit DecisionExecuted(agreementId, inFavorOfBuyer);
    }
}