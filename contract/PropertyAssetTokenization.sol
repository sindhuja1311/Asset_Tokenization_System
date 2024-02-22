// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MyContractFinal {
    address public contract_owner;
    IERC20 public propertyValueToken;
    IERC20 public propertyLiquidToken;

    constructor() public {
        contract_owner = msg.sender;
    }

    uint256 public platformFeePercentage = 2; // Platform fee percentage

    // Contract addresses
    address private propertyValueToken_address =
        0x1798982f0fCA6B7772a208B8831fA1B086CFf08e;
    address private propertyLiquidToken_address =
        0xD5e0F15a0730839027f656408B4E81433B0998bA;

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

    // MAPPING
    mapping(address => bool) RegisteredUserMapping;
    mapping(uint256 => address[]) allUsersList;
    mapping(uint256 => address) AllUsers;
    mapping(address => User) public UserMapping;
    mapping(address => bool) RegisteredInspectorMapping;
     mapping(uint => address[]) allPropertyInspectorList;
       mapping(address => PropertyInspector) public InspectorMapping;

    uint256 inspectorsCount;
    uint256 public userCount;

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



    function addPropertyInspector(address _addr,string memory _name, uint _age, string memory _designation,string memory _city) public returns(bool){
        if(contract_owner!=msg.sender)
            return false;
        require(contract_owner==msg.sender);
        RegisteredInspectorMapping[_addr]=true;
        allPropertyInspectorList[1].push(_addr);
        InspectorMapping[_addr] = PropertyInspector(inspectorsCount,_addr,_name, _age, _designation,_city);
        return true;
    }

    function removePropertyInspector(address _addr) public{
        require(msg.sender==contract_owner,"You are not contractOwner");
        require(RegisteredInspectorMapping[_addr],"Property Inspector not found");
        RegisteredInspectorMapping[_addr]=false;


        uint len=allPropertyInspectorList[1].length;
        for(uint i=0;i<len;i++)
        {
            if(allPropertyInspectorList[1][i]==_addr)
            {
                allPropertyInspectorList[1][i]=allPropertyInspectorList[1][len-1];
                allPropertyInspectorList[1].pop();
                break;
            }
        }
    }

     function ReturnAllPropertyIncpectorList() public view returns(address[] memory)
    {
        return allPropertyInspectorList[1];
    }







}