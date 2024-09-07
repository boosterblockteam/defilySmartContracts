// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol"; 
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Members.sol";
import "./Poi.sol";

contract NFTAccount is Initializable, ERC721Upgradeable, UUPSUpgradeable, OwnableUpgradeable {
    POI public poi;
    MembershipContract public membershipContract;
    IERC20 public USDT;

    address public stakingAddress;
    address public rankAddress;
    address public membershipContractAddress;
    uint256 public tokenIds;
    uint256[] public selectedImages;
    uint256 public adminWalletsRewards;
    address public adminWallet;
    uint256 public amount;

    event AccountCreated(uint256 indexed tokenId, string NFTName, address user, uint256 sponsor, uint256 nftNumber);
    event RewardFromReferral(uint256 indexed tokenId, uint256 amount, uint256 referredTokenId);
    event RewardFromReferralAdmin(uint256 amount, uint256 referredTokenId);
    event TotalDirectUpdated(uint256 indexed tokenId, uint256 directVol);
    event TotalGlobalUpdated(uint256 indexed tokenId, uint256 globalVol);
    event DirectVolumeUpdated(uint256 indexed tokenId, uint256 directVol, uint256 referredTokenId);
    event NewDirect(uint256 indexed tokenId, uint256 directVol, uint256 referredTokenId);
    event GlobalVolumeUpdated(uint256 indexed tokenId, uint256 globalVol, uint256 level, uint256 referredTokenId);
    event NewGlobal(uint256 indexed tokenId, uint256 globalVol, uint256 level, uint256 referredTokenId);
    event MembershipUpdated(uint256 indexed tokenId, uint256 membershipId);
    event StakedUpdated(uint256 indexed tokenId, uint256 amount);
    event ProfitUpdated(uint256 indexed tokenId, uint256 level, uint256 amount);
    event MissedProfitUpdated(uint256 indexed tokenId, uint256 level, uint256 amount);
    event PayedProfitUpdated(uint256 indexed tokenId, uint256 level, uint256 amount);
    event RankUpdated(uint256 indexed tokenId, uint256 rank);
    event AccountRenamed(uint256 indexed tokenId, string newName);
    event AccountTransferred(address indexed from, address indexed to, uint256 tokenId);
    event AllAccountsTransferred(address indexed from, address indexed to);
    event AdminWalletClaimed(address adminWallet, uint256 amount);
    event RewardClaimed(address indexed user, uint256 indexed nftUse, uint256 amount);

    struct VolumeInfo {
        uint256 amount;
        uint256 tokenId;
    }

    struct accountInfoData {
        uint256 NFTID;
        string NFTName;
        string NFTCid;  //VERSION BINARIA
        uint256 sponsorNFT;
        uint256 uplineNft; //VERSION BINARIA
        uint256 legSide;   //VERSION BINARIA 1 izquierda 2 derecha
        uint256 creationData;
        uint256[] membership;
        VolumeInfo[] directVol; // Cada posición del array es un tokenId
        VolumeInfo[][] globalVol; // Doble array para almacenar niveles y ID de cada nivel
        uint256 staked;
        uint256[] profit;
        uint256[] missedProfit;
        uint256[] payedProfit;
        uint256 rank;
        uint256 totalDirect;
        uint256 totalGlobal;
    }


    mapping(uint256 => accountInfoData) public accountInfo; //Informacion de la persona
    mapping(address => uint256[]) public arrayInfo; //Array de info de un usuario
    mapping(string => bool) public usedName; 
    mapping(uint256 => uint256) public totalPayedRewards; 
    mapping(uint256 => uint256) public nftImage;
    mapping(uint256 => uint256) public rewards;



    function initialize(address _usdtAddress, address _poiContractAddress, address _memberContract, address _stakingAddress, uint256 _amount) public initializer { 
        __ERC721_init("MyNFT", "NFT"); 
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();
        USDT = IERC20(_usdtAddress);
        poi = POI(_poiContractAddress);
        membershipContract = MembershipContract(_memberContract);
        membershipContractAddress = _memberContract;
        stakingAddress = _stakingAddress;
        amount = _amount;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    //Variables de admin
    function setUsdtConract(address _usdtAddress) public onlyOwner { 
        USDT = IERC20(_usdtAddress);
    }

    function setMemberContract(address _memberContract) public onlyOwner {
        membershipContract = MembershipContract(_memberContract);
    }

    function setPoiContract(address _poiContract) public onlyOwner {
        poi = POI(_poiContract);
    }

    function setMembershipContractAddress(address _memberContract) public onlyOwner {
        membershipContractAddress = _memberContract;
    }

    function setStakingAddress(address _stakingAddress) public onlyOwner {
        stakingAddress = _stakingAddress;
    }
    
    function setRankAddress(address _rankAddress) public onlyOwner {
        rankAddress = _rankAddress;
    }

    function setAdminWallet(address _wallet) public onlyOwner {
        adminWallet = _wallet;
    }

    function claimAdminWallet() public {
        require(msg.sender == adminWallet, "You are not the PartnerShip"); 
        emit AdminWalletClaimed(msg.sender, adminWalletsRewards);
        require(USDT.transfer(msg.sender, adminWalletsRewards), "USDT transfer failed");
        adminWalletsRewards = 0;
    }

    function setAmount(uint256 _amount) public onlyOwner {
        amount = _amount;
    }

    //Variables de Usuario
    function createNFT(string memory _nameAccount, address _user, uint256 _sponsor, string memory NFTCid, uint256 uplineNft, uint256 legSide,
      uint256 _nftNumber) public {
        require(poi.userRegister(_user), "Debe estar registrado en el POI");
        require(!usedName[_nameAccount], "El nombre de cuenta ya existe, seleccione otro nombre."); // Verifica si el nombre ya existe
        require(USDT.transferFrom(msg.sender, address(this), amount), "USDT transfer failed");

        if(tokenIds != 0){
            emit RewardFromReferral(_sponsor, (amount * 50) / 100, tokenIds);
            rewards[_sponsor] += (amount * 50) / 100;
            emit RewardFromReferralAdmin((amount * 50) / 100, tokenIds);
            adminWalletsRewards += (amount * 50) / 100;
        }else{
            adminWalletsRewards += amount;
        }

        accountInfo[tokenIds].NFTID = tokenIds;
        accountInfo[tokenIds].NFTName = _nameAccount;
        accountInfo[tokenIds].sponsorNFT = _sponsor;
        accountInfo[tokenIds].creationData = block.timestamp;
        accountInfo[tokenIds].NFTCid = NFTCid;
        accountInfo[tokenIds].uplineNft = uplineNft;
        accountInfo[tokenIds].legSide = legSide;
        arrayInfo[_user].push(tokenIds);

        _mint(_user, tokenIds);
        selectedImages.push(_nftNumber); // Add selected image to the list

        usedName[_nameAccount] = true;

        nftImage[tokenIds] = _nftNumber;           

        emit AccountCreated(tokenIds, _nameAccount, _user, _sponsor, _nftNumber);

        tokenIds++;

    }

    function transferAccount(address _from, address _to, uint256 _tokenId) public {
            require(msg.sender == ownerOf(_tokenId), "Not the owner");
        require(poi.userRegister(_from), "Debe estar registrado en el POI");

        _transfer(_from, _to, _tokenId);
        
        uint256[] storage fromArray = arrayInfo[_from];
        for (uint256 i = 0; i < fromArray.length; i++) {
            if (fromArray[i] == _tokenId) {
                fromArray[i] = fromArray[fromArray.length - 1];
                fromArray.pop();
                break;
            }
        }
        
        arrayInfo[_to].push(_tokenId);
        emit AccountTransferred(_from, _to, _tokenId);
    }

    function transferAllAccounts(address _from, address _to) public {
        require(poi.userRegister(_from), "Debe estar registrado en el POI");
        uint256[] storage fromArray = arrayInfo[_from];
        for (uint256 i = 0; i < fromArray.length; i++) {
            uint256 tokenId = fromArray[i];
            require(msg.sender == ownerOf(tokenId), "Not the owner");
            _transfer(_from, _to, tokenId);
            arrayInfo[_to].push(tokenId);
        }

        delete arrayInfo[_from];
        emit AllAccountsTransferred(_from, _to);
    }

    //Update
    function updateTotalDirect(uint256 _tokenId, uint256 _directVol) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Funcion solo callable desde el contrato members");
        accountInfo[_tokenId].totalDirect += _directVol;
        emit TotalDirectUpdated(_tokenId, _directVol);
    }

    function updateTotalGlobal(uint256 _tokenId, uint256 _globalVol) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Funcion solo callable desde el contrato members");
        accountInfo[_tokenId].totalGlobal += _globalVol;
        emit TotalGlobalUpdated(_tokenId, _globalVol);
    }

    function updateDirectVol(uint256 _tokenId, uint256 _directVol, uint256 referredTokenId) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Funcion solo callable desde el contrato members");

        bool found = false;
        for (uint256 i = 0; i < accountInfo[_tokenId].directVol.length; i++) {
            if (accountInfo[_tokenId].directVol[i].tokenId == referredTokenId) {
                accountInfo[_tokenId].directVol[i].amount += _directVol;
                found = true;
                break;
            }
        }

        if (!found) {
            accountInfo[_tokenId].directVol.push(VolumeInfo({amount: _directVol, tokenId: referredTokenId}));
            emit NewDirect(_tokenId, _directVol, referredTokenId);
        }
        emit DirectVolumeUpdated(_tokenId, _directVol, referredTokenId);
    }

    function updateGlobalVol(uint256 _tokenId, uint256 _globalVol, uint256 level, uint256 referredTokenId) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Funcion solo callable desde el contrato members");

        // Asegúrate de que el nivel exista en el array
        if (accountInfo[_tokenId].globalVol.length <= level) {
            for (uint256 i = accountInfo[_tokenId].globalVol.length; i <= level; i++) {
                accountInfo[_tokenId].globalVol.push();
            }
        }

        bool found = false;
        for (uint256 i = 0; i < accountInfo[_tokenId].globalVol[level].length; i++) {
            if (accountInfo[_tokenId].globalVol[level][i].tokenId == referredTokenId) {
                accountInfo[_tokenId].globalVol[level][i].amount += _globalVol;
                found = true;
                break;
            }
        }

        if (!found) {
            accountInfo[_tokenId].globalVol[level].push(VolumeInfo({amount: _globalVol, tokenId: referredTokenId}));
            emit NewGlobal(_tokenId, _globalVol, level, referredTokenId);
        }

        emit GlobalVolumeUpdated(_tokenId, _globalVol, level, referredTokenId);
    }
    

    function updateMembership(uint256 _tokenIds, uint256 _membershipId) public {
        require(msg.sender == membershipContractAddress, "Funcion solo calleable desde el contrato members");
        accountInfo[_tokenIds].membership.push(_membershipId);
        emit MembershipUpdated(_tokenIds, _membershipId);
    }

    function updateStaked(uint256 _tokenIds, uint256 _amount) public {
        require(msg.sender == stakingAddress, "Only the staking conrtract can call this function"); 
        accountInfo[_tokenIds].staked += _amount;
        emit StakedUpdated(_tokenIds, _amount);
    }

    
    function updateProfit(uint256 _tokenId, uint256 level, uint256 _amount) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Only the membership or staking contract can call this function"); 
        
        // Asegúrate de que el nivel exista en el array
        if (accountInfo[_tokenId].profit.length <= level) {
            for (uint256 i = accountInfo[_tokenId].profit.length; i <= level; i++) {
                accountInfo[_tokenId].profit.push(0);
            }
        }

        accountInfo[_tokenId].profit[level] += _amount;
        emit ProfitUpdated(_tokenId, level, _amount);
    }


    function updateMissedProfit(uint256 _tokenId, uint256 level, uint256 _amount) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Only the membership or staking contract can call this function"); 
        
        // Asegúrate de que el nivel exista en el array
        if (accountInfo[_tokenId].missedProfit.length <= level) {
            for (uint256 i = accountInfo[_tokenId].missedProfit.length; i <= level; i++) {
                accountInfo[_tokenId].missedProfit.push(0);
            }
        }

        accountInfo[_tokenId].missedProfit[level] += _amount;
        emit MissedProfitUpdated(_tokenId, level, _amount);
    }

    function updatePayedProfit(uint256 _tokenId, uint256 level, uint256 _amount) public {
        require(msg.sender == membershipContractAddress || msg.sender == stakingAddress, "Only the membership or staking contract can call this function"); 
        
        // Asegúrate de que el nivel exista en el array
        if (accountInfo[_tokenId].payedProfit.length <= level) {
            for (uint256 i = accountInfo[_tokenId].payedProfit.length; i <= level; i++) {
                accountInfo[_tokenId].payedProfit.push(0);
            }
        }

        accountInfo[_tokenId].payedProfit[level] += _amount;
        emit PayedProfitUpdated(_tokenId, level, _amount);
    }
    
    function updateRank(uint256 _tokenIds, uint256 _rank) public {
        require(msg.sender == rankAddress || msg.sender == owner(), "Only the rank contract or the owner can call this function");
        accountInfo[_tokenIds].rank = _rank;
        emit RankUpdated(_tokenIds, _rank);
    }

    function renameAccount(uint256 _tokenIds, string memory _nameAccount) public {
        require(msg.sender == ownerOf(_tokenIds), "Not the owner");
        accountInfo[_tokenIds].NFTName = _nameAccount;
        emit AccountRenamed(_tokenIds, _nameAccount);
    }

    //GETTERS

    function getTotalDirect(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].totalDirect;
    }

    function getTotalGlobal(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].totalGlobal;
    }


    function getDirectVolCount(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].directVol.length;
    }
    
    function getDirectVolInfo(uint256 _tokenId, uint256 _pos) public view returns (uint256, uint256) {
        VolumeInfo storage volInfo = accountInfo[_tokenId].directVol[_pos];
        return (volInfo.tokenId, volInfo.amount);
    }

    // Obtener la cantidad de personas en un nivel específico de globalVol
    function getGlobalVolCount(uint256 _tokenId, uint256 level) public view returns (uint256) {
        require(level < accountInfo[_tokenId].globalVol.length, "Nivel no existe");
        return accountInfo[_tokenId].globalVol[level].length;
    }

    function getCantLevles(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].globalVol.length;
    }

    function getCantPeronInLevel(uint256 _tokenId,uint256 _level) public view returns (uint256) {
        return accountInfo[_tokenId].globalVol[_level].length;
    }

    function getCantLevlesProfit(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].profit.length;
    }

    function getProfit(uint256 _tokenId,uint256 _level) public view returns (uint256) {
        return accountInfo[_tokenId].profit[_level];
    }

    function getCantLevlesMissedProfit(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].missedProfit.length;
    }

    function getMissedProfit(uint256 _tokenId,uint256 _level) public view returns (uint256) {
        return accountInfo[_tokenId].missedProfit[_level];
    }

    function getCantLevlesPayedProfit(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].payedProfit.length;
    }

    function getPayedProfit(uint256 _tokenId,uint256 _level) public view returns (uint256) {
        return accountInfo[_tokenId].payedProfit[_level];
    }

    function getRank(uint256 _tokenId) public view returns (uint256) {
        return accountInfo[_tokenId].rank;
    }

    function claimNftReward(uint256 _nftUse) public {
        require(ownerOf(_nftUse) == msg.sender ,"Not the owner"); //Verifica expiracion
        emit RewardClaimed(msg.sender, _nftUse, rewards[_nftUse]);
        require(USDT.transfer(msg.sender, rewards[_nftUse]), "USDT transfer failed");
        totalPayedRewards[_nftUse] += rewards[_nftUse];
        rewards[_nftUse] = 0;
    }

    function getSelectedImages() public view returns (uint256[] memory) {
        return selectedImages;
    }
}
