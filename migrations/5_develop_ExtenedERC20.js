const ExtendedERC20 = artifacts.require("ExtendedERC20");

module.exports = function (deployer) {
  deployer.deploy(ExtendedERC20, "Extended ERC20~~~", "myToken");
};
