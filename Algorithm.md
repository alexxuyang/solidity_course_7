# 背景
## ECDSA签名算法
输入
$$Private\ Key: sk$$
$$Message\ Hash: H_m$$
输出
$$Sig = (r, s)$$

计算过程
$$nonce = random\ num\ in\ curve's\ group\ order$$
$$r = Rx = nonce\cdot G$$
$$s = nonce^{-1}(H_m + sk*R_x)\ mod\ n$$

## 欧拉定理和费马小定理
对于互质的(e, n):
$$e^{\psi(n)} \equiv 1\ mod\ n$$
若n为质数p
$$e^{\psi(p)} \equiv e^{p - 1} \equiv 1\ mod\ p$$
定义有限域上a的乘法逆元
$$a^{-1}a \equiv 1\ mod\ p$$
计算乘法逆元
$$a^{-1} = a^{p - 2}$$

## Lagrange 插值
1元n次方程
$$f(x) = \sum_{i=0}^{n}a_ix^i$$
需要n+1个不同的点来确定所有的$a_i$

假设已经有点集
$$\{(x_i, y_i) | 0 \le i \le n\}$$

使用Lagrange插值可以求得f(x)的表达式
$$f(x) = \sum_i\frac{\prod_{j \neq i}(x - x_j)}{\prod_{j \neq i}(x_i - x_j)}y_i$$

## Shamir secret sharing
将随机数r分享给n个人，恢复出r需要t+1个人在场

构造数列
$$\{a_0, a_1, ... a_t\}$$
其中
$$a_0 = r$$
$$a_i = random, (i > 0)$$
构造方程
$$f(x) = \sum_{i=0}^{t}a_ix^i$$
取f(x)的n个不同的解
$$\{(x_i, y_i)|1 \le i \le n, x_i = i, y_i = f(x_i)\}$$
当获得t+1个点的值时，我们可以使用Lagrange插值公式求得
$$r = f(0) = \sum_i\frac{\prod_{j \neq i}(-j)}{\prod_{j \neq i}(i - j)}y_i$$
对于某个参与方$i$来说，$y_i$具有固定系数，称为Lagrange系数
$$\lambda_i = \frac{\prod_{j \neq i}(-j)}{\prod_{j \neq i}(i - j)}$$

## Multi party shamir secret sharing
参与方$i$具有随机数$r_i$，执行shamir secret sharing，分配给j的值记为$r_{ij}$。
对于任意i, $r_{ij}$的拉格朗日系数是相同的。
我们可以得到
$$\omega_j = \lambda_j\sum_ir_{ij}$$
可以得到
$$\sum_{i\ in\ n} r_i = \sum_{j\ in\ t} \omega_j$$

## Paillier encryption
加法同态，sk=私钥，pk=公钥
$$m1 + m2 = Dec_{sk}(Enc_{pk}(m1) + Enc_{pk}(m2))$$

## Multi party multiplication
有p个人，每个人有两个随机数$(a_i, b_i)$，如何在不泄露$a_i, b_i$的情况下计算
$$M = \sum a_i\sum b_i$$
1. $Party_i$发送$\delta_{ij} = Enc_{pk_i}(a_i)$给$Party_j$
2. $Party_j$收到后，产生一个随机数$r_{ij}$，计算$\theta_{ij} = b_i\delta_{ij}+Enc_{pk_i}(r_{ij})$，发送结果给$Party_i$
3. $Party_i$收到后，计算$\sigma_{ij}=Dec_{sk_i}(\theta_{ij})$

根据Paillier的性质，可以得到
$$\sigma_{ij}=Dec_{sk_i}(b_i\delta_{ij}+Enc_{pk_i}(r_{ij}))=a_ib_j+n_{ij}$$
每一个$Party_i$计算
$$\sigma_i = \sum_{j \neq i}\sigma_{ij} + a_ib_i - \sum_{j \neq i}n_{ji}$$
汇总$\sigma_i$得到
$$\sigma = \sum_i\sigma_i = \sum a_i\sum b_i$$

# Initialization
每个参与方生成随机数$r_i$
私钥
$$pk = \sum r_i$$
需要签名时，每个参与方计算自己的$\omega_i$，于是
$$pk = \sum_{i\ in\ n} r_i = \sum_{i\ in\ t} \omega_i$$

# Generate signature
每个参与方生成随机$nonce_i$，并计算自己的$\omega_i$，除此之外生成一个随机数$\delta_i$, 我们计$\delta = \sum \delta_i, nonce=\sum nonce_i$
使用多方乘法计算
$$k = \sum nonce_i \sum delta_i$$
使用多方乘法计算
$$\zeta = \sum \omega_i \sum delta_i = sk\cdot\delta$$
计算
$$B_i = nonce_iG$$
汇总$B_i$得到
$$B = \sum B_i$$
计算
$$R = k^{-1}B$$
$$s = \delta H_m + R_x\zeta$$

其中
$$R = k^{-1}B = nonce^{-1}\delta^{-1}nonceG = \delta^{-1}G$$
$$s = \delta H_m + R_x\zeta = \delta(H_m + sk \cdot R_x)$$