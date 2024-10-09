const { ethers, upgrades } = require("hardhat");

const wait = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const FEE_DATA = {
    maxFeePerGas:         ethers.parseUnits('150', 'gwei'),
    maxPriorityFeePerGas: ethers.parseUnits('150',   'gwei'),
};

//DEPLOY BOOSTER
async function deploy() {

    const providerUrls = [
        "https://polygon-rpc.com/", // Asegúrate de usar un URL confiable para Polygon
    ];
    const providers = providerUrls.map(url => new ethers.JsonRpcProvider(url));
    const provider = new ethers.FallbackProvider(providers, 137);
    provider.getFeeData = async () => FEE_DATA;

    const privateKey = ""; // Reemplaza con tu clave privada
    const signer = new ethers.Wallet(privateKey, provider);

    const waitForConfirmations = async (tx) => {
        console.log(`Esperando 12 confirmaciones para la transacción ${tx.hash}...`);
        await tx.wait(12);
        console.log(`Transacción ${tx.hash} confirmada!`);
    };


    //DEPLOY CONTRATOS
    //const walletRegistro1 = "0x43f2081f21e83d34b08c33b9018a4D4C17E142e3" //Defily NFT 50%
    

    const sobranteMembresias1 = "0x1C88962c8c20563476E22A5FF3d48C800e4E5394" //boosterBlock membership 50%
    console.log("INICIANDO DESPLIEGUES...")

    const POI = await ethers.getContractFactory("POI", signer);
    const Account = await ethers.getContractFactory("NFTAccount", signer);
    const MembershipContract = await ethers.getContractFactory("MembershipContract", signer);
    const Staking = await ethers.getContractFactory("Staking", signer);
    const Treasury = await ethers.getContractFactory("Treasury", signer);

    console.log("CONTRATOS CREADOS")

    var poiContract = await upgrades.deployProxy(
        POI,
        ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'], //DEBEMOS AGREGAR POI, MEMBERS, STAKING
        { kind: "uups", gasLimit: 100000000000, gasPrice: ethers.parseUnits('100', 'gwei') },
    );
    

    var accountContract = await upgrades.deployProxy(
        Account,
        ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', "30000000000000000000"], //DEBEMOS AGREGAR POI, MEMBERS, STAKING
        { kind: "uups", gasLimit: 100000000000, gasPrice: ethers.parseUnits('100', 'gwei') },
    );
    //await waitForConfirmations(accountContract);
    console.log("Deploy ACCOUNT");
    await accountContract.waitForDeployment();


    var membersContract = await upgrades.deployProxy(
        MembershipContract,
        ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'], //DEBEMOS AGREGAR USDT, POI, ACCOUNT, STAKING Y ACCOUNT
        { kind: "uups" },
    );
    //await waitForConfirmations(membersContract);
    console.log("Deploy MEMBER");
    await membersContract.waitForDeployment();


    var stakingContract = await upgrades.deployProxy(
        Staking,
        ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'], //DEBEMOS AGREGAR USDT, TRESURY, MEMBERS, ACCOUNT Y POI
        { kind: "uups" },
    );
    //await waitForConfirmations(stakingContract);
    console.log("Deploy STAKING")
    await stakingContract.waitForDeployment();


    var treasuryContract = await upgrades.deployProxy(
        Treasury,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED'], //DEBEMOS AGREGAR USDT, TRESURY, MEMBERS, ACCOUNT Y POI
        { kind: "uups"},
    );

    //await waitForConfirmations(treasuryContract);
    console.log("Deploy TRESURY")
    await treasuryContract.waitForDeployment();

    



    var poiContImpl = await upgrades.erc1967.getImplementationAddress(
        await poiContract.getAddress()
    );
    console.log(`Address del Proxy POI es: ${await poiContract.getAddress()}`);
    console.log(`Address de Impl del POI es: ${poiContImpl}`);

    var accountContImpl = await upgrades.erc1967.getImplementationAddress(
        await accountContract.getAddress()
    );
    console.log(`Address del Proxy ACCOUNT es: ${await accountContract.getAddress()}`);
    console.log(`Address de Impl del ACCOUNT es: ${accountContImpl}`);

    var membersContImpl = await upgrades.erc1967.getImplementationAddress(
        await membersContract.getAddress()
    );
    console.log(`Address del Proxy MEMBERS es: ${await membersContract.getAddress()}`);
    console.log(`Address de Impl del MEMBERS es: ${membersContImpl}`);

    var stakingContImpl = await upgrades.erc1967.getImplementationAddress(
        await stakingContract.getAddress()
    );
    console.log(`Address del Proxy STAKING es: ${await stakingContract.getAddress()}`);
    console.log(`Address de Impl del STAKING es: ${stakingContImpl}`);
    
    var treasuryContImpl = await upgrades.erc1967.getImplementationAddress(
        await treasuryContract.getAddress()
    );
    console.log(`Address del Proxy TREASURY es: ${await treasuryContract.getAddress()}`);
    console.log(`Address de Impl del TREASURY es: ${treasuryContImpl}`);
    

    //VERIFICA LOS CONTRATOS
    await hre.run("verify:verify", {
        address: poiContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: accountContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: membersContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: stakingContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: treasuryContImpl,
        constructorArguments: [],
    });
   



    const poiAddress = await poiContract.getAddress()
    const accountAddress = await accountContract.getAddress()
    const membersAddress = await membersContract.getAddress()
    const stakingAddress = await stakingContract.getAddress()
    const treasuryAddress = await treasuryContract.getAddress()


    var tx
   
    //Se crean las membresias 
    tx = await membersContract.createMembership('', 0, 0, 0, 0,0,0,true,0,100);
    await waitForConfirmations(tx);
    
    tx  =await membersContract.createMembership('Pay as you go', 0, 0, 99999, 31536000,ethers.parseEther("500"),ethers.parseEther("9999"),true,100,60);
    await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Pay as you go +', 0, 0, 99999, 31536000, ethers.parseEther("10000"), ethers.parseEther("100000000"), true, 50, 50);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Basic', ethers.parseEther("100"), 0, 99999, 31536000, ethers.parseEther("200"), ethers.parseEther("1000"), false, 0, 60);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Essential', ethers.parseEther("250"), 0, 99999, 31536000, ethers.parseEther("200"), ethers.parseEther("2500"), false, 0, 60);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Premium', ethers.parseEther("500"), 0, 99999, 31536000, ethers.parseEther("200"), ethers.parseEther("5000"), false, 0, 60);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Professional', ethers.parseEther("1000"), 0, 99999, 31536000, ethers.parseEther("200"), ethers.parseEther("15000"), false, 0, 50);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Ultimate', ethers.parseEther("5000"), 0, 99999, 31536000, ethers.parseEther("200"), ethers.parseEther("100000"), false, 0, 40);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Max', ethers.parseEther("10000"), 0, 99999, 31536000, ethers.parseEther("200"), ethers.parseEther("1000000"), false, 0, 30);
   await waitForConfirmations(tx);

   // Setea partner de membership
   tx = await membersContract.setPartnerShip(sobranteMembresias1);
   await waitForConfirmations(tx);

   // Setea admin de Account
   tx = await accountContract.setAdminWallet(sobranteMembresias1);
   await waitForConfirmations(tx);

   // POI
   tx = await poiContract.setAccountContract(accountAddress);
   await waitForConfirmations(tx);

   tx = await poiContract.setMemberContract(membersAddress);
   await waitForConfirmations(tx);

   // ACCOUNT
   tx = await accountContract.setUsdtConract("0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED");
   await waitForConfirmations(tx);

   tx = await accountContract.setPoiContract(poiAddress);
   await waitForConfirmations(tx);

   tx = await accountContract.setMemberContract(membersAddress);
   await waitForConfirmations(tx);

   tx = await accountContract.setMembershipContractAddress(membersAddress);
   await waitForConfirmations(tx);

   tx = await accountContract.setStakingAddress(stakingAddress);
   await waitForConfirmations(tx);

   // MEMBERS
   tx = await membersContract.setUsdtConract("0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED");
   await waitForConfirmations(tx);

   tx = await membersContract.setPoiContract(poiAddress);
   await waitForConfirmations(tx);

   tx = await membersContract.setAccountContract(accountAddress);
   await waitForConfirmations(tx);

   tx = await membersContract.setAccountAddress(accountAddress);
   await waitForConfirmations(tx);

   tx = await membersContract.setStakeingAddress(stakingAddress);
   await waitForConfirmations(tx);

   // STAKING
   tx = await stakingContract.setUsdtContract("0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED");
   await waitForConfirmations(tx);

   tx = await stakingContract.setMembershipContract(membersAddress);
   await waitForConfirmations(tx);

   tx = await stakingContract.setAccountContract(accountAddress);
   await waitForConfirmations(tx);

   tx = await stakingContract.setPoiContract(poiAddress);
   await waitForConfirmations(tx);
   
   tx = await stakingContract.setTreasuryContract(treasuryAddress);
   await waitForConfirmations(tx);



   console.log("Todo bien!");


}




