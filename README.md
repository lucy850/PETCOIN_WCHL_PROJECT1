# `PetCoin`

Welcome to your new `PetCoin` project and to the Internet Computer development community. By default, creating a new project adds this README and some template files to your project directory. You can edit these template files to customize your project and include your own code to speed up the development cycle.

`PetCoin` is a platform designed to facilitate donations in a secure, transparent, and engaging way. Users can donate to people in need using Plug Wallet, sending ICP tokens directly to the recipient's address. The platform is fully integrated with Internet Identity (ICP login), ensuring that all transactions are traceable and transparent.

To make the donation experience more interactive, `PetCoin` provides collectible pet cards and accessories as rewards for donors. Each donation earns the donor a card or accessory, which can be collected, displayed, and even traded within the platform. Additionally, a gacha system is implemented to make collecting pets more fun: donors can spend PetCoins to perform a “gacha pull” and receive random pets or accessories. This gamification encourages users to engage more with the platform while supporting real causes.

## Project structure

- `PetCoin-WCHL-Project/` — Root project directory
- `src/PetCoin_backend/` — Backend canister written in Motoko, handling PetCoin logic, donation tracking, and user data.
- `src/PetCoin_frontend/public/my-icp-login/` — Frontend using Vite + JS/HTML/CSS, handling wallet integration, ICP login, gacha UI, and collection display.
- `dfx.json` — DFX configuration file for canisters and local replica.


To learn more before you start working with `PetCoin`, see the following documentation available online:

- [Quick Start](https://internetcomputer.org/docs/current/developer-docs/setup/deploy-locally)
- [SDK Developer Tools](https://internetcomputer.org/docs/current/developer-docs/setup/install)
- [Motoko Programming Language Guide](https://internetcomputer.org/docs/current/motoko/main/motoko)
- [Motoko Language Quick Reference](https://internetcomputer.org/docs/current/motoko/main/language-manual)

## Running the project locally
If you want to start working on your project right away, you might want to try the following commands:

1. Installation and Setup
First, make sure you have the DFINITY SDK and Node.js installed.
If you don't have it, install the DFINITY SDK with this command:

```bash
sh -ci "$(curl -sS https://internetcomputer.org/install.sh)"
```

2. Cloning the Repository
Copy the project code to your local machine:

```bash
git clone https://github.com/username/PetCoin-Project.git
```

3. Installing Dependencies

```bash
npm install
npm install @dfinity/agent@0.15.7 @dfinity/auth-client@0.15.7 @dfinity/candid@0.15.7 @dfinity/identity@0.15.7 --legacy-peer-deps
```

4. Running and Deploying

```bash
dfx start --background
dfx deploy
```

5. Generate Backend Declarations
Run only once to generate backend declarations

```bash
dfx generate PetCoin_backend
```

6. Running the Frontend

```bash
cd src/PetCoin_frontend/public/my-icp-login
npm run dev
```

7. Build frontend for production (output in dist/, use for hosting/deployment)

```bash
npm run build
```

8. Stopping the Replica

```bash
dfx stop
```



## Features overview
- ICP Login: Secure login via Internet Identity, ensuring transparent donor authentication.
- Plug Wallet Integration: Users can top up, check balances, and donate using ICP tokens.
- Pet & Accessory Cards: Donors receive collectible cards representing pets and accessories as rewards for donations.
- Gacha System: Donors can spend PetCoins to perform gacha pulls and receive random pets or accessories, making donations more engaging.
- Collection Display: Users can view their acquired pets and accessories, with options to manage and showcase their collection.
- Responsive Frontend: Mobile and desktop friendly interface, with interactive elements like glowing buttons, particle effects, and modal popups.



`PetCoin` combines secure blockchain transactions with gamified interactions to make donating fun, transparent, and rewarding. It’s designed to motivate users to contribute to real causes while enjoying the collectible and interactive experience.
