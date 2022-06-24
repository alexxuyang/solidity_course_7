// SPDX-License-Identifier: GPL-3.0
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.14;

contract MintableERC721 is ERC721URIStorage, Ownable {
    // owner mint NFT, set receiver's address, tokenId and uri

    uint256 public _CUR_TOKENID_;

    /**
     * @dev Initializes the contract by setting a `name` and a `symbol` to the token collection.
     */
    constructor(string memory name_, string memory symbol_) ERC721(name_, symbol_) {}

    function mint(
        address[] calldata receivers,
        string[] calldata uris
    ) external onlyOwner {
        require(receivers.length == uris.length, "");
        for(uint256 i = 0; i < receivers.length; i++) {
            _safeMint(receivers[i], _CUR_TOKENID_);
            _setTokenURI(_CUR_TOKENID_, uris[i]);
            _CUR_TOKENID_ = _CUR_TOKENID_ + 1;
        }
    }
}