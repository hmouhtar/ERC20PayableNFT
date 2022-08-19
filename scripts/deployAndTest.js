const hre = require("hardhat");

async function generateEIP2612Signature({owner, spender, value, verifyingContract, domainInfo, nonce}){

    const digestParams = {
        owner: owner.address,
        spender: spender.address,
        value,
        nonce: parseInt(await verifyingContract.nonces(owner.address)),
        deadline: new Date().getTime() + 60 * 60 * 24 * 1000,
    };

    const rawSignature = await owner._signTypedData(
        {
            name: domainInfo && domainInfo.name || "SampleToken",
            version: domainInfo && domainInfo.version || "1",
            chainId: domainInfo && domainInfo.chainId || hre.network.config.chainId,
            verifyingContract: verifyingContract.address
        },
        {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        },
        digestParams
    );

    const signature = hre.ethers.utils.splitSignature(rawSignature);

    return [signature, digestParams.deadline];
}

(async () => {

    const [mainAccount, secondaryAccount] = await hre.ethers.getSigners();
    const chainId = hre.network.config.chainId;

    const SampleToken = await hre.ethers.getContractFactory("SampleToken");
    const sampleToken = await SampleToken.deploy();
    await sampleToken.deployed();

    const SampleNFT = await hre.ethers.getContractFactory("SampleNFT");
    const sampleNFT = await SampleNFT.deploy("QmQsrxb2MSVZSJfC61ukoJm9dkPJD3z2aCzyHmq4Pz3Nm8");
    await sampleNFT.deployed();

    const SampleMiddleman = await hre.ethers.getContractFactory("SampleMiddleman");
    const sampleMiddleman = await SampleMiddleman.deploy(sampleToken.address, sampleNFT.address);
    await sampleMiddleman.deployed();

    await sampleNFT.transferOwnership(sampleMiddleman.address);

    for(let i = 0; i < 10; i++){

        let [signature, deadline] = await generateEIP2612Signature({
            owner: mainAccount,
            spender: sampleMiddleman,
            value: await sampleMiddleman.PRICE(),
            verifyingContract: sampleToken,
        });
        
        await sampleMiddleman.buySampleNFTWithSampleToken(deadline, signature.v, signature.r, signature.s);
    }

})()