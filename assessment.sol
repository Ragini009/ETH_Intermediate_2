// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns(uint256){
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // make sure this is the owner
        require(msg.sender == owner, "You are not the owner of this account");

        // perform transaction
        balance += _amount;

        // assert transaction completed successfully
        assert(balance == _previousBalance + _amount);

        // emit the event
        emit Deposit(_amount);
    }

    // custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // withdraw the given amount
        balance -= _withdrawAmount;

        // assert the balance is correct
        assert(balance == (_previousBalance - _withdrawAmount));

        // emit the event
        emit Withdraw(_withdrawAmount);
    }

    // ==================== New Functionalities Start Here ====================

    // Struct to represent a Parcel
    struct Parcel {
        uint256 id;
        address recipient;
        bool sent;
        bool received;
    }

    // Mapping from Parcel ID to Parcel details
    mapping(uint256 => Parcel) private parcels;

    // Events for parcel operations
    event ParcelSent(uint256 parcelId, address indexed recipient);
    event ParcelReceived(uint256 parcelId);

    // Modifier to ensure only owner can execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner of this account");
        _;
    }

    /**
     * @dev Sends a parcel by creating a new Parcel entry.
     * @param _parcelId Unique identifier for the parcel.
     * @param _recipient Address of the recipient.
     */
    function sendParcel(uint256 _parcelId, address _recipient) public onlyOwner {
        require(_recipient != address(0), "Invalid recipient address");
        require(!parcels[_parcelId].sent, "Parcel already sent with this ID");

        parcels[_parcelId] = Parcel({
            id: _parcelId,
            recipient: _recipient,
            sent: true,
            received: false
        });

        emit ParcelSent(_parcelId, _recipient);
    }

    /**
     * @dev Marks a parcel as received.
     * @param _parcelId Unique identifier for the parcel.
     */
    function receiveParcel(uint256 _parcelId) public onlyOwner {
        Parcel storage parcel = parcels[_parcelId];
        require(parcel.sent, "Parcel has not been sent");
        require(!parcel.received, "Parcel already received");

        parcel.received = true;

        emit ParcelReceived(_parcelId);
    }

    /**
     * @dev Checks if a parcel has been sent.
     * @param _parcelId Unique identifier for the parcel.
     * @return bool indicating if the parcel has been sent.
     */
    function sentOrNot(uint256 _parcelId) public view returns (bool) {
        return parcels[_parcelId].sent;
    }

    /**
     * @dev Checks if a parcel has been received.
     * @param _parcelId Unique identifier for the parcel.
     * @return bool indicating if the parcel has been received.
     */
    function receivedOrNot(uint256 _parcelId) public view returns (bool) {
        return parcels[_parcelId].received;
    }

    // ==================== New Functionalities End Here ====================
}