async function test() {
    console.log(ethers.keccak256(ethers.toUtf8Bytes("OPERATOR_ROLE")))
}

async function upgrade() {
    var proxyAddress = '0x70D99026f67B16F534DE2C6052713171ED2D42A1'; //CONTRATO DEL QUE QUEREMOS HACER UPGRADE
    var Contract2 = await hre.ethers.getContractFactory("Staking");  //NOMBRE DEL CONTRATO
    await upgrades.upgradeProxy(proxyAddress, Contract2, {
        gasLimit: 10000000, 
        gasPrice: ethers.parseUnits('70', 'gwei') 
    });

    await wait(30000);

    var implV2 = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log('Address implV2: ', implV2);

    await wait(30000);

    await hre.run("verify:verify", {
        address: implV2,
        constructorArguments: [],
    });
}



          
async function deployTreasury() {
    var TreasuryContract = await hre.ethers.getContractFactory("TreasuryV2");
    var treasuryContract = await upgrades.deployProxy(
        TreasuryContract,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED'],
        { kind: "uups", gasLimit: 10000000, gasPrice: ethers.parseUnits('5', 'gwei') },
    );
    var tx = await treasuryContract.waitForDeployment();
    await tx.deploymentTransaction().wait(5);

    var treContImpl = await upgrades.erc1967.getImplementationAddress(
        await treasuryContract.getAddress()
    );
    console.log(`Address del Proxy es: ${await treasuryContract.getAddress()}`);
    console.log(`Address de Impl es: ${treContImpl}`);

    await hre.run("verify:verify", {
        address: treContImpl,
        constructorArguments: [],
    });
}



