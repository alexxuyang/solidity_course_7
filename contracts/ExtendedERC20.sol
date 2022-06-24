// SPDX-License-Identifier: GPL-3.0
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma solidity 0.8.14;

contract ExtendedERC20 is ERC20, Ownable {

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}

    // if non-zero we need send _fee to contract onwer when transfer token
    uint256 private _fee;
    address _feeCollector;

    // if non-zero we need burn _burnAmount token when transfer token
    uint256 private _burnAmount;

    function fee() public view returns (uint256) {
        return _fee;
    }

    function burnAmount() public view returns (uint256) {
        return _burnAmount;
    }

    function feeCollector() public view returns (address) {
        return _feeCollector;
    }

    // anyone call burn the token they hold
    function burn(uint256 _amount) external {
        _burn(_msgSender(), _amount);
    }

    // only the owner can mint more token to the receiver
    function mint(address receiver, uint256 _amount) external onlyOwner {
        _mint(receiver, _amount);
    }

    // only the owner can set the fee
    function setFee(uint256 fee_) external onlyOwner {
        require(fee_ >= _burnAmount);
        _fee = fee_;
    }

    function setFeeCollector(address feeCollector_) external onlyOwner {
        require(feeCollector_ != address(0));
        _feeCollector = feeCollector_;
    }

    // only the owner can set the burn amount
    function setBurnAmount(uint256 burnAmount_) external onlyOwner {
        require(_fee >= burnAmount_);
        _burnAmount = burnAmount_;
    }

    // give that:
    // amount = 1000, _fee = 10, _burnAmount = 2
    // then:
    // send 1000 (amount) to reciver
    // send 10 - 2 (_fee - _burnAmount) to fee collector
    // send 2 (_burnAmount) to address(0)
    function transfer(address to, uint256 amount) public override returns (bool) {
        address sender = _msgSender();

        uint256 fromBalance = balanceOf(sender);
        require(fromBalance >= amount + _fee, "ERC20: fromBalance < amount + _fee");

        // send amount to receiver
        _transfer(sender, to, amount);

        // send _fee to contract owner
        uint256 _actualFee = _fee - _burnAmount;
        if (_actualFee != 0) {
            _transfer(sender, _feeCollector, _actualFee);
        }

        // burn _burnAmount token
        if (_burnAmount != 0) {
            _burn(sender, _burnAmount);
        }

        return true;
    }
}