'use strict'

const BN = require('bn.js')
const Web3 = require('web3')
require('dotenv').config()
require('dotenv-defaults').config()
const erc20Abi = require('./abi/erc20.json')
const epochDuration = parseInt(process.env.EPOCH_DURATION)
const web3 = new Web3(process.env.NODE_URL)

const pool = new web3.eth.Contract(erc20Abi, process.env.POOL)

function getRewards(
  addressList,
  epochEndBlock,
  thisEpochDuration,
  rewardsPerEpoch
) {
  return pool.methods
    .totalSupply()
    .call(epochEndBlock)
    .then(function (totalSupply) {
      const promises = []
      addressList.forEach(function (address) {
        const promise = pool.methods
          .balanceOf(address)
          .call(epochEndBlock)
          .then(function (balance) {
            const rewards = new BN(balance)
              .mul(new BN(rewardsPerEpoch))
              .mul(new BN(thisEpochDuration))
              .div(new BN(epochDuration))
              .div(new BN(totalSupply))
            return {
              address,
              balance,
              epochEnd: epochEndBlock,
              rewards: rewards.toString()
            }
          })
        promises.push(promise)
      })
      return Promise.all(promises).then(function (rewardsDataList) {
        return rewardsDataList.filter(data => data.balance !== '0')
      })
    })
}

async function getRewardsForAllEpoch(
  addressList,
  startBlock,
  endBlock,
  rewardsPerEpoch
) {
  const promises = []
  let epochEndBlock = startBlock
  while (epochEndBlock < endBlock) {
    epochEndBlock = epochEndBlock + epochDuration
    if (epochEndBlock > endBlock) {
      promises.push(
        getRewards(
          addressList,
          endBlock,
          endBlock + epochDuration - epochEndBlock,
          rewardsPerEpoch
        )
      )
    } else {
      promises.push(
        getRewards(addressList, epochEndBlock, epochDuration, rewardsPerEpoch)
      )
    }
  }
  return Promise.all(promises)
}

module.exports = { getRewardsForAllEpoch }
