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

  const StakingContract = await ethers.getContractFactory('Staking');
  stakingContract = await StakingContract.deploy();
  const TreasuryContract = await ethers.getContractFactory('Treasury');
  treasuryContract = await TreasuryContract.deploy();

  // Asignar los signers a las variables
   [owner, user1, user2, user3, user4, user5, user6, user7, user8, user9, user10] = await ethers.getSigners();

});



//////////////////////////////////////////////////////
//PRUEBAS CONTRATOS
describe('Prueba MEMBERS general', function () {

  // it('PRUEBA GENERAL', async function () {
  //   //Funcion para inicializar
  //   async function initializeUsers(users, token, poiAddress, membersAddress) {
  //     for (const user of users) {
  //       console.log("DIRECCION")
  //       console.log(await membersAddress)
  //       await token.connect(user).approve(poiAddress, ethers.parseEther("10000000000"));
  //       await token.connect(user).approve(account, ethers.parseEther("10000000000"));
  //       await token.connect(user).approve(membershipContract3, ethers.parseEther("10000000000"));
  //       await token.transfer(user.address, ethers.parseEther("1000")); 
  //     }
  //   }

  //   async function getInformation() {
  //     const adminWalletsRewardsInEther = parseFloat(await account.adminWalletsRewards()) / 1e18;
  //     const rewards0 = parseFloat(await account.rewards(0)) / 1e18;
  //     const rewards1 = parseFloat(await account.rewards(1)) / 1e18;
  //     const rewards2 = parseFloat(await account.rewards(2)) / 1e18;
  //     const rewards3 = parseFloat(await account.rewards(3)) / 1e18;



  //     console.log("Ganancia a reclamar del admin: ",adminWalletsRewardsInEther)," $"
      
  //     console.log("Ganancia a reclamar del usuario0: ",rewards0)," $"
  //     console.log("Ganancia a reclamar del usuario1: ",rewards1)," $"
  //     console.log("Ganancia a reclamar del usuario2: ",rewards2)," $"
  //     console.log("Ganancia a reclamar del usuario3: ",rewards3)," $"
  //     console.log("///////////////")
  //   }


  //   //Seteo de direccion de contrato
  //   const tokenAddress = token.getAddress()
  //   const poiAddress = poi.getAddress()
  //   const accountAddress = account.getAddress()
  //   const membersAddress = membershipContract3.getAddress()


  //   //Inicializacion
  //   console.log("Se inicializan los contratos poniendo e POI 30usd como valor y poniendo a user9 en members como defily wallet (Para el sobrante) y en claim lo mismo (Por si la membresia tiene fee)")
  //   await poi.initialize(accountAddress,membersAddress);
  //   await account.initialize(tokenAddress,poiAddress,membersAddress,"0x0000000000000000000000000000000000000000",ethers.parseEther('30'));
  //   await membershipContract3.initialize(tokenAddress,poiAddress,"0x0000000000000000000000000000000000000000",accountAddress);
    
  //   await account.setAdminWallet(user10.address);
  //   await membershipContract3.setPartnerShip(user10.address);

  //   //Se crean 5 membresias 
  //   console.log("Se crean 5 membresias la primera vale 0 pero tiene 10% de comision, las demas valen de a 1.000 la primera 1.000 la segunda 2.000  y asi...")
  //   await membershipContract3.createMembership('', 0, 0, 0, 99999,2592000,100,true,100,100);
  //   await membershipContract3.createMembership('Pay as you go', 0, 0, 99999, 31536000,ethers.parseEther("500"),ethers.parseEther("9999"),true,100,60);
  //   await membershipContract3.createMembership('Pay as you go +', 0, 0, 99999, 31536000,ethers.parseEther("10000"),ethers.parseEther("100000000"),true,50,50);
  //   await membershipContract3.createMembership('Basic', ethers.parseEther("100"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("1000"),false,0,60);
  //   await membershipContract3.createMembership('Essential', ethers.parseEther("250"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("2500"),false,0,60);
  //   await membershipContract3.createMembership('Premium', ethers.parseEther("500"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("5000"),false,0,60);
  //   await membershipContract3.createMembership('Professional', ethers.parseEther("1000"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("15000"),false,0,50);
  //   await membershipContract3.createMembership('Ultimate', ethers.parseEther("5000"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("100000"),false,0,40);
  //   await membershipContract3.createMembership('Max', ethers.parseEther("10000"), 0, 99999, 31536000,ethers.parseEther("200"),ethers.parseEther("1000000"),false,0,30);
    


  //   console.log("Se generan 5 wallets (User2,User3,User4,User5,User6) con la cantidad de usd para luego de comprar se queden en 0 y todos los contratos aprobados.")
  //   const users = [user1,user2, user3, user4, user5, user6, user7];
   
  //   await initializeUsers(users, token,accountAddress, poiAddress, membersAddress);

  //   console.log("Se registra User1 en el Poi")
  //   await poi.connect(user1).newUser("Defily@gmail.com","Defily AI","Defily123","123");
  //   await poi.connect(user2).newUser("joacolinares2003@gmail.com","Joaquin Linares","Joaco123","1234");
  //   await poi.connect(user3).newUser("Irving@gmail.com","Irving Lopez","Irving123","12345");
  //   await poi.connect(user4).newUser("Leadys@gmail.com","Leadys Perez","Leadys123","123456");
  //   await poi.connect(user5).newUser("Jesica@gmail.com","Jesica test","Jesi123","1234567");
  //   await poi.connect(user6).newUser("Antonio@gmail.com","Antonio test","Antonio123","12345678");
  //   console.log("User1 compra membresia 1 refiriendo a si mismo")
  //   console.log("Compra")
    
  //   console.log("ADMIN")
  //   console.log("Admin le crea usuario a usuario 7")
  //   await poi.createNewUser(user7.address, "pepe@gmail.com","Pepe Perez","Pepe123","123456789");
  //   console.log("Admin le crea cuenta a usuario 7")
  //   await account.createNFTAdmin("Pepe Account",user7.address,0,"",2,1001); 


  //   console.log("Usuario 1 con 1000usd compra cuenta, refiriendo al ID 0 para iniciar el proyecto (Aca se reparte todo al admin ya que no hay sponsor)")
  //   await account.connect(user1).createNFT("Master Account",user1.address,0,"",1,0);  

  //   console.log("Usuario 2 con 1000usd compra cuenta con ID 15, con sponsor al ID 0 (Usuario 1) el lado izquierdo")
  //   await account.connect(user2).createNFT("Joaquin Account",user2.address,0,"",1,15); 
    
  //   console.log("Usuario 3 con 1000usd compra cuenta con ID 20, con sponsor al ID 0 (Usuario 1) el lado derecho")
  //   await account.connect(user3).createNFT("Irving Account",user3.address,0,"",2,20); 
    
  //   console.log("Usuario 4 con 1000usd compra cuenta con ID 500, con sponsor al ID 0 (Usuario 1) el lado izquierdo")
  //   await account.connect(user4).createNFT("Leadys Account",user4.address,0,"",1,500); 

  //   console.log("Usuario 5 con 1000usd compra cuenta con ID 144, con sponsor al ID 15 (Usuario 2) el lado alternante(izquierdo)")
  //   await account.connect(user5).createNFT("Jesica Account",user5.address,15,"",3,144); 

  //   console.log("Usuario 6 con 1000usd compra cuenta con ID 452, con sponsor al ID 15 (Usuario 2) el lado alternante(derecho)")
  //   await account.connect(user6).createNFT("Anotnio Account",user6.address,15,"",3,452); 

  //   console.log("Usuario 4 con 970usd compra cuenta con ID 600, con sponsor al ID 500 (Usuario 4) el lado alternante(izquierdo)")
  //   await account.connect(user4).createNFT("Anotnio Account2",user4.address,500,"",3,600); 

  //   console.log("Usuario 4 con 940usd compra cuenta con ID 601, con sponsor al ID 500 (Usuario 4) el lado alternante(derecha)")
  //   await account.connect(user4).createNFT("Anotnio Account3",user4.address,500,"",3,601); 

  //   console.log("Usuario 4 con 910usd compra cuenta con ID 602, con sponsor al ID 500 (Usuario 4) el lado alternante(izquierda)")
  //   await account.connect(user4).createNFT("Anotnio Account4",user4.address,500,"",3,602); 

  //   console.log("Usuario 4 con 880usd compra cuenta con ID 603, con sponsor al ID 500 (Usuario 4) el lado alternante(derecha)")
  //   await account.connect(user4).createNFT("Anotnio Account5",user4.address,500,"",3,603); 

  //   console.log("Usuario 5 con 970usd compra cuenta con ID 800, con sponsor al ID 144 (Usuario 5) el lado derecho")
  //   await account.connect(user5).createNFT("Jesica Account 2",user5.address,144,"",2,800); 

  //   console.log("Usuario 5 con 940usd compra cuenta con ID 801, con sponsor al ID 144 (Usuario 5) el lado derecho")
  //   await account.connect(user5).createNFT("Jesica Account 3",user5.address,144,"",2,801); 

  //   console.log("Usuario 5 con 910usd compra cuenta con ID 802, con sponsor al ID 144 (Usuario 5) el lado derecho")
  //   await account.connect(user5).createNFT("Jesica Account 4",user5.address,144,"",2,802); 




  //   // await getInformation()

  //   const Cuenta0 = await account.accountInfo(0)
  //   const Cuenta15 = await account.accountInfo(15)
  //   const Cuenta20 = await account.accountInfo(20)
  //   const Cuenta500 = await account.accountInfo(500)
  //   const Cuenta144 = await account.accountInfo(144)
  //   const Cuenta452 = await account.accountInfo(452)
  //   const Cuenta600 = await account.accountInfo(600)
  //   const Cuenta601 = await account.accountInfo(601)
  //   const Cuenta602 = await account.accountInfo(602)
  //   const Cuenta603 = await account.accountInfo(603)
  //   const Cuenta800 = await account.accountInfo(800)
  //   const Cuenta801 = await account.accountInfo(801)
  //   const Cuenta802 = await account.accountInfo(802)


  //   const adminWalletsRewardsInEther = parseFloat(await account.adminWalletsRewards()) / 1e18;
  //   const rewardsCuenta0 = parseFloat(await account.rewards(0)) / 1e18;
  //   const rewardsCuenta15 = parseFloat(await account.rewards(15)) / 1e18;
  //   const rewardsCuenta20 = parseFloat(await account.rewards(20)) / 1e18;
  //   const rewardsCuenta500 = parseFloat(await account.rewards(500)) / 1e18;
  //   const rewardsCuenta144 = parseFloat(await account.rewards(144)) / 1e18;
  //   const rewardsCuenta452 = parseFloat(await account.rewards(452)) / 1e18;
  //   const rewardsCuenta600 = parseFloat(await account.rewards(600)) / 1e18;
  //   const rewardsCuenta601 = parseFloat(await account.rewards(601)) / 1e18;
  //   const rewardsCuenta602 = parseFloat(await account.rewards(602)) / 1e18;
  //   const rewardsCuenta603 = parseFloat(await account.rewards(603)) / 1e18;
  //   const rewardsCuenta800 = parseFloat(await account.rewards(800)) / 1e18;
  //   const rewardsCuenta801 = parseFloat(await account.rewards(801)) / 1e18;
  //   const rewardsCuenta802 = parseFloat(await account.rewards(802)) / 1e18;

  //   console.log("ARBOL DE USUARIOS")
  //   console.log("Hijo izquierdo de Cuenta 0: ",Cuenta0.myLeft)
  //   console.log("Hijo derecho de Cuenta 0: ",Cuenta0.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 15: ",Cuenta15.myLeft)
  //   console.log("Hijo derecho de Cuenta 15: ",Cuenta15.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 20: ",Cuenta20.myLeft)
  //   console.log("Hijo derecho de Cuenta 20: ",Cuenta20.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 500: ",Cuenta500.myLeft)
  //   console.log("Hijo derecho de Cuenta 500: ",Cuenta500.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 144: ",Cuenta144.myLeft)
  //   console.log("Hijo derecho de Cuenta 144: ",Cuenta144.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 452: ",Cuenta452.myLeft)
  //   console.log("Hijo derecho de Cuenta 452: ",Cuenta452.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 600: ",Cuenta600.myLeft)
  //   console.log("Hijo derecho de Cuenta 600: ",Cuenta600.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 601: ",Cuenta601.myLeft)
  //   console.log("Hijo derecho de Cuenta 601: ",Cuenta601.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 602: ",Cuenta602.myLeft)
  //   console.log("Hijo derecho de Cuenta 602: ",Cuenta602.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 603: ",Cuenta603.myLeft)
  //   console.log("Hijo derecho de Cuenta 603: ",Cuenta603.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 800: ",Cuenta800.myLeft)
  //   console.log("Hijo derecho de Cuenta 800: ",Cuenta800.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 801: ",Cuenta801.myLeft)
  //   console.log("Hijo derecho de Cuenta 801: ",Cuenta801.myRight)
  //   console.log("///")
  //   console.log("Hijo izquierdo de Cuenta 802: ",Cuenta802.myLeft)
  //   console.log("Hijo derecho de Cuenta 802: ",Cuenta802.myRight)

  //   console.log("//////////////////////")
  //   console.log("GANANCIAS A RECLAMAR")
  //   console.log("Ganancia a reclamar del admin: ",adminWalletsRewardsInEther)," $"
    
  //   console.log("Ganancia a reclamar de la Cuenta 0: ",rewardsCuenta0)," $"
  //   console.log("Ganancia a reclamar del Cuenta 15: ",rewardsCuenta15)," $"
  //   console.log("Ganancia a reclamar del Cuenta 20: ",rewardsCuenta20)," $"
  //   console.log("Ganancia a reclamar del Cuenta 500: ",rewardsCuenta500)," $"
  //   console.log("Ganancia a reclamar del Cuenta 144: ",rewardsCuenta144)," $"
  //   console.log("Ganancia a reclamar del Cuenta 452: ",rewardsCuenta452)," $"
  //   console.log("Ganancia a reclamar del Cuenta 600: ",rewardsCuenta600)," $"
  //   console.log("Ganancia a reclamar del Cuenta 601: ",rewardsCuenta601)," $"
  //   console.log("Ganancia a reclamar del Cuenta 602: ",rewardsCuenta602)," $"
  //   console.log("Ganancia a reclamar del Cuenta 603: ",rewardsCuenta603)," $"
  //   console.log("Ganancia a reclamar del Cuenta 800: ",rewardsCuenta800)," $"
  //   console.log("Ganancia a reclamar del Cuenta 801: ",rewardsCuenta801)," $"
  //   console.log("Ganancia a reclamar del Cuenta 802: ",rewardsCuenta802)," $"

  //   console.log("//////////////////////")
  //   console.log("BALANCES")

  //   console.log("Balance Admin : ", parseFloat(await token.balanceOf(user10.address)) / 1e18)
  //   console.log("Balance Usuario 1: ", parseFloat(await token.balanceOf(user1.address)) / 1e18)
  //   console.log("Balance Usuario 2: ", parseFloat(await token.balanceOf(user2.address)) / 1e18)
  //   console.log("Balance Usuario 3: ", parseFloat(await token.balanceOf(user3.address)) / 1e18)
  //   console.log("Balance Usuario 4: ", parseFloat(await token.balanceOf(user4.address)) / 1e18)
  //   console.log("Balance Usuario 5: ", parseFloat(await token.balanceOf(user5.address)) / 1e18)
  //   console.log("Balance Usuario 6: ", parseFloat(await token.balanceOf(user6.address)) / 1e18)


  //   console.log("El admin reclama ganancias")
  //   await account.connect(user10).claimAdminWallet();
    
  //   console.log("Todas las cuentas reclman ganancias")
  //   await account.connect(user1).claimNftReward(0);
  //   await account.connect(user2).claimNftReward(15);
  //   await account.connect(user3).claimNftReward(20);
  //   await account.connect(user4).claimNftReward(500);
  //   await account.connect(user5).claimNftReward(144);
  //   await account.connect(user6).claimNftReward(452);
  //   await account.connect(user4).claimNftReward(600);
  //   await account.connect(user4).claimNftReward(601);
  //   await account.connect(user4).claimNftReward(602);
  //   await account.connect(user4).claimNftReward(603);
  //   await account.connect(user5).claimNftReward(800);
  //   await account.connect(user5).claimNftReward(801);
  //   await account.connect(user5).claimNftReward(802);

  //   console.log("Balance Admin : ", parseFloat(await token.balanceOf(user10.address)) / 1e18)
  //   console.log("Balance Usuario 1: ", parseFloat(await token.balanceOf(user1.address)) / 1e18)
  //   console.log("Balance Usuario 2: ", parseFloat(await token.balanceOf(user2.address)) / 1e18)
  //   console.log("Balance Usuario 3: ", parseFloat(await token.balanceOf(user3.address)) / 1e18)
  //   console.log("Balance Usuario 4: ", parseFloat(await token.balanceOf(user4.address)) / 1e18)
  //   console.log("Balance Usuario 5: ", parseFloat(await token.balanceOf(user5.address)) / 1e18)
  //   console.log("Balance Usuario 6: ", parseFloat(await token.balanceOf(user6.address)) / 1e18)



  //   console.log("CUENTAS TODO BIEN")

  //   console.log("Usuario 1 con 1010usd compra membresia Basic, refiriendo al ID 0 para iniciar el proyecto (Aca se reparte todo al admin ya que no hay sponsor)")
  //   await membershipContract3.connect(user1).buyMembership(3, 0, ""); 

  //   console.log("Usuario 2 con 1000usd con cuenta ID15 compra membresia Basic, con sponsor al ID 0 (Usuario 1)")
  //   await membershipContract3.connect(user2).buyMembership(3, 15, ""); 

  //   console.log("Usuario 3 con 970usd con cuenta ID20 compra membresia Basic, con sponsor al ID 0 (Usuario 1)")
  //   await membershipContract3.connect(user3).buyMembership(3, 20, ""); 

  //   console.log("Usuario 5 con 880usd con cuenta ID144 compra membresia Basic, con sponsor al ID 15 (Usuario 2)")
  //   await membershipContract3.connect(user5).buyMembership(3, 144, ""); 

  //   console.log("Usuario 5 con 880usd con cuenta ID800 compra membresia Basic, con sponsor al ID 144 (Usuario 5)")
  //   await membershipContract3.connect(user5).buyMembership(3, 800, ""); 

  //   console.log("Usuario 6 con 970usd con cuenta ID452 compra membresia Basic, con sponsor al ID 15 (Usuario 2)")
  //   await membershipContract3.connect(user6).buyMembership(3, 452, ""); 

  //   console.log("Usuario 4 con 955usd con cuenta ID500 compra membresia Basic, con sponsor al ID 0 (Usuario 1)")
  //   await membershipContract3.connect(user4).buyMembership(3, 500, ""); 

  //   console.log("Usuario 4 con 955usd con cuenta ID601 compra membresia Basic, con sponsor al ID 500 (Usuario 4)")
  //   await membershipContract3.connect(user4).buyMembership(3, 601, ""); 

  //   console.log("Usuario 1 con 975usd con cuenta ID0 compra membresia Basic, con sponsor al ID 0 (Usuario 1)")
  //   await membershipContract3.connect(user1).buyMembership(3, 0, ""); 

  //   console.log("//////////////////////")
  //   console.log("BALANCES")

  //   console.log("Balance Admin : ", parseFloat(await token.balanceOf(user10.address)) / 1e18)
  //   console.log("Balance Usuario 1: ", parseFloat(await token.balanceOf(user1.address)) / 1e18)
  //   console.log("Balance Usuario 2: ", parseFloat(await token.balanceOf(user2.address)) / 1e18)
  //   console.log("Balance Usuario 3: ", parseFloat(await token.balanceOf(user3.address)) / 1e18)
  //   console.log("Balance Usuario 4: ", parseFloat(await token.balanceOf(user4.address)) / 1e18)
  //   console.log("Balance Usuario 5: ", parseFloat(await token.balanceOf(user5.address)) / 1e18)
  //   console.log("Balance Usuario 6: ", parseFloat(await token.balanceOf(user6.address)) / 1e18)

  //   console.log("//////////////////////")
  //   console.log("RECLAMOS")
  //   console.log("El admin reclama ganancias")
  //   await membershipContract3.connect(user10).claimRewardPartnerShip();
    
  //   console.log("Todas las cuentas reclman ganancias")
  //   await membershipContract3.connect(user1).claimMembershipReward(0);
  //   await membershipContract3.connect(user2).claimMembershipReward(15);
  //   await membershipContract3.connect(user3).claimMembershipReward(20);
  //   await membershipContract3.connect(user4).claimMembershipReward(500);
  //   await membershipContract3.connect(user5).claimMembershipReward(144);
  //   await membershipContract3.connect(user6).claimMembershipReward(452);
  //   await membershipContract3.connect(user4).claimMembershipReward(600);
  //   await membershipContract3.connect(user4).claimMembershipReward(601);
  //   await membershipContract3.connect(user4).claimMembershipReward(602);
  //   await membershipContract3.connect(user4).claimMembershipReward(603);
  //   await membershipContract3.connect(user5).claimMembershipReward(800);
  //   await membershipContract3.connect(user5).claimMembershipReward(801);
  //   await membershipContract3.connect(user5).claimMembershipReward(802);

  //   console.log("//////////////////////")
  //   console.log("BALANCES")

  //   console.log("Balance Admin : ", parseFloat(await token.balanceOf(user10.address)) / 1e18)
  //   console.log("Balance Usuario 1: ", parseFloat(await token.balanceOf(user1.address)) / 1e18)
  //   console.log("Balance Usuario 2: ", parseFloat(await token.balanceOf(user2.address)) / 1e18)
  //   console.log("Balance Usuario 3: ", parseFloat(await token.balanceOf(user3.address)) / 1e18)
  //   console.log("Balance Usuario 4: ", parseFloat(await token.balanceOf(user4.address)) / 1e18)
  //   console.log("Balance Usuario 5: ", parseFloat(await token.balanceOf(user5.address)) / 1e18)
  //   console.log("Balance Usuario 6: ", parseFloat(await token.balanceOf(user6.address)) / 1e18)


  //   console.log("Primera membresia de Cuenta 0 ", await membershipContract3.getInfoOfMembership(0,0))
  //   console.log("Segunda membresia de Cuenta 0 ", await membershipContract3.getInfoOfMembership(0,1))
  //   console.log("Primera membresia de Cuenta 15 ", await membershipContract3.getInfoOfMembership(15,0))
  //   console.log("Primera membresia de Cuenta 20 ", await membershipContract3.getInfoOfMembership(20,0))
  //   console.log("Primera membresia de Cuenta 800 ", await membershipContract3.getInfoOfMembership(800,0))
  //   console.log("Primera membresia de Cuenta 452 ", await membershipContract3.getInfoOfMembership(452,0))
  //   console.log("Primera membresia de Cuenta 601 ", await membershipContract3.getInfoOfMembership(601,0))



  // });
  
  
  
  
  it('PRUEBA GENERAL', async function () {
    //Funcion para inicializar
    async function initializeUsers(users, token, poiAddress, membersAddress,stakingAddress) {
      for (const user of users) {
        console.log("DIRECCION")
        console.log(await membersAddress)
        await token.connect(user).approve(poiAddress, ethers.parseEther("10000000000"));
        await token.connect(user).approve(account, ethers.parseEther("10000000000"));
        await token.connect(user).approve(membershipContract3, ethers.parseEther("10000000000"));
        await token.connect(user).approve(membershipContract3, ethers.parseEther("10000000000"));
        await token.connect(user).approve(stakingContract, ethers.parseEther("10000000000"));
        await token.transfer(user.address, ethers.parseEther("1000")); 
      }
    }

    async function getInformation() {
      const adminWalletsRewardsInEther = parseFloat(await account.adminWalletsRewards()) / 1e18;
      const rewards0 = parseFloat(await account.rewards(0)) / 1e18;
      const rewards1 = parseFloat(await account.rewards(1)) / 1e18;
      const rewards2 = parseFloat(await account.rewards(2)) / 1e18;
      const rewards3 = parseFloat(await account.rewards(3)) / 1e18;



      console.log("Ganancia a reclamar del admin: ",adminWalletsRewardsInEther)," $"
      
      console.log("Ganancia a reclamar del usuario0: ",rewards0)," $"
      console.log("Ganancia a reclamar del usuario1: ",rewards1)," $"
      console.log("Ganancia a reclamar del usuario2: ",rewards2)," $"
      console.log("Ganancia a reclamar del usuario3: ",rewards3)," $"
      console.log("///////////////")
    }


    //Seteo de direccion de contrato
    const tokenAddress = token.getAddress()
    const poiAddress = poi.getAddress()
    const accountAddress = account.getAddress()
    const membersAddress = membershipContract3.getAddress()
    const stakingAddress = stakingContract.getAddress()
    const treasuryAddress = treasuryContract.getAddress()


    //Inicializacion
    console.log("Se inicializan los contratos poniendo e POI 30usd como valor y poniendo a user9 en members como defily wallet (Para el sobrante) y en claim lo mismo (Por si la membresia tiene fee)")
    await poi.initialize(accountAddress,membersAddress);
    await account.initialize(tokenAddress,poiAddress,membersAddress,stakingAddress,ethers.parseEther('30'));
    await membershipContract3.initialize(tokenAddress,poiAddress,stakingAddress,accountAddress);
    await stakingContract.initialize(tokenAddress,treasuryAddress,membersAddress,accountAddress,poiAddress);
    
    await account.setAdminWallet(user10.address);
    await membershipContract3.setPartnerShip(user10.address);

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
    const users = [user1,user2, user3, user4, user5, user6, user7, user8];
   
    await initializeUsers(users, token,accountAddress, poiAddress, membersAddress,stakingAddress);

    console.log("Se registra User1 en el Poi")
    await poi.connect(user1).newUser("Defily@gmail.com","Defily AI","Defily123","123");
    await poi.connect(user2).newUser("joacolinares2003@gmail.com","Joaquin Linares","Joaco123","1234");
    await poi.connect(user3).newUser("Irving@gmail.com","Irving Lopez","Irving123","12345");
    await poi.connect(user4).newUser("Leadys@gmail.com","Leadys Perez","Leadys123","123456");
    await poi.connect(user5).newUser("Jesica@gmail.com","Jesica test","Jesi123","1234567");
    await poi.connect(user6).newUser("Antonio@gmail.com","Antonio test","Antonio123","12345678");
    await poi.connect(user7).newUser("Antonio@gmail2.com","Antonioad test","Antonio1235","123456738");
    await poi.connect(user8).newUser("Antonio@gmail28.com","Antonio3ad t3est","Antonio12358","1234567388");
    console.log("User1 compra membresia 1 refiriendo a si mismo")
    console.log("Compra")
    

    console.log("Usuario 1 con 1000usd compra cuenta, refiriendo al ID 0 para iniciar el proyecto (Aca se reparte todo al admin ya que no hay sponsor)")
    await account.connect(user1).createNFT("Master Account",user1.address,0,"",1,0);  

    console.log("Usuario 2 con 1000usd compra cuenta con ID 15, con sponsor al ID 0 (Usuario 1) el lado izquierdo")
    await account.connect(user2).createNFT("Joaquin Account",user2.address,0,"",1,15); 
    
    console.log("Usuario 3 con 1000usd compra cuenta con ID 20, con sponsor al ID 0 (Usuario 1) el lado derecho")
    await account.connect(user3).createNFT("Irving Account1",user3.address,0,"",2,20); 
 
    console.log("Usuario 4 con 1000usd compra cuenta con ID 30, con sponsor al ID 15 (Usuario 2) el lado derecho")
    await account.connect(user4).createNFT("Irving Account2",user4.address,15,"",2,30); 
   
    console.log("Usuario 5 con 1000usd compra cuenta con ID 40, con sponsor al ID 30 (Usuario 4) el lado derecho")
    await account.connect(user5).createNFT("Irving Account3",user5.address,30,"",2,40); 
    
    console.log("Usuario 6 con 1000usd compra cuenta con ID 50, con sponsor al ID 30 (Usuario 5) el lado izquierdo")
    await account.connect(user6).createNFT("Irving Account4",user6.address,40,"",1,50); 

    console.log("Usuario 7 con 1000usd compra cuenta con ID 60, con sponsor al ID 15 (Usuario 2) el lado derecho")
    await account.connect(user7).createNFT("Irving Account5",user7.address,15,"",2,60); 

    console.log("Usuario 8 con 1000usd compra cuenta con ID 70, con sponsor al ID 0 (Usuario 2) el lado derecho")
    await account.connect(user8).createNFT("Irving Account53",user8.address,0,"",2,70); 

    const Cuenta0 = await account.accountInfo(0)
    const Cuenta15 = await account.accountInfo(15)
    const Cuenta20 = await account.accountInfo(20)
    const Cuenta30 = await account.accountInfo(30)
    const Cuenta40 = await account.accountInfo(40)
    const Cuenta50 = await account.accountInfo(50)
    const Cuenta60 = await account.accountInfo(60)


    const rewardsCuenta0 = parseFloat(await account.rewards(0)) / 1e18;
    const rewardsCuenta15 = parseFloat(await account.rewards(15)) / 1e18;
    const rewardsCuenta20 = parseFloat(await account.rewards(20)) / 1e18;
    const rewardsCuenta30 = parseFloat(await account.rewards(30)) / 1e18;
    const rewardsCuenta40 = parseFloat(await account.rewards(40)) / 1e18;
    const rewardsCuenta50 = parseFloat(await account.rewards(50)) / 1e18;
    const rewardsCuenta60 = parseFloat(await account.rewards(60)) / 1e18;

    console.log("ARBOL DE USUARIOS")
    console.log("Hijo izquierdo de Cuenta 0: ",Cuenta0.myLeft)
    console.log("Hijo derecho de Cuenta 0: ",Cuenta0.myRight)
    console.log("///")
    console.log("Hijo izquierdo de Cuenta 15: ",Cuenta15.myLeft)
    console.log("Hijo derecho de Cuenta 15: ",Cuenta15.myRight)
    console.log("///")
    console.log("Hijo izquierdo de Cuenta 20: ",Cuenta20.myLeft)
    console.log("Hijo derecho de Cuenta 20: ",Cuenta20.myRight)
    console.log("///")
    console.log("Hijo izquierdo de Cuenta 30: ",Cuenta30.myLeft)
    console.log("Hijo derecho de Cuenta 30: ",Cuenta30.myRight)
    console.log("///")
    console.log("Hijo izquierdo de Cuenta 40: ",Cuenta40.myLeft)
    console.log("Hijo derecho de Cuenta 40: ",Cuenta40.myRight)
    console.log("///")
    console.log("Hijo izquierdo de Cuenta 50: ",Cuenta50.myLeft)
    console.log("Hijo derecho de Cuenta 50: ",Cuenta50.myRight)
    console.log("///")
    console.log("Hijo izquierdo de Cuenta 60: ",Cuenta60.myLeft)
    console.log("Hijo derecho de Cuenta 60: ",Cuenta60.myRight)
    console.log("///")

    console.log(rewardsCuenta0)
    console.log(rewardsCuenta15)
    console.log(rewardsCuenta20)
    console.log(rewardsCuenta30)
    console.log(rewardsCuenta40)
    console.log(rewardsCuenta50)
    console.log(rewardsCuenta60)

    console.log("Cantidad de directos")
    console.log(Cuenta0.directAmount)
    console.log(Cuenta15.directAmount)
    console.log(Cuenta20.directAmount)
    console.log(Cuenta30.directAmount)
    console.log(Cuenta40.directAmount)
    console.log(Cuenta50.directAmount)
    console.log(Cuenta60.directAmount)

    await membershipContract3.connect(user2).buyMembership(3, 15, ""); 
    await membershipContract3.connect(user3).buyMembership(3, 20, ""); 
    await membershipContract3.connect(user4).buyMembership(3, 30, ""); 
    await membershipContract3.connect(user5).buyMembership(3, 40, ""); 
    await membershipContract3.connect(user6).buyMembership(3, 50, ""); 
    await membershipContract3.connect(user7).buyMembership(3, 60, ""); 
    await membershipContract3.connect(user8).buyMembership(1, 70, ""); 


    const Cuentav20 = await account.accountInfo(0)
    const Cuentav215 = await account.accountInfo(15)
    const Cuentav220 = await account.accountInfo(20)
    const Cuentav230 = await account.accountInfo(30)
    const Cuentav240 = await account.accountInfo(40)
    const Cuentav250 = await account.accountInfo(50)
    const Cuentav260 = await account.accountInfo(60)

    console.log("Cantidad de invertido por directos")
    console.log(Cuentav20.totalDirect)
    console.log(Cuentav215.totalDirect)
    console.log(Cuentav220.totalDirect)
    console.log(Cuentav230.totalDirect)
    console.log(Cuentav240.totalDirect)
    console.log(Cuentav250.totalDirect)
    console.log(Cuentav260.totalDirect)


   console.log("Invertido por lado derecho del ID 0")
   console.log(await membershipContract3.membershipOfUsers(Cuentav20.myLeft,0)) //ID20
   
   console.log("Invertido por lado izquierdo del ID 0")
   console.log(await membershipContract3.membershipOfUsers(Cuentav20.myLeft,0)) //ID20
   console.log(await membershipContract3.membershipOfUsers(Cuentav215.myRight,0)) //ID 30
   console.log(await membershipContract3.membershipOfUsers(Cuentav230.myRight,0)) //ID 40
   console.log(await membershipContract3.membershipOfUsers(Cuentav240.myLeft,0))  //ID 50
   console.log(await membershipContract3.membershipOfUsers(Cuentav240.myRight,0)) //ID 60


   console.log("Balance user2 : ", parseFloat(await token.balanceOf(user2.address)) / 1e18)
   await stakingContract.connect(user2).stake(ethers.parseEther("300"), 15, 0); 
   console.log("Balance user2 : ", parseFloat(await token.balanceOf(user2.address)) / 1e18)


   console.log("Balance user8 : ", parseFloat(await token.balanceOf(user8.address)) / 1e18)
   console.log("Tresuty : ", parseFloat(await token.balanceOf(treasuryAddress)) / 1e18)
   await stakingContract.connect(user8).stake(ethers.parseEther("600"), 70, 0); 
   console.log("Balance user8 : ", parseFloat(await token.balanceOf(user8.address)) / 1e18)
   console.log("Tresuty : ", parseFloat(await token.balanceOf(treasuryAddress)) / 1e18)
   
  const total =  await stakingContract.partnerShipRewards(); 

    console.log(total)


  });




});