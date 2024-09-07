// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Poi.sol";


contract MembershipContractViejo is Initializable, AccessControlUpgradeable, UUPSUpgradeable, OwnableUpgradeable {
        IERC20 public USDT;
        POI public poiContract;
        NFTAccount public accountContract;
        address public stakingAddress;
        address public accountAddress;
        uint256 public totalPercentageAdmin;
        bytes32 constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
        address public rankAddress;

    struct Membership {
        string membershipTitle;      //Nombre de la membresia
        uint256 membershipAmount;    //Valor de la membresia
        uint256 actualMemberships;   //Cantidad actual de miembros 
        uint256 maxMemberships;      //Cantidad maxima de miembros
        uint256 actualDate;          //Fecha actual
        uint256 timelimitMembership; //Tiempo limite de venta
        uint256 expirationMembership;//Tiempo de la membresia
        uint256 minInv;
        uint256 maxInv;
        bool fee;
        uint256 amountFee;
        uint256 performanceFee;
    }

    struct InfoOfMembershipsBuy {
        uint256 memberId;      //Nombre de la membresia
        uint256 time;    //Valor de la membresia
        uint256 expire;  //Cuando expira
        uint256 staked;
    }

    //MEMBRESIAS
    Membership[] public memberships; //Array de membresias
    mapping(uint256 => InfoOfMembershipsBuy[]) public membershipOfUsers; //Se guarda el partner de cada persona para luego ir recorriendolo

    //PARTNERSHIPS
    mapping(uint256 => uint256) public leadershipSplitPartners; //Se guarda el partner de cada persona para luego ir recorriendolo

    //DATOS FRONT END
    mapping(uint256 => uint256) public bestMember;


    //BONUS Y RANGOS Y FEEs
    mapping(uint256 => uint256) public MembersMoney; //Numero de rango

    //DESCUENTO
    struct PromoCode {
        uint256 discount; // Porcentaje de descuento (0-100)
        bool isUsed;      // Si el código ha sido usado
    }
    mapping(string => PromoCode) public promoCodes;
        
    struct LevelRule {
       uint256 percentage;
       uint256 minDirects;
       uint256 minRank;
    }

    LevelRule[] public levelRules;


        function initialize(address _usdtAddress, address _poiAddress,address _accountContract,address _stakingAddress, address _accountAddress) public initializer {
            __AccessControl_init();
            __Ownable_init(msg.sender);
            __UUPSUpgradeable_init();
            _grantRole(ADMIN_ROLE, msg.sender);

            USDT = IERC20(_usdtAddress);
            poiContract = POI(_poiAddress);
            accountContract = NFTAccount(_accountContract);
            stakingAddress = _stakingAddress;
            accountAddress = _accountAddress;

            addLevelRule(2000, 0, 0);
            addLevelRule(500, 2, 1);
            addLevelRule(400, 3, 1);
            addLevelRule(300, 4, 1);
            addLevelRule(200, 5, 2);
            addLevelRule(100, 6, 2);
            addLevelRule(100, 7, 2);
            addLevelRule(100, 8, 3);
            addLevelRule(100, 9, 3);
            addLevelRule(100, 10, 3);
            addLevelRule(100, 11, 4);
            addLevelRule(100, 12, 4);
            addLevelRule(100, 13, 4);
            addLevelRule(100, 14, 5);
            addLevelRule(100, 15, 5);
            addLevelRule(100, 16, 5);
            addLevelRule(50, 17, 6);
            addLevelRule(50, 18, 6);
            addLevelRule(50, 19, 6);
            addLevelRule(50, 20, 7);
            addLevelRule(50, 21, 7);
            addLevelRule(50, 22, 7);
            addLevelRule(50, 23, 8);
            addLevelRule(50, 24, 8);
            addLevelRule(50, 25, 8);

        }
        function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
        
        mapping(uint256 => bool) public haveMembership;
        mapping(address => bool) public hasExecuted;


    function addLevelRule(uint256 _percentage, uint256 _minDirects, uint256 _minRank) public onlyRole(ADMIN_ROLE) {
        levelRules.push(LevelRule({
            percentage: _percentage,
            minDirects: _minDirects,
            minRank: _minRank
        }));
    }

    function updateLevelRule(uint256 _level, uint256 _percentage, uint256 _minDirects, uint256 _minRank) public onlyRole(ADMIN_ROLE) {
        require(_level < levelRules.length, "Invalid level");
        levelRules[_level] = LevelRule({
            percentage: _percentage,
            minDirects: _minDirects,
            minRank: _minRank
        });
    }

    function removeLevelRule(uint256 _level) public onlyRole(ADMIN_ROLE) {
        require(_level < levelRules.length, "Invalid level");
        for (uint256 i = _level; i < levelRules.length - 1; i++) {
            levelRules[i] = levelRules[i + 1];
        }
        levelRules.pop();
    }

    function setUsdtConract(address _usdtAddress) public onlyRole(ADMIN_ROLE) { 
        USDT = IERC20(_usdtAddress);
    }

    function setPoiContract(address _poiAddress) public onlyRole(ADMIN_ROLE) { 
        poiContract = POI(_poiAddress);
    }

    function setAccountContract(address _accountContract) public onlyRole(ADMIN_ROLE) { 
        accountContract = NFTAccount(_accountContract);
    }


   function setStakeingAddress(address _stakingAddress) public onlyRole(ADMIN_ROLE) { 
            stakingAddress = _stakingAddress;
   }

   function setAccountAddress(address _accountAddress) public onlyRole(ADMIN_ROLE) { 
            accountAddress = _accountAddress;
   }
    /*
    function setAmount(uint256 _amount) public onlyRole(ADMIN_ROLE) {
        amount = _amount;
    }

    function setAdminWallets(address _wallet, uint256 _percentage) public onlyRole(ADMIN_ROLE) {
        require((totalPercentageAdmin  + _percentage) <= 1000, "1000 Percentage");
        walletAdmins.push(infoWallet(_wallet, _percentage));
        totalPercentageAdmin += _percentage;
    }


    function removeWalletAdmin(uint256 index) public onlyRole(ADMIN_ROLE) {
        require(index < walletAdmins.length, "Invalid index");
        totalPercentageAdmin -= walletAdmins[index].percentage;
        
        for (uint256 i = index; i < walletAdmins.length - 1; i++) {
            walletAdmins[i] = walletAdmins[i + 1];
        }
        walletAdmins.pop();
    }


    function updateWalletAdmin(uint256 index, address newWallet, uint256 newPercentage) public onlyRole(ADMIN_ROLE) {
        require(index < walletAdmins.length, "Invalid index");
        require(totalPercentageAdmin - walletAdmins[index].percentage + newPercentage <= 1000, "1000 Percentage limit exceeded");
        
        totalPercentageAdmin = totalPercentageAdmin - walletAdmins[index].percentage + newPercentage;
        walletAdmins[index].wallet = newWallet;
        walletAdmins[index].percentage = newPercentage;
    }
    */

    //Funcion para crear Membresia
    function createMembership(string memory _membershipTitle, uint256 _membershipAmount, uint256 _maxMemberships,
    uint256 _timelimitMembership, uint256 _expirationMembership, uint256 _minInv, uint256 _maxInv, bool _fee, uint256 _amountFee,uint256 _performanceFee
    ) public onlyRole(ADMIN_ROLE){
            memberships.push(Membership(_membershipTitle,_membershipAmount,0,_maxMemberships, block.timestamp,block.timestamp +  (_timelimitMembership * 1 days), _expirationMembership ,
            _minInv, _maxInv, _fee, _amountFee,_performanceFee));
    }

    function updateMembership(uint256 _membershipId, string memory _membershipTitle, uint256 _membershipAmount, uint256 _maxMemberships,
    uint256 _timelimitMembership, uint256 _expirationMembership, uint256 _minInv, uint256 _maxInv, bool _fee, uint256 _amountFee,uint256 _performanceFee
    ) public onlyRole(ADMIN_ROLE) {
        Membership storage membership = memberships[_membershipId];
        membership.membershipTitle = _membershipTitle;
        membership.membershipAmount = _membershipAmount;
        membership.maxMemberships = _maxMemberships;
        membership.timelimitMembership = block.timestamp + (_timelimitMembership * 1 days);
        membership.expirationMembership = _expirationMembership;
        membership.minInv = _minInv;
        membership.maxInv = _maxInv;
        membership.fee = _fee;
        membership.amountFee = _amountFee;
        membership.performanceFee = _performanceFee;
    }

    function deleteMembership(uint256 _membershipId) public onlyRole(ADMIN_ROLE) { 
        require(_membershipId < memberships.length, "Invalid membership ID");
        for (uint i = _membershipId; i < memberships.length - 1; i++) {
            memberships[i] = memberships[i + 1];
        }
        memberships.pop();
    }

    function addPromoCode(string memory _promoCode, uint256 _amount) public onlyRole(ADMIN_ROLE) {
        promoCodes[_promoCode].discount = _amount;
        promoCodes[_promoCode].isUsed = true;
    }
    

    function validatePromoCode(string memory _promoCode) public view returns (uint256) {
        require(promoCodes[_promoCode].isUsed, "Invalid promo code");
        return promoCodes[_promoCode].discount;
    }

    function checkWallet(uint256 _sponsors) public view returns (bool) {
                    bool canReceiveEarnings = false;
                    if (hasExecuted[accountContract.ownerOf(_sponsors)]) {
                        // Verifica si tiene al menos una membresía
                        if (getMembershipOfUsersLength(_sponsors) > 0) {
                            for (uint i = 0; i < getMembershipOfUsersLength(_sponsors); i++) {
                                uint256 membershipId = getInfoOfMembership(_sponsors, i).memberId;
                                // Si tiene membresía 1 o 2, verifica si ha hecho stake
                                if (membershipId == 1 || membershipId == 2) {
                                    if (membershipOfUsers[_sponsors][i].staked > 0) {
                                        canReceiveEarnings = true;
                                        break;
                                    }
                                } else {
                                    // Si tiene membresía mayor a 2, puede recibir ganancias
                                    canReceiveEarnings = true;
                                    break;
                                }
                            }
                        }
                    }
        return canReceiveEarnings;
    }

   /* function payNft(uint256 _sponsor, address _wallet) public {

        
        // Aprobar la transferencia de tokens del usuario al contrato MembershipContract
        require(USDT.approve(address(this), (amount * 50) / 100), "USDT approve failed");

        require(USDT.transferFrom(_wallet, accountContract.ownerOf(_sponsor), (amount * 50) / 100));
        for (uint256 i = 0; i < walletAdmins.length; i++) {
            require(USDT.transferFrom(_wallet, walletAdmins[i].wallet, (amount * walletAdmins[i].percentage) / 1000));
        }
    }*/


    // Función para comprar una membresía:
    function buyMembership(uint256 _membershipId,uint256 _nftUse, uint256 _sponsor, address _wallet, string memory _promoCode) public  {
      if(accountContract.ownerOf(0) != msg.sender){
            Membership storage membership = memberships[_membershipId]; //Agarra la membresia actual
            uint256 discount;        
            uint256  negativeAmount; //Variable para acumular todo lo enviado a los diferentes equipos, ej: Mkt, dev etc...
            if (bytes(_promoCode).length > 0) {
                discount = validatePromoCode(_promoCode);
                promoCodes[_promoCode].isUsed = false;
            }
            
            uint256 finalAmount = membership.membershipAmount - (membership.membershipAmount * discount / 100);
           /* if (!hasExecuted[_wallet] && accountContract.balanceOf(_wallet) == 0 ) {
                accountContract.createAccount("Main account", _wallet,_sponsor,_membershipId,_promoCode); // Execute the extra code
                hasExecuted[_wallet] = true; // Mark the user as having executed the function       
                payNft(_sponsor,_wallet);                                                       EL NFT SE PAGA POR SEPARADO
            }
            if(msg.sender == accountAddress){
                payNft(_sponsor,_wallet);
            }*/
            if(!hasExecuted[_wallet]){
                hasExecuted[_wallet] = true;
            }

            membership.actualMemberships++; //Suma 1 en la cantidad de gente
            
            require(membership.maxMemberships == 0 || membership.actualMemberships <= membership.maxMemberships, "Membership limit reached"); //Verifica cantidad
            require(block.timestamp <= membership.timelimitMembership || membership.timelimitMembership == 0, "Membership sale expired"); //Verifica tiempo
            require(_sponsor != _nftUse, "sponsor dif own address"); //Verifica expiracion
            if(_sponsor != 0){
            require(haveMembership[_sponsor], "sponsor dont have membership"); //Verifica expiracion
            }
            require(accountContract.ownerOf(_nftUse) == _wallet ,"Debe ser el dueno del NFT"); //Verifica expiracion
            require(poiContract.userRegister(_wallet),"Debe estar registrado"); //Debe estar registrado
           
           if(!haveMembership[_nftUse]){
                leadershipSplitPartners[_nftUse] = _sponsor; //Setea el referido para la wallet actual 
                haveMembership[_nftUse] = true;
           }


            uint256 sponsors = _sponsor;
            uint x = 0;
            while (true) {
                if (x == 0) {
                    emit UpdateTotalDirect(sponsors, finalAmount);
                    emit UpdateDirectVol(sponsors, finalAmount, _nftUse);
                    directs[sponsors]++;
                   accountContract.updateTotalDirect(sponsors, finalAmount); 
                   accountContract.updateDirectVol(sponsors, finalAmount, _nftUse); 
                } else {
                    emit UpdateTotalGlobal(sponsors, finalAmount);
                    emit UpdateGlobalVol(sponsors, finalAmount, x, _nftUse);
                    accountContract.updateTotalGlobal(sponsors, finalAmount); 
                    accountContract.updateGlobalVol(sponsors, finalAmount, x, _nftUse); 
                }
                if(sponsors == 0){
                    uint256 percentage = (finalAmount * levelRules[x].percentage) / 10000;
                    negativeAmount += percentage;
                    rewards[sponsors] += percentage;
                    //require(USDT.transferFrom(_wallet, accountContract.ownerOf(sponsors), percentage), "USDT transfer failed"); NO SE TRANSIFERE SINO SE RETIRA
                    require(USDT.transferFrom(_wallet, address(this), percentage), "USDT transfer failed");
                    emit UpdateProfit(sponsors, x, percentage);
                    accountContract.updateProfit(sponsors, x, percentage); 
                    break;
                }
                if (accountContract.getDirectVolCount(sponsors) >= levelRules[x].minDirects || accountContract.getRank(sponsors) >= levelRules[x].minRank) { //Verifica que cumpla con el minimo de directos o rango
                    uint256 percentage = (finalAmount * levelRules[x].percentage) / 10000;
                    // Revisa si tiene membresia, si es que tiene diferente a la zero (1 o 2) y si es que tiene zero verifica que tenga stake
                    bool canReceiveEarnings = checkWallet(sponsors);
                    if (canReceiveEarnings) {
                        negativeAmount += percentage;
                        rewards[sponsors] += percentage;
                        //require(USDT.transferFrom(_wallet, accountContract.ownerOf(sponsors), percentage), "USDT transfer failed"); NO SE TRANSFIERE SINO SE RETIRA
                        require(USDT.transferFrom(_wallet, address(this), percentage), "USDT transfer failed");
                        emit UpdateProfit(sponsors, x, percentage);
                        accountContract.updateProfit(sponsors, x, percentage);  
                    }
                } else {
                    uint y = x; 
                    uint256 sponsorsTemp = sponsors;
                    while (true) {
                        if (sponsorsTemp == 0) {
                            uint256 percentage = (finalAmount * levelRules[y].percentage) / 10000;
                            negativeAmount += percentage;
                            rewards[sponsorsTemp] += percentage;
                            //require(USDT.transferFrom(_wallet, accountContract.ownerOf(sponsorsTemp), percentage), "USDT transfer failed"); NO SE TRANSFIERE SINO SE RETIRA
                            require(USDT.transferFrom(_wallet, address(this), percentage), "USDT transfer failed");
                            emit UpdateProfit(sponsorsTemp, x, percentage);
                            emit UpdateMissedProfit(sponsors, x, percentage);
                            emit UpdatePayedProfit(sponsorsTemp, x, percentage);
                            accountContract.updateProfit(sponsorsTemp, x, percentage);
                            accountContract.updateMissedProfit(sponsors, x, percentage); 
                            accountContract.updatePayedProfit(sponsorsTemp, x, percentage); 
                            break;
                        }
                        if (accountContract.getDirectVolCount(sponsorsTemp) >= levelRules[y].minDirects || accountContract.getRank(sponsorsTemp) >= levelRules[y].minRank) {
                            uint256 percentage = (finalAmount * levelRules[y].percentage) / 10000;
                            bool canReceiveEarnings = checkWallet(sponsorsTemp);
                            if (canReceiveEarnings) {
                                negativeAmount += percentage;
                                rewards[sponsorsTemp] += percentage;
                                //require(USDT.transferFrom(_wallet, accountContract.ownerOf(sponsorsTemp), percentage), "USDT transfer failed"); NO SE TRANSFIERE SINO SE RETIRA
                                require(USDT.transferFrom(_wallet, address(this), percentage), "USDT transfer failed");
                                emit UpdateProfit(sponsorsTemp, x, percentage);
                                emit UpdateMissedProfit(sponsors, x, percentage);
                                emit UpdatePayedProfit(sponsorsTemp, x, percentage);
                                accountContract.updateProfit(sponsorsTemp, x, percentage);
                                accountContract.updateMissedProfit(sponsors, x, percentage);
                                accountContract.updatePayedProfit(sponsorsTemp, x, percentage);
                                break;
                            }
                        }
                        sponsorsTemp = leadershipSplitPartners[sponsorsTemp];
                    }
                }
                sponsors = leadershipSplitPartners[sponsors];
                x++;
            }
            membershipOfUsers[_nftUse].push(InfoOfMembershipsBuy(_membershipId, block.timestamp, block.timestamp + (membership.expirationMembership * 1 seconds),0));
            MembersMoney[_nftUse] += finalAmount;
            if(bestMember[_nftUse] < _membershipId) {
            bestMember[_nftUse] = _membershipId;
            }
            accountContract.updateMembership(_nftUse,_membershipId);
            partnerShipRewards += (finalAmount - negativeAmount);
             //for (uint i = 0; i < partnerShipSplit.length; i++) {  //Recorre el array de equpos y envia la parte asignada a cada uno y aumenta nevativeAmount
             //    require(USDT.transferFrom(_wallet,partnerShipSplit[i].wallet, ((finalAmount - negativeAmount) * partnerShipSplit[i].percentage)/1000), "USDT transfer failed"); NO MAS TRANSFERENCIAS
             //} 
             require(USDT.transferFrom(_wallet, address(this), (finalAmount - negativeAmount)), "USDT transfer failed");
        }else{
                require(accountContract.ownerOf(_nftUse) == _wallet ,"Debe ser el dueno del NFT"); //Verifica expiracion
                //accountContract.createAccount("Defily Account", _wallet,_sponsor,_membershipId,_promoCode);LA LOGICA IRA POR SEPARADO
                Membership storage membership = memberships[_membershipId]; //Agarra la membresia actual
                membership.actualMemberships++; //Suma 1 en la cantidad de gente
                accountContract.updateMembership(_nftUse,_membershipId);
                haveMembership[_nftUse] = true;
                membershipOfUsers[_nftUse].push(InfoOfMembershipsBuy(_membershipId, block.timestamp, block.timestamp + (membership.expirationMembership * 1 seconds),0));
                bestMember[_nftUse] = _membershipId;
                hasExecuted[_wallet] = true;
        }
        Membership storage membership = memberships[_membershipId];
        emit MembershipPurchased(_membershipId, _nftUse, _sponsor, _wallet, _promoCode, membership.membershipAmount);
    }

    /*
    struct infoWallet {
        address wallet;
        uint256 percentage;
    }
    infoWallet[] public partnerShipSplit;
    uint256 public totalPercentage;

    //Añade equipo como el de marketing o devs
    function addPartnerShipSplit(address _wallet, uint256 _percentage) public {
        require(totalPercentage + _percentage <= 1000, "1000 Percentage");
        totalPercentage += _percentage;
        partnerShipSplit.push(infoWallet(_wallet, _percentage));
    }

    function removePartnerShipSplit(uint256 index) public onlyRole(ADMIN_ROLE) {
        require(index < partnerShipSplit.length, "Invalid index");
        totalPercentage -= partnerShipSplit[index].percentage;
        
        for (uint256 i = index; i < partnerShipSplit.length - 1; i++) {
            partnerShipSplit[i] = partnerShipSplit[i + 1];
        }
        partnerShipSplit.pop();
    }


    function updatePartnerShipSplit(uint256 index, address newWallet, uint256 newPercentage) public onlyRole(ADMIN_ROLE) {
        require(index < partnerShipSplit.length, "Invalid index");
        require(totalPercentage - partnerShipSplit[index].percentage + newPercentage <= 1000, "1000 Percentage limit exceeded");
        
        totalPercentage = totalPercentage - partnerShipSplit[index].percentage + newPercentage;
        partnerShipSplit[index].wallet = newWallet;
        partnerShipSplit[index].percentage = newPercentage;
    }
    */

    function getMembershipOfUsersLength(uint256 userId) public view returns (uint256) {
        return membershipOfUsers[userId].length;
    }

    function getInfoOfMembership(uint256 _userId, uint256 _index) public view returns (InfoOfMembershipsBuy memory) {
        return membershipOfUsers[_userId][_index];
    }

    function getMembership(uint256 _index) public view returns (Membership memory) {
        return memberships[_index];
    }

    function updateStake(uint256 _userId, uint256 _index, uint256 _amount) public { //El msg.sender debe ser el staking
      require(msg.sender == stakingAddress, "Only the staking conrtract can call  this function"); 
      membershipOfUsers[_userId][_index].staked += _amount;
    }
/*
    function getPartnerShipSplitLength() public view returns (uint256) {
        return partnerShipSplit.length;
    }
*/


    //EVENTOS
    event UpdateTotalDirect(uint256 indexed _tokenId, uint256 _directVol);
    event UpdateTotalGlobal(uint256 indexed _tokenId, uint256 _directVol);
    event UpdateDirectVol(uint256 indexed _tokenId, uint256 _directVol, uint256 _referredTokenId);
    event UpdateGlobalVol(uint256 indexed _tokenId, uint256 _globalVol, uint256 _level, uint256 _referredTokenId);
    event UpdateProfit(uint256 indexed _tokenId, uint256 _level, uint256 _amount);
    event UpdateMissedProfit(uint256 indexed _tokenId, uint256 _level, uint256 _amount);
    event UpdatePayedProfit(uint256 indexed _tokenId, uint256 _level, uint256 _amount);


    //MAPPING RETIRO
    mapping(uint256 => uint256) public rewards;

    function claimMembershipReward(uint256 _nftUse) public {
        require(accountContract.ownerOf(_nftUse) == msg.sender ,"Not the owner"); //Verifica expiracion
        emit RewardClaimed(_nftUse, rewards[_nftUse]);
        require(USDT.transfer(msg.sender, rewards[_nftUse]), "USDT transfer failed");
        totalPayedRewards[_nftUse] += rewards[_nftUse];
        rewards[_nftUse] = 0;
    }

    //Info usuario
    mapping(uint256 => uint256) public directs;
    mapping(uint256 => uint256) public rank;
    uint256 public partnerShipRewards;
    address public partnerShip;

    function updateRank(uint256 _tokenId, uint256 _rank) public {
        require(msg.sender == rankAddress, "Only the staking conrtract can call this function"); 
        rank[_tokenId] = _rank;
    }

    function setRankAddress(address _rankAddress) public onlyOwner {
        rankAddress = _rankAddress;
    }

    function setPartnerShip(address _wallet) public onlyRole(ADMIN_ROLE) {
        partnerShip = _wallet;
    }

    function claimRewardPartnerShip() public {
        require(msg.sender == partnerShip, "You are not the PartnerShip"); 
        emit PartnerShipRewardClaimed(partnerShipRewards);
        require(USDT.transfer(msg.sender, partnerShipRewards), "USDT transfer failed");
        partnerShipRewards = 0;
    }

    function updateDirects(uint256 _userId) public { //El msg.sender debe ser el staking
      require(msg.sender == stakingAddress, "Only the staking conrtract can call  this function"); 
      directs[_userId]++;
    }

    function getDirects (uint256 _userId) public view returns (uint256) { //El msg.sender debe ser el staking
        return  directs[_userId];
    }

    function getRank (uint256 _userId) public view returns (uint256) { //El msg.sender debe ser el staking
        return  rank[_userId];
    }




    event MembershipPurchased(uint256 membershipId, uint256 indexed nftUse, uint256 sponsor,address wallet, string promoCode, uint256 amountPaid);
    event RewardClaimed(uint256 indexed nftUse, uint256 amountClaimed);
    event PartnerShipRewardClaimed(uint256 amountClaimed);

    mapping(uint256 => uint256) public totalPayedRewards; 


}




