# iExec custom module

## Useful links

- iexec doc to create a module: https://protocol.docs.iex.ec/for-developers/your-first-app
- code example: https://github.com/iExecBlockchainComputing/iexec-apps/blob/master/cloud-computing/nodejs-hello-world/src/app.js
- web3mail: https://github.com/iExecBlockchainComputing/web3mail-sdk/tree/main/dapp/src
- block exploirer bellecour: https://blockscout-bellecour.iex.ec/

## step by step 

- 1. initiate a wallet and a the project: https://protocol.docs.iex.ec/for-developers/quick-start-for-developers
- 2. create a dockerfile, and a basic function in app.js
    - To test it locally: 
        - `./tests/build.sh`
        - `./tests/run.sh` || `./tests/run.sh test`
- 3. push and publish the docker image on docker hub
    - `./tests/publish.sh 1.0.0`
    - check on https://hub.docker.com/u/romaintalentlayer
    - update the iexec.json with the new docker image digest `"checksum": "0x3eb61f88481958ea580392f5a7b74317a7b077840009bfe6bccc5c06a2547b81"`
- 4. deploy the app `iexec app deploy --chain bellecour`
- 5. run the app on iExec `iexec app run --args test --watch --chain bellecour`
    - follow progress by deal: 
        - from explorer: `https://explorer.iex.ec/bellecour/deal/0x37957105bde93f73cb7e1b41bd42b6e5f234da4d2829cc5c575c61a8779cd51c`
        - or cli: `iexec deal show 0x37957105bde93f73cb7e1b41bd42b6e5f234da4d2829cc5c575c61a8779cd51c`
- 6. get the result `iexec task show <taskid> --download my-result --chain bellecour`
    - unzip it: `unzip my-result.zip -d my-result`
    - display it: `cat my-result/result.txt`
- 7. publish to marketplace : https://protocol.docs.iex.ec/for-developers/quick-start-for-developers#publish-your-app-on-the-iexec-marketplace
    - do i need to?


## how it works

- The applications deployed on iExec are Smart Contracts identified by their Ethereum address and referencing a public docker image.
- iExec Node gonna
    - mount the app
    - use Secret Management Service (SMS)
    - to get data protected link to the request


## Questions

- step 1.
    - why doing the storage init ? 
- step 5. 
    - why it's not executing ? 