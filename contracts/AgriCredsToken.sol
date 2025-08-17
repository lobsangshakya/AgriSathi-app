// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title AgriCredsToken
 * @dev AgriCreds is an ERC20 token for the AgriSaathi agricultural assistance platform
 * Farmers can earn AgriCreds by participating in the community, daily logins, and referrals
 * AgriCreds can be used to access premium services like expert consultation
 */
contract AgriCredsToken is ERC20, Ownable, Pausable {
    
    // Events
    event AgriCredsEarned(address indexed user, uint256 amount, string reason);
    event AgriCredsSpent(address indexed user, uint256 amount, string service);
    event ExchangeRateUpdated(uint256 newBuyRate, uint256 newSellRate);
    
    // Exchange rates (in wei per AgriCred)
    uint256 public buyRate = 0.001 ether;  // 1 AgriCred = 0.001 ETH
    uint256 public sellRate = 0.0008 ether; // 1 AgriCred = 0.0008 ETH (slightly lower for spread)
    
    // Minimum and maximum amounts
    uint256 public constant MIN_PURCHASE = 10; // Minimum 10 AgriCreds per purchase
    uint256 public constant MAX_PURCHASE = 10000; // Maximum 10,000 AgriCreds per purchase
    
    // Daily earning limits
    mapping(address => uint256) public lastEarningTime;
    mapping(address => uint256) public dailyEarnings;
    uint256 public constant DAILY_EARNING_LIMIT = 100; // Max 100 AgriCreds per day
    uint256 public constant EARNING_COOLDOWN = 1 days;
    
    constructor() ERC20("AgriCreds", "AGRICRED") {
        // Initial supply of 1,000,000 AgriCreds to the contract owner
        _mint(msg.sender, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Buy AgriCreds with ETH
     * @param amount Number of AgriCreds to buy
     */
    function buyAgriCreds(uint256 amount) external payable whenNotPaused {
        require(amount >= MIN_PURCHASE, "Amount too low");
        require(amount <= MAX_PURCHASE, "Amount too high");
        
        uint256 ethRequired = amount * buyRate;
        require(msg.value >= ethRequired, "Insufficient ETH sent");
        
        _mint(msg.sender, amount * 10**decimals());
        
        // Refund excess ETH
        if (msg.value > ethRequired) {
            payable(msg.sender).transfer(msg.value - ethRequired);
        }
        
        emit AgriCredsEarned(msg.sender, amount, "Purchased with ETH");
    }
    
    /**
     * @dev Sell AgriCreds for ETH
     * @param amount Number of AgriCreds to sell
     */
    function sellAgriCreds(uint256 amount) external whenNotPaused {
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(msg.sender) >= amount * 10**decimals(), "Insufficient AgriCreds");
        
        uint256 ethToReceive = amount * sellRate;
        require(address(this).balance >= ethToReceive, "Insufficient ETH in contract");
        
        _burn(msg.sender, amount * 10**decimals());
        payable(msg.sender).transfer(ethToReceive);
        
        emit AgriCredsSpent(msg.sender, amount, "Sold for ETH");
    }
    
    /**
     * @dev Earn AgriCreds for community participation (only owner can call)
     * @param user Address of the user earning credits
     * @param amount Amount of AgriCreds to award
     * @param reason Reason for earning (e.g., "Daily Login", "Community Post")
     */
    function earnAgriCreds(address user, uint256 amount, string memory reason) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        
        // Check daily earning limit
        if (block.timestamp >= lastEarningTime[user] + EARNING_COOLDOWN) {
            dailyEarnings[user] = 0;
        }
        
        require(dailyEarnings[user] + amount <= DAILY_EARNING_LIMIT, "Daily earning limit exceeded");
        
        dailyEarnings[user] += amount;
        lastEarningTime[user] = block.timestamp;
        
        _mint(user, amount * 10**decimals());
        emit AgriCredsEarned(user, amount, reason);
    }
    
    /**
     * @dev Spend AgriCreds for services (only owner can call)
     * @param user Address of the user spending credits
     * @param amount Amount of AgriCreds to spend
     * @param service Service being used (e.g., "Expert Chat", "Disease Detection")
     */
    function spendAgriCreds(address user, uint256 amount, string memory service) external onlyOwner {
        require(user != address(0), "Invalid user address");
        require(amount > 0, "Amount must be greater than 0");
        require(balanceOf(user) >= amount * 10**decimals(), "Insufficient AgriCreds");
        
        _burn(user, amount * 10**decimals());
        emit AgriCredsSpent(user, amount, service);
    }
    
    /**
     * @dev Update exchange rates (only owner can call)
     * @param newBuyRate New buy rate in wei per AgriCred
     * @param newSellRate New sell rate in wei per AgriCred
     */
    function updateExchangeRates(uint256 newBuyRate, uint256 newSellRate) external onlyOwner {
        require(newBuyRate > newSellRate, "Buy rate must be higher than sell rate");
        require(newBuyRate > 0, "Buy rate must be greater than 0");
        
        buyRate = newBuyRate;
        sellRate = newSellRate;
        
        emit ExchangeRateUpdated(newBuyRate, newSellRate);
    }
    
    /**
     * @dev Pause the contract (only owner can call)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev Unpause the contract (only owner can call)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    /**
     * @dev Withdraw ETH from contract (only owner can call)
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Get user's daily earning status
     * @param user Address of the user
     * @return earnedToday Amount earned today
     * @return remainingToday Remaining amount that can be earned today
     * @return nextEarningTime Time when daily limit resets
     */
    function getDailyEarningStatus(address user) external view returns (
        uint256 earnedToday,
        uint256 remainingToday,
        uint256 nextEarningTime
    ) {
        if (block.timestamp >= lastEarningTime[user] + EARNING_COOLDOWN) {
            earnedToday = 0;
            remainingToday = DAILY_EARNING_LIMIT;
            nextEarningTime = block.timestamp;
        } else {
            earnedToday = dailyEarnings[user];
            remainingToday = DAILY_EARNING_LIMIT - dailyEarnings[user];
            nextEarningTime = lastEarningTime[user] + EARNING_COOLDOWN;
        }
    }
    
    /**
     * @dev Override decimals to match standard ERC20 (18 decimals)
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }
    
    /**
     * @dev Receive ETH
     */
    receive() external payable {
        // Contract can receive ETH for buying AgriCreds
    }
} 