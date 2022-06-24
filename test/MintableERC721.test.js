const MintableERC721 = artifacts.require("MintableERC721");

contract("MintableERC721", accounts => {

    it("MintNFT", async () => {
        const instance = await MintableERC721.deployed();
        const name = await instance.name.call();
        assert.equal(name, "Mintable NFT");

        let receivers = [
            accounts[1],
            accounts[1],
            accounts[2],
            accounts[3]
        ];

        let uris = [
            "https://ipfs.io/ipfs/QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/face_parts/Asset%20331.svg",
            "https://ipfs.io/ipfs/QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/face_parts/Asset%20331.svg",
            "https://ipfs.io/ipfs/QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/face_parts/Asset%20331.svg",
            "https://ipfs.io/ipfs/QmZsU8nTTexTxPzCKZKqo3Ntf5cUiWMRahoLmtpimeaCiT/face_parts/Asset%20331.svg"
        ];

        await instance.mint(receivers, uris);

        assert.equal(await instance.balanceOf.call(accounts[1]), 2);
        assert.equal(await instance.ownerOf.call(2), accounts[2]);
        assert.equal(await instance._CUR_TOKENID_.call(), 4);
    });

});