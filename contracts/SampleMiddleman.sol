// SPDX-License-Identifier: MIT
pragma solidity 0.8.16;

import "./SampleToken.sol";
import "./SampleNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SampleMiddleman is Ownable {
    SampleToken public sampleToken;
    SampleNFT public sampleNFT;
    uint256 public constant PRICE = 100e18;

    constructor(address _sampleTokenContract, address _sampleNFTContract) {
        sampleToken = SampleToken(_sampleTokenContract);
        sampleNFT = SampleNFT(_sampleNFTContract);
    }

    function buySampleNFTWithSampleToken(
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public {
        sampleToken.permit(msg.sender, address(this), PRICE, deadline, v, r, s);
        sampleToken.transferFrom(msg.sender, address(this), PRICE);
        sampleNFT.mint(msg.sender);
    }
}
