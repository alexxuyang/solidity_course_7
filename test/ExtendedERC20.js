const ExtendedERC20 = artifacts.require("ExtendedERC20");

contract("ExtendedERC20", accounts => {

    let instance;
    let _totalSupply = 1_000_000;
    let _name = "Extended ERC20~~~";
    let _symbol = "myToken";
    let _fee = 100;
    let _burnAmount = 10;

    let _receiver = accounts[8];
    let _feeCollector = accounts[9];

    beforeEach(async function() {
        instance = await ExtendedERC20.new(_name, _symbol, {from: accounts[0]});
    });

    it("basic param", async () => {
        assert.equal(await instance.name.call(), _name);
        assert.equal(await instance.symbol.call(), _symbol);
        assert.equal(await instance.balanceOf.call(accounts[0]), 0);
        assert.equal(await instance.balanceOf.call(accounts[1]), 0);
        assert.equal(await instance.balanceOf.call(accounts[2]), 0);
        assert.equal(await instance.totalSupply.call(), 0);
    });

    it("mint, burn", async () => {
        let _burn = 999;

        await instance.mint(_receiver, _totalSupply);
        assert.equal(await instance.totalSupply.call(), _totalSupply);
        assert.equal(await instance.balanceOf.call(_receiver), _totalSupply);

        await instance.burn(_burn, {from: _receiver});
        assert.equal(await instance.totalSupply.call(), _totalSupply - _burn);
        assert.equal(await instance.balanceOf.call(_receiver), _totalSupply - _burn);
    });

    it("transfer, fee and burn", async () => {
        let _to = accounts[6];

        await instance.mint(_receiver, _totalSupply);
        assert.equal(await instance.totalSupply.call(), _totalSupply);
        assert.equal(await instance.balanceOf.call(_receiver), _totalSupply);

        await instance.setFee(_fee);
        await instance.setBurnAmount(_burnAmount);
        await instance.setFeeCollector(_feeCollector);
        assert.equal(await instance.fee.call(), _fee);
        assert.equal(await instance.burnAmount.call(), _burnAmount);
        assert.equal(await instance.feeCollector.call(), _feeCollector);

        let _v = 10000;
        await instance.transfer(_to, _v, {from: _receiver});
        assert.equal(await instance.balanceOf.call(_receiver), _totalSupply - _v - _fee);
        assert.equal(await instance.balanceOf.call(_to), _v);
        assert.equal(await instance.balanceOf.call(_feeCollector), _fee - _burnAmount);
        assert.equal(await instance.totalSupply.call(), _totalSupply - _burnAmount);
    });
});
