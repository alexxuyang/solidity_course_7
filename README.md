合约文件是[ExtendedERC20.sol](https://github.com/alexxuyang/solidity_course_5/blob/main/contracts/ExtendedERC20.sol)

实现的功能：
- 合约创建者（owner）mint token
- 任何人都可以burn token
- 合约创建者（owner），可以设置
    - fee：transfer收取的手续费
    - burnAmount：在fee中，需要燃烧的数量（burn）
    - feeCollector：手续费收集账号

当用户A transfer token时，假设金额是amount，接收者是B。那么：
- A.balance = A.balance - amount - fee
- B.balance = B.balance + amount
- feeCollector.balance = feeCollector.balance + fee - burnAmount
- totalSupply = totalSupply - burnAmount

测试案例文件是[ExtendedERC20.js](https://github.com/alexxuyang/solidity_course_5/blob/main/test/ExtendedERC20.js)

核心的测试代码如下：

![测试代码](https://github.com/alexxuyang/solidity_course_5/blob/main/images/001.png)

本地测试通过截图：

![测试截图](https://github.com/alexxuyang/solidity_course_5/blob/main/images/004.png)

部署在arbitrum rinkeby的合约地址为：
https://testnet.arbiscan.io/tx/0xe36a5df65b42777bb3149ce6b498efee066b893427e7e5dbb22dcf7f5be40bec
https://testnet.arbiscan.io/address/0x0d2f271808b6344013cce4446e5402fb78e1c725

mint操作：\
operate account: 0xBD3d736107744B3429081597b8A920CB69cad541\
receive account：0xBc461fA713b5EeAc7BE790bF4a1A1C7bBa6332dc\
amount: 1000000\
hash: https://testnet.arbiscan.io/tx/0x53b1c981fe75e2f714e7b074c87aa01f672c3b2bf91b4c921d1fe45a700a5bc4


burn操作：\
operator account: 0xBc461fA713b5EeAc7BE790bF4a1A1C7bBa6332dc\
amount: 1000\
hash: https://testnet.arbiscan.io/tx/0xa0f3157f97029208eb0aa55622b220866a3d4b75424caac39bfe4bd6b9df3fbe


transfer:\
from account: 0xBc461fA713b5EeAc7BE790bF4a1A1C7bBa6332dc\
to account: 0x1087D9a0FbCb9B0402e2D657669c0E099EF0245c\
amount: 1500\
hash: https://testnet.arbiscan.io/tx/0x62f5b3b040d8295a831c3eb5d7c82f1e0716230a54758d7087a1b05daddabd44


设置fee：\
operator account: 0xBD3d736107744B3429081597b8A920CB69cad541\
fee: 1000\
hash: https://testnet.arbiscan.io/tx/0x28a82e9671964f4ee99fafd3831c9b9df6e8d137eb9007f3f74d88a3ecc86da0


设置burnAmount：\
operator account: 0xBD3d736107744B3429081597b8A920CB69cad541\
burnAmount: 100\
hash: https://testnet.arbiscan.io/tx/0x187b91c94bf5f3c7c6d1ed9f1ddeef315053e23784740b4a1323dd3b362fa916


设置feeCollector：\
operator account: 0xBD3d736107744B3429081597b8A920CB69cad541\
feeCollector: 0x67C19CCDB7f5A94030a220C08B2C2311F759D072\
hash: https://testnet.arbiscan.io/tx/0xeb833287513ff0bf10d8f3cdc6697228899f0644efaa8e1fdd2f721f3140cb3f


transfer:\
from account: 0xBc461fA713b5EeAc7BE790bF4a1A1C7bBa6332dc\
to account: 0x1087D9a0FbCb9B0402e2D657669c0E099EF0245c\
amount: 100000\
hash: https://testnet.arbiscan.io/tx/0xd32d450f96fb13bbf346b695cb26af0361eac6916767fc671de069dd83c93b37


下图中的“Tokens Transferred”部分可以看到，我们在transfer中收取了额外的手续费，并同时burn了100 Token

![token transfer](https://github.com/alexxuyang/solidity_course_5/blob/main/images/002.png)

![event](https://github.com/alexxuyang/solidity_course_5/blob/main/images/003.png)
