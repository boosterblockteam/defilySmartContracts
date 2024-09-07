// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol"; //NUEVO
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol"; //NUEVO

bytes32 constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
bytes32 constant CLAIMS_CONTRACT_ROLE = keccak256("CLAIMS_CONTRACT_ROLE");

uint8 constant ORDER_TYPE_MARKET = 1;
uint8 constant ORDER_TYPE_LIMIT = 2;

uint8 constant CLOSE_REASON_TAKE_PROFIT = 1;
uint8 constant CLOSE_REASON_STOP_LOSS = 2;
uint8 constant CLOSE_REASON_CANCEL = 3;

struct Order {
    uint128 openingAmount;
    uint128 closingAmount;
    uint64 openedAt;
    uint64 closedAt;
    uint8 orderType;
    uint8 closeReason;
}

contract TreasuryV2 is Initializable, AccessControlUpgradeable, UUPSUpgradeable, OwnableUpgradeable { //SE AGREGO  UUPSUpgradeable, OwnableUpgradeable
    using SafeERC20 for IERC20;

    event OrderOpened(
        uint32 indexed orderId,
        uint8 indexed orderType,
        uint128 openingAmount
    );
    event OrderClosed(
        uint32 indexed orderId,
        uint8 indexed closeReason,
        uint128 closingAmount,
        int128 profit
    );

    error AmountIsZero();
    error NotEnoughBalance();
    error OrderNotOpened();
    error OrderCantBeCancelled();

    IERC20 public token;
    Order[] public orders;
    uint256 pendingPerformanceFee;
    int256 public availableProfit;

    function initialize(IERC20 token_) public initializer {
        __AccessControl_init(); 
        __Ownable_init(msg.sender); //NUEVO
        __UUPSUpgradeable_init();   //NUEVO
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        token = token_;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {} //NUEVO


    function totalOrders() external view returns (uint32) {
        return uint32(orders.length);
    }

    function availableBalance() public view returns (uint256) {
        uint256 balance = token.balanceOf(address(this));
        if (balance < pendingPerformanceFee) return 0;
        else return balance - pendingPerformanceFee;
    }

    function openLimit(uint128 amount) external onlyRole(OPERATOR_ROLE) {
        _openOrder(ORDER_TYPE_LIMIT, amount);
    }

    function openMarket(uint128 amount) external onlyRole(OPERATOR_ROLE) {
        _openOrder(ORDER_TYPE_MARKET, amount);
    }

    function takeProfit(
        uint32 orderId,
        uint128 amount
    ) external onlyRole(OPERATOR_ROLE) {
        _closeOrder(orderId, CLOSE_REASON_TAKE_PROFIT, amount);
    }

    function stopLoss(
        uint32 orderId,
        uint128 amount
    ) external onlyRole(OPERATOR_ROLE) {
        _closeOrder(orderId, CLOSE_REASON_STOP_LOSS, amount);
    }

    function cancel(uint32 orderId) external onlyRole(OPERATOR_ROLE) {
        Order storage order = orders[orderId];
        if (order.orderType != ORDER_TYPE_LIMIT) revert OrderCantBeCancelled();
        _closeOrder(orderId, CLOSE_REASON_CANCEL, order.openingAmount);
    }

    function withdrawProfit(
        uint256 profit,
        uint256 performanceFees
    ) external onlyRole(CLAIMS_CONTRACT_ROLE) {
        uint256 total = profit + performanceFees;
        if (total > availableBalance() || int256(total) > availableProfit)
            revert NotEnoughBalance();
        token.safeTransfer(msg.sender, profit);
        pendingPerformanceFee += performanceFees;
        availableProfit -= int256(total);
    }

    function withdrawPerformanceFees()
        external
        onlyRole(CLAIMS_CONTRACT_ROLE)
        returns (uint256)
    {
        uint256 amount = pendingPerformanceFee;
        pendingPerformanceFee = 0;
        token.safeTransfer(msg.sender, amount);
        return amount;
    }

    function withdrawStake(
        uint256 amount
    ) external onlyRole(CLAIMS_CONTRACT_ROLE) {
        require(amount <= availableBalance());
        token.safeTransfer(msg.sender, amount);
    }

    function _openOrder(uint8 orderType, uint128 amount) private {
        if (amount == 0) revert AmountIsZero();
        if (amount > availableBalance()) revert NotEnoughBalance();
        orders.push(
            Order({
                openingAmount: amount,
                openedAt: uint64(block.timestamp),
                orderType: orderType,
                closingAmount: 0,
                closedAt: 0,
                closeReason: 0
            })
        );
        token.safeTransfer(msg.sender, amount);
        emit OrderOpened(uint32(orders.length - 1), orderType, amount);
    }

    function _closeOrder(uint32 orderId, uint8 reason, uint128 amount) private {
        Order storage order = orders[orderId];
        if (order.openingAmount == 0 || order.closedAt != 0)
            revert OrderNotOpened();
        order.closingAmount = amount;
        order.closedAt = uint64(block.timestamp);
        order.closeReason = reason;
        token.safeTransferFrom(msg.sender, address(this), order.closingAmount);
        int128 profit = int128(order.closingAmount) -
            int128(order.openingAmount);
        availableProfit += profit;
        emit OrderClosed(orderId, reason, order.closingAmount, profit);
    }

    uint256[99] __gap;
}