async function deployBooster() {


    const providerUrls = [
        "https://polygon-rpc.com/", // Asegúrate de usar un URL confiable para Polygon
    ];
    const providers = providerUrls.map(url => new ethers.JsonRpcProvider(url));
    const provider = new ethers.FallbackProvider(providers, 137);
    provider.getFeeData = async () => FEE_DATA;

    const privateKey = "b43b503baad0f5e1afb0c2f3b82385822f09ab5ecf42551fe5986092865b23df"; // Reemplaza con tu clave privada
    const signer = new ethers.Wallet(privateKey, provider);

    const waitForConfirmations = async (tx) => {
        console.log(`Esperando 12 confirmaciones para la transacción ${tx.hash}...`);
        await tx.wait(12);
        console.log(`Transacción ${tx.hash} confirmada!`);
    };

    console.log("gets factory")
    const POI = await ethers.getContractFactory("POI", signer);
    const Account = await ethers.getContractFactory("NFTAccount", signer);
    const MembershipContract = await ethers.getContractFactory("MembershipContract", signer);
    const Staking = await ethers.getContractFactory("Staking", signer);
    const Treasury = await ethers.getContractFactory("Treasury", signer);

    console.log("LISTO SIGUE")
    console.log("aca")

    var poiContract = await upgrades.deployProxy(
        POI,
        ['0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'], //DEBEMOS AGREGAR POI, MEMBERS, STAKING
        { kind: "uups"
         },
        
    );
    console.log("Deploy POI");
    await poiContract.waitForDeployment();
    var accountContract = await upgrades.deployProxy(
        Account,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', "30000000"], //DEBEMOS AGREGAR POI, MEMBERS, STAKING
        { kind: "uups"
         },
        
    );
    console.log("Deploy ACCOUNT");
    await accountContract.waitForDeployment();


    var membersContract = await upgrades.deployProxy(
        MembershipContract,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'], //DEBEMOS AGREGAR USDT, POI, ACCOUNT, STAKING Y ACCOUNT
        { kind: "uups" },
    );
    //await waitForConfirmations(membersContract);
    console.log("Deploy MEMBER");
    await membersContract.waitForDeployment();


    var stakingContract = await upgrades.deployProxy(
        Staking,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000'], //DEBEMOS AGREGAR USDT, TRESURY, MEMBERS, ACCOUNT Y POI
        { kind: "uups" },
    );
    //await waitForConfirmations(stakingContract);
    console.log("Deploy STAKING")
    await stakingContract.waitForDeployment();


    var treasuryContract = await upgrades.deployProxy(
        Treasury,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED'], //DEBEMOS AGREGAR USDT, TRESURY, MEMBERS, ACCOUNT Y POI
        { kind: "uups"},
    );

    //await waitForConfirmations(treasuryContract);
    console.log("Deploy TRESURY")
    await treasuryContract.waitForDeployment();

    var poiContImpl = await upgrades.erc1967.getImplementationAddress(
        await poiContract.getAddress()
    );
    console.log(`Address del Proxy POI es: ${await poiContract.getAddress()}`);
    console.log(`Address de Impl del POI es: ${poiContImpl}`);

    var accountContImpl = await upgrades.erc1967.getImplementationAddress(
        await accountContract.getAddress()
    );
    console.log(`Address del Proxy ACCOUNT es: ${await accountContract.getAddress()}`);
    console.log(`Address de Impl del ACCOUNT es: ${accountContImpl}`);

    var membersContImpl = await upgrades.erc1967.getImplementationAddress(
        await membersContract.getAddress()
    );
    console.log(`Address del Proxy MEMBERS es: ${await membersContract.getAddress()}`);
    console.log(`Address de Impl del MEMBERS es: ${membersContImpl}`);

    var stakingContImpl = await upgrades.erc1967.getImplementationAddress(
        await stakingContract.getAddress()
    );
    console.log(`Address del Proxy STAKING es: ${await stakingContract.getAddress()}`);
    console.log(`Address de Impl del STAKING es: ${stakingContImpl}`);
    
    var treasuryContImpl = await upgrades.erc1967.getImplementationAddress(
        await treasuryContract.getAddress()
    );
    console.log(`Address del Proxy TREASURY es: ${await treasuryContract.getAddress()}`);
    console.log(`Address de Impl del TREASURY es: ${treasuryContImpl}`);
    


    await hre.run("verify:verify", {
        address: poiContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: accountContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: membersContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: stakingContImpl,
        constructorArguments: [],
    });
    await hre.run("verify:verify", {
        address: treasuryContImpl,
        constructorArguments: [],
    });
   



    const poiAddress = await poiContract.getAddress()
    const accountAddress = await accountContract.getAddress()
    const membersAddress = await membersContract.getAddress()
    const stakingAddress = await stakingContract.getAddress()
    const treasuryAddress = await treasuryContract.getAddress()


    var tx
   
    //Se crean las membresias 
    tx = await membersContract.createMembership('', 0, 0, 0, 0,0,0,true,0,100);
    await waitForConfirmations(tx);
    
    tx  = await membersContract.createMembership('Pay as you go', 0, 0, 99999, 31536000,ethers.parseUnits("500", 6),ethers.parseUnits("9999", 6),true,100,60);
    await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Pay as you go +', 0, 0, 99999, 31536000, ethers.parseUnits("10000", 6), ethers.parseUnits("100000000", 6), true, 50, 50);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Basic', ethers.parseUnits("100", 6), 0, 99999, 31536000, ethers.parseUnits("100", 6), ethers.parseUnits("1000", 6), false, 0, 60);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Essential', ethers.parseUnits("250", 6), 0, 99999, 31536000, ethers.parseUnits("100", 6), ethers.parseUnits("2500", 6), false, 0, 60);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Premium', ethers.parseUnits("500", 6), 0, 99999, 31536000, ethers.parseUnits("100", 6), ethers.parseUnits("5000", 6), false, 0, 60);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Professional', ethers.parseUnits("1000", 6), 0, 99999, 31536000, ethers.parseUnits("100", 6), ethers.parseUnits("15000", 6), false, 0, 50);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Ultimate', ethers.parseUnits("5000", 6), 0, 99999, 31536000, ethers.parseUnits("100", 6), ethers.parseUnits("100000", 6), false, 0, 40);
   await waitForConfirmations(tx);

   tx = await membersContract.createMembership('Max', ethers.parseUnits("10000", 6), 0, 99999, 31536000, ethers.parseUnits("100", 6), ethers.parseUnits("1000000", 6), false, 0, 30);
   await waitForConfirmations(tx);

   // Setea partner de membership
   tx = await membersContract.setPartnerShip("0x1C88962c8c20563476E22A5FF3d48C800e4E5394");
   await waitForConfirmations(tx);

   // Setea admin de Account
   tx = await accountContract.setAdminWallet("0x1C88962c8c20563476E22A5FF3d48C800e4E5394");
   await waitForConfirmations(tx);

   // POI
   tx = await poiContract.updateAccountContract(accountAddress);
   await waitForConfirmations(tx);

   tx = await poiContract.updateMemberContract(membersAddress);
   await waitForConfirmations(tx);

   // ACCOUNT

   tx = await accountContract.setPoiContract(poiAddress);
   await waitForConfirmations(tx);

   tx = await accountContract.setMemberContract(membersAddress);
   await waitForConfirmations(tx);

   tx = await accountContract.setMembershipContractAddress(membersAddress);
   await waitForConfirmations(tx);

   tx = await accountContract.setStakingAddress(stakingAddress);
   await waitForConfirmations(tx);

   // MEMBERS

   tx = await membersContract.setPoiContract(poiAddress);
   await waitForConfirmations(tx);

   tx = await membersContract.setAccountContract(accountAddress);
   await waitForConfirmations(tx);

   tx = await membersContract.setAccountAddress(accountAddress);
   await waitForConfirmations(tx);

   tx = await membersContract.setStakeingAddress(stakingAddress);
   await waitForConfirmations(tx);

   // STAKING

   tx = await stakingContract.setMembershipContract(membersAddress);
   await waitForConfirmations(tx);

   tx = await stakingContract.setAccountContract(accountAddress);
   await waitForConfirmations(tx);

   tx = await stakingContract.setPoiContract(poiAddress);
   await waitForConfirmations(tx);
   
   tx = await stakingContract.setTreasuryContract(treasuryAddress);
   await waitForConfirmations(tx);



   console.log("Todo bien!");

}



