// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract PixelPainter {
    // Events
    event PixelPainted(uint256 indexed x, uint256 indexed y, string color, address indexed painter);
    
    // Struct to store pixel data
    struct Pixel {
        string color;
        address painter;
        uint256 timestamp;
    }
    
    // Canvas size
    uint256 public constant CANVAS_WIDTH = 100;
    uint256 public constant CANVAS_HEIGHT = 100;
    
    // Mapping to store pixel data
    mapping(uint256 => mapping(uint256 => Pixel)) public canvas;
    
    // Owner of the contract
    address public owner;
    
    // Painting fee (in wei)
    uint256 public paintingFee = 0.001 ether;
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validCoordinates(uint256 x, uint256 y) {
        require(x < CANVAS_WIDTH, "X coordinate out of bounds");
        require(y < CANVAS_HEIGHT, "Y coordinate out of bounds");
        _;
    }
    
    /**
     * @dev Paint a pixel at the specified coordinates with the given color
     * @param x X coordinate (0-99)
     * @param y Y coordinate (0-99)
     * @param color Color in hex format (e.g., "#FF0000")
     */
    function paintPixel(uint256 x, uint256 y, string memory color) 
        external 
        payable 
        validCoordinates(x, y) 
    {
        require(msg.value >= paintingFee, "Insufficient payment");
        require(bytes(color).length > 0, "Color cannot be empty");
        
        // Update pixel data
        canvas[x][y] = Pixel({
            color: color,
            painter: msg.sender,
            timestamp: block.timestamp
        });
        
        // Emit event
        emit PixelPainted(x, y, color, msg.sender);
        
        // Refund excess payment
        if (msg.value > paintingFee) {
            payable(msg.sender).transfer(msg.value - paintingFee);
        }
    }
    
    /**
     * @dev Get pixel data at the specified coordinates
     * @param x X coordinate
     * @param y Y coordinate
     * @return color The color of the pixel
     * @return painter The address of the painter
     * @return timestamp The timestamp when the pixel was painted
     */
    function getPixel(uint256 x, uint256 y) 
        external 
        view 
        validCoordinates(x, y) 
        returns (string memory color, address painter, uint256 timestamp) 
    {
        Pixel memory pixel = canvas[x][y];
        return (pixel.color, pixel.painter, pixel.timestamp);
    }
    
    /**
     * @dev Get multiple pixels in a batch
     * @param coordinates Array of [x, y] coordinates
     * @return colors Array of colors
     * @return painters Array of painter addresses
     * @return timestamps Array of timestamps
     */
    function getPixelsBatch(uint256[][] memory coordinates) 
        external 
        view 
        returns (string[] memory colors, address[] memory painters, uint256[] memory timestamps) 
    {
        uint256 length = coordinates.length;
        colors = new string[](length);
        painters = new address[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            require(coordinates[i].length == 2, "Invalid coordinate format");
            uint256 x = coordinates[i][0];
            uint256 y = coordinates[i][1];
            require(x < CANVAS_WIDTH && y < CANVAS_HEIGHT, "Coordinates out of bounds");
            
            Pixel memory pixel = canvas[x][y];
            colors[i] = pixel.color;
            painters[i] = pixel.painter;
            timestamps[i] = pixel.timestamp;
        }
    }
    
    /**
     * @dev Set the painting fee (only owner)
     * @param newFee New fee in wei
     */
    function setPaintingFee(uint256 newFee) external onlyOwner {
        paintingFee = newFee;
    }
    
    /**
     * @dev Withdraw contract balance (only owner)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
    }
    
    /**
     * @dev Get contract balance
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    /**
     * @dev Transfer ownership (only owner)
     * @param newOwner New owner address
     */
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}

