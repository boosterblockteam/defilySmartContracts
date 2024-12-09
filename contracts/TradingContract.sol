// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract TradingContract is Initializable, AccessControlUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
    bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 constant BRIDGE_ROLE = keccak256("BRIDGE_ROLE");

    struct Trader {
        uint256 idTrader;
        address wallet;
        uint256 startDate;
        uint256 tradingAmount;
        bool status;
        uint256 maxLoss;
        uint256 traderFee;
    }

    struct Order {
        uint256 idOrder;
        uint256 idTrader;
        uint256 season;
        uint256 closingSeason;
        uint256 startOperationDate;
        uint256 openDate;
        uint256 closeDate;
        string market;
        string dexPlatform;
        string pair;
        string side; // "Buy" or "Sell"
        uint256 amount;
        uint256 openPrice;
        uint256 closePrice;
        uint256 initialMargin;
        uint256 releasedMargin;
        uint256 tpPrice;
        uint256 slPrice;
        string orderType; // "Limit" or "Market"
        string statusOrder; // "Pending" or "Executed"
        string status; // "Open", "Closed", or "Canceled"
        int256 profit;
        int256 commissions;
        uint256 traderFee;
        int256 totalProfit;
    }

    mapping(uint256 => Trader) public traders; 
    mapping(uint256 => Order) public orders;  

    uint256 public totalStaked;
    uint256 public totalUnstaked;
    uint256 public totalValueLocked;
    uint256 public totalProfit;
    uint256 public totalWithdrawalProfits;

    uint256 private nextOrderId;
    uint256 private nextTraderId;

    function initialize() public initializer {
        __AccessControl_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(OPERATOR_ROLE, msg.sender);
        _grantRole(BRIDGE_ROLE, msg.sender);

        nextOrderId = 1;
        nextTraderId = 1;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    // Assign roles
    function assignOperatorWallet(address _newOw) public onlyOwner {
        _grantRole(OPERATOR_ROLE, _newOw);
    }

    function assignBridgeWallet(address _newBw) public onlyOwner {
        _grantRole(BRIDGE_ROLE, _newBw);
    }

    function revokeOperatorRole(address _userAddress) public onlyOwner {
        _revokeRole(OPERATOR_ROLE, _userAddress);
    }

    function revokeBridgeRole(address _userAddress) public onlyOwner {
        _revokeRole(BRIDGE_ROLE, _userAddress);
    }

    // Trader Management
    function addTrader(
        address _wallet,
        uint256 _tradingAmount,
        bool _status,
        uint256 _maxLoss,
        uint256 _traderFee
    ) public onlyRole(ADMIN_ROLE) {
        uint256 traderId = nextTraderId++;
        traders[traderId] = Trader({
            idTrader: traderId,
            wallet: _wallet,
            startDate: block.timestamp,
            tradingAmount: _tradingAmount,
            status: _status,
            maxLoss: _maxLoss,
            traderFee: _traderFee
        });
    }

    // Order Management
    function openOrder(
        uint256 _idTrader,
        string memory _market,
        string memory _dexPlatform,
        string memory _pair,
        string memory _side,
        uint256 _amount,
        uint256 _openPrice,
        uint256 _tpPrice,
        uint256 _slPrice,
        string memory _orderType
    ) public onlyRole(OPERATOR_ROLE) {
        require(traders[_idTrader].status, "Trader not active");
        uint256 orderId = nextOrderId++;
        uint256 initialMargin = _amount * _openPrice;

        orders[orderId] = Order({
            idOrder: orderId,
            idTrader: _idTrader,
            season: _getCurrentSeason(),
            closingSeason: 0,
            startOperationDate: block.timestamp,
            openDate: block.timestamp,
            closeDate: 0,
            market: _market,
            dexPlatform: _dexPlatform,
            pair: _pair,
            side: _side,
            amount: _amount,
            openPrice: _openPrice,
            closePrice: 0,
            initialMargin: initialMargin,
            releasedMargin: 0,
            tpPrice: _tpPrice,
            slPrice: _slPrice,
            orderType: _orderType,
            statusOrder: "Pending",
            status: "Open",
            profit: 0,
            commissions: 0,
            traderFee: traders[_idTrader].traderFee,
            totalProfit: 0
        });
    }

    function closeOrder(uint256 _idOrder, uint256 _closePrice) public onlyRole(OPERATOR_ROLE) {
        Order storage order = orders[_idOrder];
        require(keccak256(bytes(order.status)) == keccak256(bytes("Open")), "Order not open");
        
        uint256 releasedMargin = order.amount * _closePrice;
        int256 profit = int256(releasedMargin) - int256(order.initialMargin);
        int256 totalProfit = profit - int256(order.commissions) - int256(order.traderFee);

        order.closingSeason = _getCurrentSeason();
        order.closeDate = block.timestamp;
        order.closePrice = _closePrice;
        order.releasedMargin = releasedMargin;
        order.profit = profit;
        order.totalProfit = totalProfit;
        order.statusOrder = "Executed";
        order.status = "Closed";
    }

    // Staking and Profits
    function stake(uint256 _amount) public onlyRole(BRIDGE_ROLE) {
        totalStaked += _amount;
        totalValueLocked = totalStaked - totalUnstaked;
    }

    function unstake(uint256 _amount) public onlyRole(BRIDGE_ROLE) {
        totalUnstaked += _amount;
        totalValueLocked = totalStaked - totalUnstaked;
    }

    function withdrawProfits(uint256 _amount) public onlyRole(BRIDGE_ROLE) {
        require(_amount <= totalProfit, "Insufficient profits");
        totalProfit -= _amount;
        totalWithdrawalProfits += _amount;
    }

    // Utility
    function _getCurrentSeason() internal view returns (uint256) {
        return (block.timestamp / 1 weeks) + 1; 
    }
}
