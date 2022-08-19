// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;
import "solmate/src/tokens/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleToken is ERC20, Ownable{

    constructor() ERC20("SampleToken", "ST", 18)
    {
        _mint(msg.sender, 1000e18);
    }
    
}