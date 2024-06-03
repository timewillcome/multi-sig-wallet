// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

contract MultiSignedWallet {
    uint256 numOfConfirmationRequired;
    address[] public owners;

    struct Transaction {
        address payable to;
        uint256 value;
        uint256 confirmationCount;
        uint256 revokeCount;
        bool executed;
    }
    Transaction[] public transactions;

    mapping(address => bool) public isOwner;
    mapping(uint256 => mapping(address => bool)) isConfirmed;

    constructor(address[] memory _owners, uint256 _numOfConfirmationRequired) {
        require(_owners.length > 0, "not enough owner");
        require(
            0 < _numOfConfirmationRequired && _numOfConfirmationRequired <= _owners.length,
            "invalid number of required owner"
        );
        for (uint256 i = 0; i < _owners.length; i++) {
            address owner = _owners[i];
            require(owner != address(0), "invalid owner");
            owners.push(owner);
            isOwner[owner] = true;
        }
        numOfConfirmationRequired = _numOfConfirmationRequired;
    }

    function submitTransaction(address payable _to, uint256 _value) public {
        require(isOwner[msg.sender], "not an owner");
        transactions.push(Transaction(_to, _value, 0, 0, false));
    }

    function confirmTransaction(uint256 _txIndex) public {
        require(isOwner[msg.sender], "not an owner");
        require(_txIndex < transactions.length, "transaction doesn't exist");
        require(
            !isConfirmed[_txIndex][msg.sender],
            "already confirmed this transaction"
        );
        transactions[_txIndex].confirmationCount++;
        isConfirmed[_txIndex][msg.sender] = true;
    }

    function revokeTransaction(uint256 _txIndex) public {
        require(isOwner[msg.sender], "not an owner");
        require(_txIndex < transactions.length, "transaction doesn't exist");
        require(
            !isConfirmed[_txIndex][msg.sender],
            "already confirmed this transaction"
        );
        transactions[_txIndex].revokeCount++;
        isConfirmed[_txIndex][msg.sender] = true;

    }

    function executeTransaction(uint256 _txIndex) external payable {
        require(
            transactions[_txIndex].confirmationCount - transactions[_txIndex].revokeCount >=
                numOfConfirmationRequired,
            "hasnt confirmed by enough owner"
        );
        require(!transactions[_txIndex].executed, "transaction already executed");
        address payable to = transactions[_txIndex].to;
        uint256 _value = transactions[_txIndex].value;
        (bool sent, ) = to.call{value: _value}("");
        require(sent, "transaction failed");
        transactions[_txIndex].executed = true;
        transactions[_txIndex].confirmationCount = 0;
    }
}
