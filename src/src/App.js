import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from "web3/dist/web3.min.js";

var erc20abi = require('./abi.json');
var web3;
var currentAccount;

function App() {
  const [chainID, setChainID] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [blockTimestamp, setBlockTimestamp] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState('0x6e79ce0A3400299eb2e5AFE14161d80297030935');
  const [toAddress, setToAddress] = useState('0xBc461fA713b5EeAc7BE790bF4a1A1C7bBa6332dc');
  const [amount, setAmount] = useState('10');
  const [mintAmount, setMintAmount] = useState('1000');
  const [burnAmount, setBurnAmount] = useState('100');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [estimateGas, setEstimateGas] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const handleContractChange = (event) => {setContract(event.target.value)};
  const handleToAddressChange = (event) => {setToAddress(event.target.value)};
  const handleAmountChange = (event) => {setAmount(event.target.value)};
  const handleMintAmountChange = (event) => {setMintAmount(event.target.value)};
  const handleBurnAmountChange = (event) => {setBurnAmount(event.target.value)};

  const connectWallet = async () => {
    if(window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if(accounts.length != 0) {
        web3 = new Web3(window.ethereum);

        let a1 = web3.utils.toChecksumAddress(accounts[0]);
        setAccount(a1);

        setChainID(await web3.eth.getChainId());

        let bn = await web3.eth.getBlockNumber();
        setBlockNumber(bn);

        let block = await web3.eth.getBlock(bn);
        setBlockTimestamp(block.timestamp);

        let bal = await web3.eth.getBalance(a1);
        setBalance(web3.utils.fromWei(bal));
      }
    } else {
      alert('please install the wallet!');
      return;
    }
  }

  const readContract = async() => {
    console.log('readContract', contract)
    if(web3 != null && contract != null) {
      var instance = new web3.eth.Contract(erc20abi, contract);

      let symbol = await instance.methods.symbol().call();
      let totalSupply = await instance.methods.totalSupply().call();
      let bal = await instance.methods.balanceOf(account).call();

      setTokenSymbol(symbol);
      setTotalSupply(web3.utils.fromWei(totalSupply));
      setTokenBalance(web3.utils.fromWei(bal));
    }
  }

  const mintToken = async () => {
    console.log('mint token', mintAmount);
    if(web3 != null && contract != null) {
      var instance = new web3.eth.Contract(erc20abi, contract);

      let data = instance.methods.mint(account, web3.utils.toWei(mintAmount)).encodeABI();
      await sendTx(data);
    }
  }

  const burnToken = async () => {
    console.log('burn token', burnAmount);
    if(web3 != null && contract != null) {
      var instance = new web3.eth.Contract(erc20abi, contract);

      let data = instance.methods.burn(web3.utils.toWei(burnAmount)).encodeABI();
      await sendTx(data);
    }
  }

  const transfer = async() => {
    console.log('transfer', amount, toAddress)
    if(web3 != null && contract != null) {
      var instance = new web3.eth.Contract(erc20abi, contract);

      let data = instance.methods.transfer(toAddress, web3.utils.toWei(amount)).encodeABI();
      await sendTx(data);
    }
  }

  const sendTx = async(data) => {
    let egas = await web3.eth.estimateGas({
      to: contract,
      data,
      from: account,
      value: '0x00'
    });
    let price = await web3.eth.getGasPrice();
    let nonce = await web3.eth.getTransactionCount(account);

    setEstimateGas(egas);
    setGasPrice(price);

    let rawTx = {
      from: account,
      to: contract,
      nonce: web3.utils.toHex(nonce),
      gasPrice: price,
      gas: egas * 2,
      value: '0x00',
      data,
      chainId: chainID
    };

    web3.eth.sendTransaction(rawTx).on("transactionHash", (hash) => {
      console.log('hash: ', hash);
      setTxHash(hash);
    });
  }

  return (
    <div className="App">
      <hr/>
      <button onClick={connectWallet}>connect wallet</button>
      <div>
        ChainID: {chainID}
      </div>
      <div>
        BlockNumber: {blockNumber}
      </div>
      <div>
        BlockTimestamp: {blockTimestamp}
      </div>
      <div>
        Account: {account}
      </div>
      <div>
        Balance: {balance}
      </div>
      <hr />

      <div>
        Contract Address:
        <input type="text" size="50" value={contract} onChange={handleContractChange}></input>
      </div>
      <button onClick={readContract.bind(this)}>Read Contract</button>
      <hr />

      <div>
        TokenSymbol: {tokenSymbol}
      </div>
      <div>
        TotalSupply: {totalSupply}
      </div>
      <div>
        Account Balance: {tokenBalance}
      </div>
      <hr />

      <div>
        Mint Token:
        <input type="text" value={mintAmount} onChange={handleMintAmountChange}></input>
      </div>
      <button onClick={mintToken.bind(this)}>Mint</button>
      <hr />

      <div>
        Burn Token:
        <input type="text" value={burnAmount} onChange={handleBurnAmountChange}></input>
      </div>
      <button onClick={burnToken.bind(this)}>Burn</button>
      <hr />

      <div>
        To Address:
        <input type="toAddress" size="50" value={toAddress} onChange={handleToAddressChange}></input>
      </div>
      <div>
        Amount:
        <input type="transferAmount" value={amount} onChange={handleAmountChange}></input>
      </div>
      <button onClick={transfer}>Transfer</button>
      <hr />

      <div>
        estimateGas: {estimateGas}
      </div>
      <div>
        gasPrice: {gasPrice}
      </div>
      <div>
        txHash: {txHash}
      </div>
      <hr />

    </div>
  );
}

export default App;
