# iExec custom module

## Useful links

- iexec doc to create a module: https://protocol.docs.iex.ec/for-developers/your-first-app
- code example: https://github.com/iExecBlockchainComputing/iexec-apps/blob/master/cloud-computing/nodejs-hello-world/src/app.js
- web3mail: https://github.com/iExecBlockchainComputing/web3mail-sdk/tree/main/dapp/src

## step by step 

- 1. initiate a wallet and a the project: https://protocol.docs.iex.ec/for-developers/quick-start-for-developers
- 2. create a dockerfile, and a basic function in app.js
    - To test it locally: 
        - `./tests/build.sh`
        - `./tests/run.sh` || `./tests/run.sh test`


## how it works

- The applications deployed on iExec are Smart Contracts identified by their Ethereum address and referencing a public docker image.
- iExec Node gonna
    - mount the app
    - use Secret Management Service (SMS)
    - to get data protected link to the request


## Questions

- step 1.
    - why doing the storage init ? 