async function deployTreasury() {



    var TreasuryContract = await ethers.getContractFactory("NFTAccount", signer);
    var treasuryContract = await upgrades.deployProxy(
        Account,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', '0x0000000000000000000000000000000000000000', "30000000000000000000"], //DEBEMOS AGREGAR POI, MEMBERS, STAKING
        { kind: "uups"
         },
        
    );
    var tx = await treasuryContract.waitForDeployment();
    await tx.deploymentTransaction().wait(5);

    var treContImpl = await upgrades.erc1967.getImplementationAddress(
        await treasuryContract.getAddress()
    );
    console.log(`Address del Proxy es: ${await treasuryContract.getAddress()}`);
    console.log(`Address de Impl es: ${treContImpl}`);

    await hre.run("verify:verify", {
        address: treContImpl,
        constructorArguments: [],
    });
}

async function deployAccount() {


    const providerUrls = [
        "https://polygon-rpc.com/", // Asegúrate de usar un URL confiable para Polygon
    ];
    const providers = providerUrls.map(url => new ethers.JsonRpcProvider(url));
    const provider = new ethers.FallbackProvider(providers, 137);
    provider.getFeeData = async () => FEE_DATA;

    const privateKey = "305d0e9615b9db2f0e4dc362999cdea6da52d2969db58ae9fd2894b28135c2a0"; // Reemplaza con tu clave privada
    const signer = new ethers.Wallet(privateKey, provider);

    const waitForConfirmations = async (tx) => {
        console.log(`Esperando 12 confirmaciones para la transacción ${tx.hash}...`);
        await tx.wait(12);
        console.log(`Transacción ${tx.hash} confirmada!`);
    };

    console.log("gets factory")
    const Account = await ethers.getContractFactory("NFTAccount", signer);


    console.log("LISTO SIGUE")
    console.log("aca")


    var treasuryContract = await upgrades.deployProxy(
        Account,
        ['0xA1Ae1b4accfe4b9c2DdB33a8FAAA209f19d3d9ED', '0x00b9eF93B607182b5B2EE2365a279c83314E2F69', '0x4d4e5a35b9688eB9202Fd6c624B9F1472D9fB932', '0x6020fB269a1C96E28cC950e2599e9ed3Bc3bffB6', "30000000000000000000"],
        { kind: "uups", gasLimit: 10000000, gasPrice: ethers.parseUnits('100', 'gwei') },
    );
    
    var tx = await treasuryContract.waitForDeployment();
    await tx.deploymentTransaction().wait(5);

    var treContImpl = await upgrades.erc1967.getImplementationAddress(
        await treasuryContract.getAddress()
    );
    console.log(`Address del Proxy es: ${await treasuryContract.getAddress()}`);
    console.log(`Address de Impl es: ${treContImpl}`);

    await hre.run("verify:verify", {
        address: treContImpl,
        constructorArguments: [],
    });


    //   tx = await poiContract.updateAccountContract(accountAddress);

  //  tx = await membersContract.setAccountContract(accountAddress);
 //   await waitForConfirmations(tx);
 
 //   tx = await membersContract.setAccountAddress(accountAddress);
  //  await waitForConfirmations(tx);

    //   tx = await stakingContract.setAccountContract(accountAddress);



}


async function upgrade() {
    var proxyAddress = '0xE80505de9fE40E5530357d02D357f33C981Aac93'; //CONTRATO DEL QUE QUEREMOS HACER UPGRADE
    var Contract2 = await hre.ethers.getContractFactory("NFTAccount");  //NOMBRE DEL CONTRATO
    await upgrades.upgradeProxy(proxyAddress, Contract2, {
        gasLimit: 10000000, 
        gasPrice: ethers.parseUnits('150', 'gwei') 
    });

    await wait(30000);

    var implV2 = await upgrades.erc1967.getImplementationAddress(proxyAddress);
    console.log('Address implV2: ', implV2);

    await wait(30000);

    await hre.run("verify:verify", {
        address: implV2,
        constructorArguments: [],
    });
}


deployBooster().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});