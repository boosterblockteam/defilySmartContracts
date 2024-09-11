const { expect } = require('chai');
const { ethers, network, upgrades } = require('hardhat');

// Definimos las variables globales para reutilizaciÃ³n en las pruebas
let membershipContract;
let token;
let owner;
let user1;
let user2;
let user3;
let user4;
let user5;
let user6;
let user7;
let user8;
let user9;
let user10;
let user11;
let user12;
let user13;
let user14;
let user15;
let user16;
let user17;
let user18;
let user19;
let user20;
let user21;
let user22;
let user23;
let user24;
let user25;
let user26;
let user27;
let user28;
let user29;
let user30;
let user31;
let user32;
let user33;

// FunciÃ³n para aumentar el tiempo en la red
async function increaseTime(duration) {
  await network.provider.send("evm_increaseTime", [duration]);
  await network.provider.send("evm_mine");
}

// FunciÃ³n para crear signers aleatorios
function randomSigners(amount) {
  const signers = [];
  for (let i = 0; i < amount; i++) {
    signers.push(ethers.Wallet.createRandom());
  }
  return signers;
}

// Inicializamos las variables globales antes de cada prueba
beforeEach(async () => {
  const Token = await ethers.getContractFactory("StoneToken");
  token = await Token.deploy();
  
  const Poi = await ethers.getContractFactory('POI');
  poi = await Poi.deploy();
  
  const Account = await ethers.getContractFactory("NFTAccount");
  account = await Account.deploy();
  
  const MembershipContract3 = await ethers.getContractFactory('MembershipContract');
  membershipContract3 = await MembershipContract3.deploy();

  // Asignar los signers a las variables
   [owner, user1, user2, user3, user4, user5, ...restHardhatSigners] = await ethers.getSigners();

});



//////////////////////////////////////////////////////
//PRUEBAS CONTRATOS
describe('Prueba MEMBERS general', function () {
  it('PRUEBA GENERAL', async function () {
    //Funcion para inicializar
    async function initializeUsers(users, token, poiAddress, membersAddress) {
      for (const user of users) {
        console.log("Todo bien")
        await token.connect(user).approve(poiAddress, ethers.parseEther("100000000"));
        await token.connect(user).approve(account, ethers.parseEther("100000000"));
        await token.connect(user).approve(membersAddress, ethers.parseEther("100000000"));
        await token.transfer(user.address, ethers.parseEther("10000")); 
      }
    }

    async function getInformation() {
      const adminWalletsRewardsInEther = parseFloat(await account.adminWalletsRewards()) / 1e18;
      console.log("adminWalletsRewards",adminWalletsRewardsInEther)
    }


    //Seteo de direccion de contrato
    const tokenAddress = token.getAddress()
    const poiAddress = poi.getAddress()
    const accountAddress = account.getAddress()
    const membersAddress = membershipContract3.getAddress()


    //Inicializacion
    console.log("Se inicializan los contratos poniendo e POI 30usd como valor y poniendo a user9 en members como defily wallet (Para el sobrante) y en claim lo mismo (Por si la membresia tiene fee)")
    await poi.initialize(accountAddress,membersAddress);
    console.log("a")
    await account.initialize(tokenAddress,poiAddress,membersAddress,"0x0000000000000000000000000000000000000000",ethers.parseEther('30'));
    console.log("b")
    await membershipContract3.initialize(tokenAddress,poiAddress,accountAddress,"0x0000000000000000000000000000000000000000",accountAddress);


    //Se crean 5 membresias 
    console.log("Se crean 5 membresias la primera vale 0 pero tiene 10% de comision, las demas valen de a 1.000 la primera 1.000 la segunda 2.000  y asi...")
    await membershipContract3.createMembership('', 0, 0, 0, 99999,2592000,100,true,100,100);
    await membershipContract3.createMembership('Pay as you go', 0, 0, 99999, 31536000,ethers.parseEther("500"),ethers.parseEther("9999"),true,100,60);
    await membershipContract3.createMembership('Pay as you go +', 0, 0, 99999, 31536000,ethers.parseEther("10000"),ethers.parseEther("100000000"),true,50,50);
    await membershipContract3.createMembership('Basic', ethers.parseEther("100"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("1000"),false,0,60);
    await membershipContract3.createMembership('Essential', ethers.parseEther("250"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("2500"),false,0,60);
    await membershipContract3.createMembership('Premium', ethers.parseEther("500"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("5000"),false,0,60);
    await membershipContract3.createMembership('Professional', ethers.parseEther("1000"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("15000"),false,0,50);
    await membershipContract3.createMembership('Ultimate', ethers.parseEther("5000"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("100000"),false,0,40);
    await membershipContract3.createMembership('Max', ethers.parseEther("10000"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("1000000"),false,0,30);
    


    console.log("Se generan 5 wallets (User2,User3,User4,User5,User6) con la cantidad de usd para luego de comprar se queden en 0 y todos los contratos aprobados.")
    const users = [user1,user2, user3, user4, user5];
    console.log("a")
    await initializeUsers(users, token,accountAddress, poiAddress, membersAddress);

    console.log("Se registra User1 en el Poi")
    await poi.connect(user1).newUser("Defily@gmail.com","Defily AI","Defily123","123");
    await poi.connect(user2).newUser("joacolinares2003@gmail.com","Joaquin Linares","Joaco123","1234");
    await poi.connect(user3).newUser("Irving@gmail.com","Irving Lopez","Irving123","12345");
    await poi.connect(user4).newUser("Leadys@gmail.com","Leadys Perez","Leadys123","123456");
    console.log("User1 compra membresia 1 refiriendo a si mismo")
    console.log("Compra")
    


    getInformation()
    await account.connect(user1).createNFT("Master Account",user1.address,0,"",1,0); 
    getInformation()

    await account.connect(user2).createNFT("Joaquin Account",user2.address,0,"",1,1); 
    await account.connect(user3).createNFT("Irving Account",user3.address,0,"",2,2); 
    await account.connect(user4).createNFT("Leadys Account",user4.address,0,"",1,3); 

    const info0 = await account.accountInfo(0)
    const info1 = await account.accountInfo(1)
    const info2 = await account.accountInfo(2)

    console.log(info0.myLeft)
    console.log(info0.myRight)
    console.log("///")
    console.log(info1.myLeft)
    console.log(info1.myRight)
    console.log("///")
    console.log(info2.myLeft)
    console.log(info2.myRight)
    console.log("///")

    //await membershipContract3.connect(user1).buyMembership(1, 0, 0, user1.address, ""); 
    
 

  });
});