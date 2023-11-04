# iExec custom module

## Useful links

- iexec doc to create a module: https://protocol.docs.iex.ec/for-developers/your-first-app
- code example: https://github.com/iExecBlockchainComputing/iexec-apps/blob/master/cloud-computing/nodejs-hello-world/src/app.js
- web3mail: https://github.com/iExecBlockchainComputing/web3mail-sdk/tree/main/dapp/src
- block exploirer bellecour: https://blockscout-bellecour.iex.ec/

## Create my application step by step

- 1. initiate a wallet and the project: https://protocol.docs.iex.ec/for-developers/quick-start-for-developers
- 2. create a dockerfile, and a basic function in app.js
    - To test it locally: 
        - `./tests/build.sh`
        - `./tests/run.sh` || `./tests/run.sh test`
- 3. push and publish the docker image on docker hub
    - `./tests/publish.sh 1.0.0`
    - check on https://hub.docker.com/u/romaintalentlayer
    - update the iexec.json with the new docker image digest `"checksum": "0x3eb61f88481958ea580392f5a7b74317a7b077840009bfe6bccc5c06a2547b81"`
- 4. deploy the app `iexec app deploy --chain bellecour`
    - check: `iexec app show --chain bellecour`
- 5. run the app on iExec `iexec app run --args test --watch --chain bellecour`
    - follow progress by deal: 
        - from explorer: `https://explorer.iex.ec/bellecour/deal/0x37957105bde93f73cb7e1b41bd42b6e5f234da4d2829cc5c575c61a8779cd51c`
        - or cli: `iexec deal show 0x37957105bde93f73cb7e1b41bd42b6e5f234da4d2829cc5c575c61a8779cd51c`
    - debug: `iexec task debug <taskid> --logs --chain bellecour`
- 6. get the result `iexec task show <taskid> --download my-result --chain bellecour`
    - unzip it: `unzip my-result.zip -d my-result`
    - display it: `cat my-result/result.txt`
- 7. publish to marketplace : https://protocol.docs.iex.ec/for-developers/quick-start-for-developers#publish-your-app-on-the-iexec-marketplace
    - do i need to?

## Protecting the app with TEE

- Important: Today, it is not possible to build a TEE application for a SGX enclave from a laptop based on an ARM architecture like the latest MacBook Pro devices. => Only for node right?

- 1. Create a free account on scone 
    - link to the website don't show any register possibility ? 
    - I created an account on the gitlab https://gitlab.scontain.com/users/sign_in#login-pane, is it what we need ? 


## how it works

- The applications deployed on iExec are Smart Contracts identified by their Ethereum address and referencing a public docker image.
- DataProtector core concepet: 
    - Confidential Computing (or Trusted Execution Environments - 'TEE'): ensures computation confidentiality through mechanisms of memory encryption at the hardware level
    - Trusted Computing: ensuring that code runs correctly without any third party altering the execution
    - use intel® Software Guard Extension (Intel® SGX), to create this "black box"
    - iExec supports high-level frameworks, known as TEE frameworks, such as Scone and Gramine. 
- iExec Node gonna
    - mount the docker app
    - use Secret Management Service (SMS) to mount a volume with decrypted file



## Questions

- step 1.
    - why doing the storage init ? 
- step 5. 
    - why it's not executing ? 


## Troubleshooting

- Issue 1:
    - run: `iexec app run --args test --watch --chain bellecour`
    - error: `✖ Command "iexec app run" failed with Error: Request requirements check failed: SMS at https://sms.scone-prod.v8-bellecour.iex.ec didn't answered (If you consider this is not an issue, use --skip-preflight-check to skip preflight requirement check)`
    - what is it ?