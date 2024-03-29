# Fairground

An open-source blockchain land protocol and auction platform featuring demand-based ground rent for building better, more sustainable, and more inclusive cities, designed from the bottom-up by the community.

- [Whitepaper](https://drive.google.com/file/d/1_636cLWhI-LZw_KYkIm6hjNDM8dZSsMn/view)
- [Newsletter](https://www.joinfairground.com/)
- [Live Prototype](https://fairground.vercel.app/)

Protocol Features and Objectives:
- Demand-based ground rent collection and citizens dividend distribution
- On-chain land registry and title transfer governed by auction smart contracts
- Decentralized and market-driven zoning, planning, and infrastructure
- Protocol level changes by unanimous stakeholder consent through agreement, buyout, or amicable division

Protocol Inspiration and Reference:
- [Progress and Poverty](https://cdn.mises.org/Progress%20and%20Poverty_3.pdf) by Henry George
- [Chapter 1 of Radical Markets](https://assets.press.princeton.edu/chapters/s11222.pdf) by Glen Weyl
- [Thoughts on Perpetual Property Rights](https://bytemaster.medium.com/thoughts-on-perpetual-property-rights-b8c7f5bf4221) by Daniel Larimer
- [Should there be demand-based recurring fees on ENS domains?](https://vitalik.ca/general/2022/09/09/ens.html) by Vitalik Buteren

>*"Cities have the capability of providing something for everybody, only because, and only when, they are created by everybody" — Jane Jacobs*

## Getting Started



It is recommended to use Yarn to avoid dependency collisions: [Yarn](https://classic.yarnpkg.com/en/docs/install)

```bash
git clone https://github.com/caseywoolley/fairground.git
cd fairground

yarn install

# Start up the Hardhat Network
yarn chain
```

Here we just install the npm project's dependencies, and by running `yarn chain` we spin up an instance of Hardhat Network that you can connect to using MetaMask. In a different terminal in the same directory, run:

```bash
yarn localhost
```

This will deploy the contract to Hardhat Network. After this completes run:

```bash
cd frontend
yarn install
```

This will install the frontend packages. We also need to set up the local configuration file.

```bash
cp .env.local.example .env.local
```

This will create a file called `.env.local`. Open up that file and fill in the `NEXT_PUBLIC_ALCHEMY_{NETWORK}_API_KEY=` environment variables.

```bash
yarn dev
```

This will start up the Next.js development server. Your site will be available at http://localhost:3005/

To interact with the local contract, be sure to switch your MetaMask Network to `Localhost 8545`

- [Hardhat](https://hardhat.org/)
- [Next.js](https://nextjs.org/)
- [RainbowKit](https://www.rainbowkit.com/)
- [wagmi](https://wagmi.sh/)
- [Chakra UI](https://chakra-ui.com/)

Thanks to [Hunter Chang](https://github.com/ChangoMan) and [BuidlGuidl](https://buidlguidl.com) for an excellent hardhat/Nextjs application [template](https://github.com/ChangoMan/nextjs-ethereum-starter)!
