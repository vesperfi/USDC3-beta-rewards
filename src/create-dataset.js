'use strict'
const fs = require('fs')
const createMerkleBox = require('../packages/merkle-box-lib')

async function createDataSet(inputFileName, outputFileName) {
  const recipients = require(`../${inputFileName}`)
  const dataset = createMerkleBox.util.calcDataset(recipients)
  console.log(`Writing file ${outputFileName}`)
  fs.writeFileSync(outputFileName, JSON.stringify(dataset, null, 2))
}

module.exports = { createDataSet }
