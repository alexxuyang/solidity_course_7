const MintableERC721 = artifacts.require("MintableERC721");

module.exports = function (deployer) {
  deployer.deploy(MintableERC721, "Mintable NFT", "mNFT");
};
