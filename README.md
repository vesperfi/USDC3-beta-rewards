# ERC20 balance snapshot

Generate snapshot for distributing rewards based on erc20 balance snapshot every epoch.

## Setup
1. Install 
```
npm i
```

2. Set required environment variables using `export` or `.env`
```
export NODE_URL="eth_mainnet_url"
export MNEMONIC="mnemonic"
```

Check and update (if required) default values in `.env.defaults`

1. Calculate rewards data file using command line args. 
   
Command Syntax   
```
node index.js -s <rewardsStartBlock> -e <rewardsEndBlock>
```

Raise Pull request to verify generated data file. Once PR is verified, approved and merged, call `create-claim` operation. 

4. Create claim using generated data file. 

Command Syntax
```
node create-claim.js -f <datasetUrl>
```


Create claim using fork for local testing.
1. Create fork
```
npm run fork
```
2. Run below command on another terminal to create a claim. 
The `swap-eth-to-erc20.js` will swap some VSP to first account of configured `mnemonic`.
```
export NODE_URL="http://localhost:8545"
node test/swap-eth-to-erc20.js
node create-claim.js -f <datasetUrl>
```
3. Clone `pure.finance` repo and run below command on another terminal. 
Open `http://localhost:3000/merkle-claims` and Merkle Claims for generated claim id.
```
npm install
npx lerna run --stream dev
```