import './App.css';
import React, { useState, useEffect } from 'react';
import Web3 from "web3/dist/web3.min.js";

var web3;
var currentAccount;
var erc20abi = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_symbol",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOwner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      }
    ],
    "name": "allowance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "decimals",
    "outputs": [
      {
        "internalType": "uint8",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "subtractedValue",
        "type": "uint256"
      }
    ],
    "name": "decreaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "spender",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "addedValue",
        "type": "uint256"
      }
    ],
    "name": "increaseAllowance",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "renounceOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fee",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "burnAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "feeCollector",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "burn",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "receiver",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "fee_",
        "type": "uint256"
      }
    ],
    "name": "setFee",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "feeCollector_",
        "type": "address"
      }
    ],
    "name": "setFeeCollector",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "burnAmount_",
        "type": "uint256"
      }
    ],
    "name": "setBurnAmount",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [chainID, setChainID] = useState('');
  const [blockNumber, setBlockNumber] = useState('');
  const [blockTimestamp, setBlockTimestamp] = useState(null);
  // const [currentAccount, setCurrentAccount] = useState(null);
  const [balance, setBalance] = useState('');
  const [contract, setContract] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [tokenSymbol, setTokenSymbol] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [tokenBalance, setTokenBalance] = useState('');
  const [estimateGas, setEstimateGas] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const handleContractChange = (event) => {setContract(event.target.value)};
  const handleToAddressChange = (event) => {setToAddress(event.target.value)};
  const handleAmountChange = (event) => {setAmount(event.target.value)};

  const getData = async () => {
    try {
      if(web3 != null && currentAccount != null) {
        setChainID(await web3.eth.getChainId());
        let bn = await web3.eth.getBlockNumber();
        setBlockNumber(bn);
        let block = await web3.eth.getBlock(bn);
        setBlockTimestamp(block.timestamp);
        let bal = await web3.eth.getBalance(currentAccount);
        setBalance(web3.utils.fromWei(bal));
      }
    } catch (e) {
      console.log(e);
    } finally {
    }
  }

  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 5000);
    return () => {
      clearInterval(interval);
    };

  }, []);

  const connectWallet = async () => {
    if(window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      if(accounts.length != 0) {
        web3 = new Web3(window.ethereum);
        let a = web3.utils.toChecksumAddress(accounts[0]);
        currentAccount = a;
      }
    } else if(window.web3) {
      web3 = new Web3(window.web3);
    } else {
      alert('please install the wallet!');
      return;
    }

    await getData();
  }

  const readContract = async() => {
    console.log('readContract', contract)
    if(web3 != null && contract != null) {
      var instance = new web3.eth.Contract(erc20abi, contract);

      let symbol = await instance.methods.symbol().call();
      let totalSupply = await instance.methods.totalSupply().call();
      let bal = await instance.methods.balanceOf(currentAccount).call();

      setTokenSymbol(symbol);
      setTotalSupply(web3.utils.fromWei(totalSupply));
      setTokenBalance(web3.utils.fromWei(bal));
    }
  }

  const transfer = async() => {
    console.log('transfer', amount, toAddress)
    if(web3 != null && contract != null) {
      var instance = new web3.eth.Contract(erc20abi, contract);

      let data = instance.methods.transfer(toAddress, web3.utils.toWei(amount)).encodeABI();
      let egas = await web3.eth.estimateGas({
        to: contract,
        data,
        from: currentAccount,
        value: '0x00'
      });
      let price = await web3.eth.getGasPrice();
      let nonce = await web3.eth.getTransactionCount(currentAccount);

      setEstimateGas(egas);
      setGasPrice(price);

      let rawTx = {
        from: currentAccount,
        to: contract,
        nonce: web3.utils.toHex(nonce),
        gasPrice: price,
        gas: egas * 2,
        value: '0x00',
        data,
        chainId: chainID
      };

      web3.eth.sendTransaction(rawTx).on("transactionHash", function(hash) {
        console.log('hash: ', hash);
        setTxHash(hash);
      });
    }
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
        Current Account: {currentAccount}
      </div>
      <div>
        Current Balance: {balance}
      </div>
      <hr />

      <input type="text" value={contract} onChange={handleContractChange}></input>
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
        To Address:
        <input type="toAddress" value={toAddress} onChange={handleToAddressChange}></input>
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
