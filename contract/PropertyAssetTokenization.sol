// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "contracts/Liquidtoken.sol";
import "contracts/Valuetoken.sol";

contract MyContractFinal {

    address private propertyValueToken_address =
        0x4BC85847ab8c763EB4F1A4fE07De1545694c5522;
    address private propertyLiquidToken_address =
       0xDd7CF60b8d4D4Df3067d52992985Cab7F2E7EdD6;

    address public contract_owner;
    IERC20 public propertyValueToken = IERC20(propertyValueToken_address);
    IERC20 public propertyLiquidToken = IERC20(propertyLiquidToken_address);

    constructor() public {
        contract_owner = msg.sender;
    }

    uint256 public platformFeePercentage = 2; // Platform fee percentage

    // Contract addresses
    
    struct User {
        address id;
        string uname;
        string email;
        string phone_num;
        string aadharNumber;
        string pan_card;
        string pronouns;
        bool isUserVerified;
             }

    struct PropertyInspector {
        uint256 id;
        address inspector_address;
        string name;
        uint256 age;
        string designation;
        string city;
    }


    struct PropertyStruct{
        uint property_id;
        string name;
        string propertyAddress;
        string description;
        string location;
        uint256 value;
        bool isPropertyVerified;
        bool isListed;
        string[] images;
        string[] ownership_proof;
        address owner;

    }

     struct PropertyListingStruct{
            uint reqId;
            string name;
            string location;
            string[] images;
            address owner;
            uint property_id;
    }

    struct SharePart{
        uint LiquidTokenPart;
        uint PropertyTokenPart;
    }
    // MAPPING
    mapping(address => bool) RegisteredUserMapping;
    mapping(uint256 => address[]) allUsersList;
    mapping(uint256 => address) AllUsers;
    mapping(address => User) public UserMapping;
    mapping(address => bool) RegisteredInspectorMapping;
    mapping(uint256 => address[]) allPropertyInspectorList;
    mapping(address => PropertyInspector) public InspectorMapping;
    mapping(address => uint[])  MyProperties;
    mapping (uint256 => PropertyStruct) public properties;
    mapping(uint => PropertyStruct) public allPropertiesList;
    mapping(address => uint[])  MyReceivedPropertiesRequest;
    mapping(address => uint[])  MySentPropertiesRequest; 
    mapping(address => PropertyListingStruct) public propertiesListingMapping;
    mapping(uint => PropertyListingStruct) public allPropertiesListingRequestMapping;
    mapping(address => uint256) public platformFeeDeposit;
    mapping(uint => bool) public propertyListMapping;
    mapping(address => uint256) public LiquidTokenbalances;
    mapping(address => uint256) public PropertyTokenbalances;
    mapping(address =>mapping(address => mapping(uint => SharePart))) public propertyShareRequstMapping;
    mapping(uint => mapping(address => SharePart)) public propertyOwnersShares;
    mapping(uint=>mapping(address => bool)) public isShareOwnerMapping;

    uint256 inspectorsCount;
    uint256 public userCount;
    uint256 propertiesCount;
    // uint256 propertyRegistrationRequestCount;
    uint256 public propertyOwnerTokenAmount = 50; // Amount of tokens to transfer to property owner
    uint256 public daoBalance;

    uint256 propertiesListingRequestCount;

        function isContractOwner(address _addr) public view returns (bool) {
            return _addr == contract_owner;
        }


function isPropertyInspector(address _id) public view returns (bool) {
    return RegisteredInspectorMapping[_id];
}


    function getPropertyDetails(uint property_id) public view returns (PropertyStruct memory){
        require(isPropertyInspector(msg.sender));
        return properties[property_id];
    }

    //-----------------------------------------------User-----------------------------------------------
function isUserRegistered(address _addr) public view returns (bool) {
    return RegisteredUserMapping[_addr];
}


    function registerUser(
        string memory _name,
        string memory _email,
        string memory _phone_num,
        string memory _aadharNumber,
        string memory _pan_card,
        string memory _pronouns
    ) public {
        require(!RegisteredUserMapping[msg.sender]);

        RegisteredUserMapping[msg.sender] = true;
        userCount++;
        allUsersList[1].push(msg.sender);
        AllUsers[userCount] = msg.sender;
        UserMapping[msg.sender] = User(
            msg.sender,
            _name,
            _email,
            _phone_num,
            _aadharNumber,
            _pan_card,
            _pronouns,
            false
        );
        //emit Registration(msg.sender);
    }

    function verifyUser(address _userId) public {
        require(isPropertyInspector(msg.sender));
        UserMapping[_userId].isUserVerified = true;
    }

    function isUserVerified(address id) public view returns (bool) {
        return UserMapping[id].isUserVerified;
    }

    function ReturnAllUserList() public view returns (address[] memory) {
        return allUsersList[1];
    }

    // ---------------------------------------------------------------Property Inspectors----------------------------------

    function addPropertyInspector(
        address _addr,
        string memory _name,
        uint256 _age,
        string memory _designation,
        string memory _city
    ) public returns (bool) {
        if (contract_owner != msg.sender) return false;
        require(contract_owner == msg.sender);
        RegisteredInspectorMapping[_addr] = true;
        allPropertyInspectorList[1].push(_addr);
        InspectorMapping[_addr] = PropertyInspector(
            inspectorsCount,
            _addr,
            _name,
            _age,
            _designation,
            _city
        );
        return true;
    }
    function ReturnAllPropertyIncpectorList()
        public
        view
        returns (address[] memory)
    {
        return allPropertyInspectorList[1];
    }

    // --------------------------------------------------REQUEST  PROPERTY  LISTING-----------------------------------------------------------------------


    function addProperty(
        string memory _name,
        string memory _propertyAddress,
        string memory _description,
        string memory _loaction,
        uint256  _value,
        string[] memory _images,
        string[] memory _ownership_proof
    ) public{
        require(isUserVerified(msg.sender));
        propertiesCount++;
        properties[propertiesCount]  = PropertyStruct(propertiesCount, _name, 
        _propertyAddress,
        _description,
        _loaction,
        _value,
        false,
        false,
        _images,
        _ownership_proof,
        msg.sender
        );
        MyProperties[msg.sender].push(propertiesCount);
        allPropertiesList[propertiesCount] = properties[propertiesCount];
    }

    function ReturnAllPropertiesList() public view returns (PropertyStruct[] memory) {
            PropertyStruct[] memory allProperties = new PropertyStruct[](propertiesCount); // Create an array to store all properties
            for (uint i = 1; i <= propertiesCount; i++) {
                allProperties[i - 1] = allPropertiesList[i]; // Assign each property to the array
            }
            return allProperties;
        }


    function isPropertyVerified(uint _id) public view returns(bool){
        return properties[_id].isPropertyVerified;
    }

    function isPropertyOwner(uint _id, address userAddress) public view returns(bool){
        // return 
        return properties[_id].owner == userAddress;
    }

    function verfifyProperty(uint _id) public {
        require(isPropertyInspector((msg.sender)));
        properties[_id].isPropertyVerified = true;
        allPropertiesList[_id].isPropertyVerified=true;
    }

    function requestPropertyListing(uint _property_id,  string memory _name,
        string memory _loaction,
        string[] memory images
        ) public {
        require(isUserVerified(msg.sender) && isPropertyVerified(_property_id) && isPropertyOwner(_property_id, msg.sender));
        propertiesListingRequestCount++;
        propertiesListingMapping[msg.sender]=PropertyListingStruct(propertiesListingRequestCount, _name,_loaction,images,msg.sender,_property_id);  
        allPropertiesListingRequestMapping[propertiesListingRequestCount]=propertiesListingMapping[msg.sender];
    }

    
        function getPropertyListing(uint requestId) public view returns (PropertyListingStruct memory) {
            return allPropertiesListingRequestMapping[requestId];
        }



    function AcceptListingRequest(uint _property_id) public {
        require(isPropertyInspector(msg.sender), "Invalid request");

        address propertyOwner = properties[_property_id].owner;
        require(propertyLiquidToken.transfer(propertyOwner, propertyOwnerTokenAmount));
        require(propertyValueToken.transfer(propertyOwner, propertyOwnerTokenAmount));

        LiquidTokenbalances[propertyOwner] += propertyOwnerTokenAmount;
        PropertyTokenbalances[propertyOwner] += propertyOwnerTokenAmount;
        propertyOwnersShares[_property_id][propertyOwner] = SharePart(propertyOwnerTokenAmount, propertyOwnerTokenAmount);
        properties[_property_id].isListed = true;
        allPropertiesList[_property_id].isListed=true;
    }

    // request property part 

    function requestPropertyPart(uint _property_id,address userAddress, uint LiquidToken, uint propertyToken) public {

        require(isUserVerified(userAddress) && isPropertyVerified(_property_id) && (isPropertyOwner(_property_id, userAddress) || isShareOwnerMapping[_property_id][userAddress]) , "Invalid request");
        propertyShareRequstMapping[msg.sender][userAddress][_property_id] = SharePart(LiquidToken, propertyToken);
        MySentPropertiesRequest[msg.sender].push(_property_id);
        MyReceivedPropertiesRequest[userAddress].push(_property_id);
    }

    function getMySentPropertiesRequest(address userAddress) public view returns (uint[] memory) {
        return MySentPropertiesRequest[userAddress];
    }

    // Get MyReceivedPropertiesRequest
    function getMyReceivedPropertiesRequest(address userAddress) public view returns (uint[] memory) {
        return MyReceivedPropertiesRequest[userAddress];
    }

function acceptPropertyTransfer(uint _property_id, address _requestingUser) public {
    SharePart memory requestedShare = propertyShareRequstMapping[_requestingUser][msg.sender][_property_id];
    require(requestedShare.LiquidTokenPart > 0 && requestedShare.PropertyTokenPart > 0 && properties[_property_id].isListed, "Invalid requested share");
    require(LiquidTokenbalances[msg.sender] >= requestedShare.LiquidTokenPart && PropertyTokenbalances[msg.sender] >= requestedShare.PropertyTokenPart, "Insufficient tokens");

    require(propertyLiquidToken.transfer(_requestingUser, requestedShare.LiquidTokenPart) && propertyValueToken.transfer(_requestingUser, requestedShare.PropertyTokenPart), "Failed to transfer tokens");

    // Update balances for the current owner
    LiquidTokenbalances[msg.sender] -= requestedShare.LiquidTokenPart;
    PropertyTokenbalances[msg.sender] -= requestedShare.PropertyTokenPart;
    
    // Update balances for the requesting user
    LiquidTokenbalances[_requestingUser] += requestedShare.LiquidTokenPart;
    PropertyTokenbalances[_requestingUser] += requestedShare.PropertyTokenPart;

    // Update the token shares mapping for the new owner
    SharePart storage newOwnerShares = propertyOwnersShares[_property_id][_requestingUser];
    newOwnerShares.LiquidTokenPart += requestedShare.LiquidTokenPart;
    newOwnerShares.PropertyTokenPart += requestedShare.PropertyTokenPart;

    // Update the token shares mapping for the old owner
    SharePart storage oldOwnerShares = propertyOwnersShares[_property_id][msg.sender];
    oldOwnerShares.LiquidTokenPart -= requestedShare.LiquidTokenPart;
    oldOwnerShares.PropertyTokenPart -= requestedShare.PropertyTokenPart;
    isShareOwnerMapping[_property_id][_requestingUser]=true;
    delete propertyShareRequstMapping[_requestingUser][msg.sender][_property_id];
   // Remove property from MySentPropertiesRequest and MyReceivedPropertiesRequest
    removePropertyFromMapping(MySentPropertiesRequest[_requestingUser], _property_id);
    removePropertyFromMapping(MyReceivedPropertiesRequest[msg.sender], _property_id);
}

function removePropertyFromMapping(uint[] storage propertyList, uint _property_id) private {
    for (uint i = 0; i < propertyList.length; i++) {
        if (propertyList[i] == _property_id) {
            for (uint j = i; j < propertyList.length - 1; j++) {
                propertyList[j] = propertyList[j + 1];
            }
            propertyList.pop();
            break; // Remove this line if you want to remove all occurrences of _property_id
        }
    }
}



// ------------------------------------------------ ADD PROPERTY LISTING -----------------------------------------------------------
}