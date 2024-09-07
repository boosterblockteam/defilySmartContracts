require("@nomicfoundation/hardhat-toolbox");
require('@openzeppelin/hardhat-upgrades');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
     optimizer: {
        enabled: true,
        runs: 100,       
      },
      viaIR: true,
    },
  },
  networks: {
    polygon: {
      url: "https://polygon-rpc.com/",
      chainId: 137,
      accounts: ["2da37782f9ecde83274cdbb940284ba0906d447534b956247c5a4f378ba3f64e"], // AsegÃºrate de definir la PRIVATE_KEY en tu .env
      gas: 60 * 10**9, // LÃ­mite de gas
      gasPrice: 60 * 10**9 // Precio del gas en gwei (5 gwei)
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: ["e2ec0c8ad5bf6f9bb002f6b5fd5446e74c2582b22f06a26c8d8b2d01d6d34308"], // AsegÃºrate de definir la PRIVATE_KEY en tu .env
    },
  },
  etherscan: {
    apiKey: {
   //   polygon: 'AC6KPPI6MACGFDUUD6XT2V2VUPVNVKC7ZQ' ACTIVAR PARA BOOSTER
      bsc: 'AABG8TZX1JPB9JJMFFPF42IBYSC6PI1ED8'
    }
  }
};
//9212G6N98F4I1FK3V7N1ZQ93AUP2AJYIFK