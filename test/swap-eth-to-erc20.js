// This file is used to convert ETH to VSP for testing purpose only.

'use strict'
require('dotenv').config()
const Web3 = require('web3')
const bip39 = require('bip39')
const hdkey = require('hdkey')
const erc20Abi = require('erc-20-abi')
const BN = require('bn.js')
const web3 = new Web3(process.env.NODE_URL)
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
const VSP = '0x1b40183efb4dd766f11bda7a7c3ad8982e998421'
const DECIMAL = new BN('1000000000000000000')
const { getRouterContract } = require('../packages/erc-20-lib/src/uniswap')

function mnemonicToKeyPair(mnemonic, derivationPath, password) {
  const seed = bip39.mnemonicToSeedSync(mnemonic, password)
  const { privateKey, publicKey } = hdkey
    .fromMasterSeed(seed)
    .derive(derivationPath)
  return { privateKey, publicKey }
}

function getFromAddress() {
  const derivationPath = "m/44'/60'/0'/0/0"
  const privateKey = mnemonicToKeyPair(process.env.MNEMONIC, derivationPath)
    .privateKey
  web3.eth.accounts.wallet.create(0).add(`0x${privateKey.toString('hex')}`)
  return web3.eth.accounts.wallet[0].address
}

function convertEthToERC20(token, amount) {
  const path = [WETH, token]
  const amountIn = new BN(amount).mul(DECIMAL).toString()
  const from = getFromAddress()
  getRouterContract(web3)
    .methods.swapExactETHForTokens(
      1,
      path,
      from,
      Math.round(Date.now() / 1000) + 60
    )
    .send({ from, value: amountIn, gas: 200000 })
    .then(function () {
      const erc20Contract = new web3.eth.Contract(erc20Abi, token)
      return erc20Contract.methods
        .balanceOf(from)
        .call()
        .then(function (balance) {
          console.log(`Swap success, ERC20 token balance = ${balance}`)
        })
    })
    .catch(console.error)
}

// For Test, convert 1000000 ETH to VSP
convertEthToERC20(VSP, 1000000)
