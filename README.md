# Digital Will

## BUILD INSTRUCTIONS

### NOTE
Development mode is enabled by default that requires [Docker](https://www.docker.com) to initialize a local blockchain node. If you want to launch on testnet then navigate to ```DigitalWill/digital-will/libs/stacks/auth/auth.js``` and set:
```javascript
export const DevelopmentMode = false;
```

Clone the Project 
```bash
git clone https://github.com/ummarikram/DigitalWill.git
```

Change Directory 
```bash
cd .\digital-will\
```

Install Node Modules 
```bash
npm i
```

Run Application 
```bash
npm run dev
```

### FOR DEVNET SETUP (Requires [Docker](https://www.docker.com))

Change Directory 
```bash
cd .\digital-will\libs\stacks\contracts\digitalWill
```
Run Blockchain Container
```bash
clarinet integrate
```

## DEPENDENCIES

[Hiro Wallet](https://wallet.hiro.so/wallet/install-web)

## BASIC FEATURES

* Time-locked escrow contract (Beneficiary, Donor)
* Will as a Non-fungible token (PNG/JPG metadata)
* Decentralized Storage (Gaiahub)
* Fungible token as a currency (STX)
* Asymmetric/Symmetric encryption for securing metadata (AES-256 & SHA-256)
