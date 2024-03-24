// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


contract MyContractFinal {

address private propertyValueToken_address =
        0xE8167A56d42f2B13b0D266f03aC993Ff8111DCCF;
    address private propertyLiquidToken_address =
        0x7E6ACa803D0dF159aDC08389dDb119A0B9Fe24E4;

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

    mapping(address => mapping(uint => SharePart)) public propertyShareRequstMapping;

    uint256 inspectorsCount;
    uint256 public userCount;
    uint256 propertiesCount;
    // uint256 propertyRegistrationRequestCount;
    uint256 public propertyOwnerTokenAmount = 50; // Amount of tokens to transfer to property owner
    uint256 public daoBalance;

    uint256 propertiesListingRequestCount;

    function isContractOwner(address _addr) public view returns (bool) {
        if (_addr == contract_owner) return true;
        else return false;
    }

    function changeContractOwner(address _addr) public {
        require(msg.sender == contract_owner, "you are not contractOwner");

        contract_owner = _addr;
    }

    function isPropertyInspector(address _id) public view returns (bool) {
        if (RegisteredInspectorMapping[_id]) {
            return true;
        } else {
            return false;
        }
    }

    function getPropertyDetails(uint property_id) public view returns (PropertyStruct memory){
        require(isPropertyInspector(msg.sender));
        return properties[property_id];
    }

    //-----------------------------------------------User-----------------------------------------------

    function isUserRegistered(address _addr) public view returns (bool) {
        if (RegisteredUserMapping[_addr]) {
            return true;
        } else {
            return false;
        }
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

    function removePropertyInspector(address _addr) public {
        require(msg.sender == contract_owner, "You are not contractOwner");
        require(
            RegisteredInspectorMapping[_addr],
            "Property Inspector not found"
        );
        RegisteredInspectorMapping[_addr] = false;

        uint256 len = allPropertyInspectorList[1].length;
        for (uint256 i = 0; i < len; i++) {
            if (allPropertyInspectorList[1][i] == _addr) {
                allPropertyInspectorList[1][i] = allPropertyInspectorList[1][
                    len - 1
                ];
                allPropertyInspectorList[1].pop();
                break;
            }
        }
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
        _images,
        _ownership_proof,
        msg.sender
        );
        MyProperties[msg.sender].push(propertiesCount);
        allPropertiesList[propertiesCount] = properties[propertiesCount];
    }

    function ReturnAllPropertiesList() public view returns (PropertyStruct[] memory) {
            require(isPropertyInspector(msg.sender));
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


    function getUserProperties(address userAddress) public view returns (PropertyStruct[] memory) {
    uint[] memory propertyIds = MyProperties[userAddress];
    PropertyStruct[] memory userProperties = new PropertyStruct[](propertyIds.length);

    for (uint i = 0; i < propertyIds.length; i++) {
        uint propertyId = propertyIds[i];
        userProperties[i] = properties[propertyId];
    }

    return userProperties;
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


function isPropertyRequested(uint _property_id, address userAddress) public view returns(bool) {
    // Check if there exists a property listing request for the given property id
    return propertiesListingMapping[userAddress].property_id == _property_id;
}

    function ReturnAllRequestedListingPropertiesList() public view returns (PropertyListingStruct[] memory){
        PropertyListingStruct[] memory allListProperties = new PropertyListingStruct[](propertiesListingRequestCount); // Create an array to store all properties
        for (uint i = 1; i <= propertiesListingRequestCount; i++) {
            allListProperties[i - 1] = allPropertiesListingRequestMapping[i]; // Assign each property to the array
        }
        return allListProperties;
        // will return all properties
    }


    function AcceptListingRequest(uint _property_id , address userAddress) external payable {
        require(isUserVerified(userAddress) && isPropertyVerified(_property_id) && isPropertyOwner(_property_id, userAddress) && isPropertyInspector(msg.sender), "Invalid request");
        propertyValueToken.transferFrom(msg.sender, properties[_property_id].owner, propertyOwnerTokenAmount);
        propertyLiquidToken.transferFrom(msg.sender, properties[_property_id].owner, propertyOwnerTokenAmount);
        LiquidTokenbalances[msg.sender]=propertyOwnerTokenAmount;
        PropertyTokenbalances[msg.sender]=propertyOwnerTokenAmount;
    }

    function getTokenBalances() public view returns(uint256, uint256){
        return (LiquidTokenbalances[msg.sender], PropertyTokenbalances[msg.sender]);
    }

    // request property part 

    function requestPropertyPart(uint _property_id,address userAddress, uint LiquidToken, uint propertyToken) public {

        require(isUserVerified(userAddress) && isPropertyVerified(_property_id) && isPropertyOwner(_property_id, userAddress) , "Invalid request");
        propertyShareRequstMapping[userAddress][_property_id] = SharePart(LiquidToken, propertyToken);
        MySentPropertiesRequest[msg.sender].push(_property_id);
        MyReceivedPropertiesRequest[properties[_property_id].owner].push(_property_id);

    }












    // ------------------------------------------------ ADD PROPERTY LISTING -----------------------------------------------------------
}