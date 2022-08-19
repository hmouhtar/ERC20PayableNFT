# ERC20PayableNFT

This project is composed of 3 contracts:

- SampleToken: Basic ERC20 token implementing [EIP-2612](https://eips.ethereum.org/EIPS/eip-2612) permit function.
- SampleNFT: Basic ERC721 capped token that's only mintable by the owner.
- SampleMiddleman: A middleman contract that handles minting on the SampleNFT contract. Requires the SampleToken ERC20 as payment. Approves the allowance of SampleToken and mints SampleNFT in a single transaction, thanks to the usage of EIP-2612 permit function.

Sample setup in `scripts/deployAndTest.js`

To execute the sample setup, run:

`npx hardhat run scripts/deployAndTest.js`

