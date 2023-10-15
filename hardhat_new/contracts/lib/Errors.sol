// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

    // Errors
    library Errors {
        error InsufficientPayment();
        error NotABuyer();
        error NotAParticipant();
        error NotASeller();
        error AgreementLocked();
        error AgreementNotLocked();
        error NoPendingResolution();
        error NotAJudge();
        error NoResolution();
        error TransferFailed();
        error NotSameBuyerAndSeller();
    }