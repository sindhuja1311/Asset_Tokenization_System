import { ethers } from "ethers";
import abi from '../artifacts/abi.json';
import address from '../artifacts/address.json';
import store from "../redux/store.js";
import { setWallet } from "../redux/actions/globalActions.js";

const ContractAddress = address.address;
const ContractAbi = abi.abi;


const connectWallet = async () => {
    try {
        if (!ethereum) return reportError('Please install Metamask');
        const accounts = await ethereum.request?.({ method: 'eth_requestAccounts' });
        store.dispatch(setWallet(accounts?.[0])); // Assuming setWallet is imported or defined
    } catch (error) {
        reportError(error); // Assuming reportError is defined
    }
}

const checkWallet = async () => {
    try {
        if (!ethereum) return reportError('Please install Metamask');
        const accounts = await ethereum.request?.({ method: 'eth_accounts' });

        // Monitor chain change
        ethereum.on('chainChanged', () => {
            window.location.reload();
        });

        ethereum.on('accountsChanged', async () => {
            store.dispatch(setWallet(accounts?.[0]));
            await checkWallet();
        });

        if (accounts?.length) {
            store.dispatch(setWallet(accounts[0]));
        } else {
            store.dispatch(setWallet(''));
            reportError('Please connect wallet, no accounts found.');
        }
    } catch (error) {
        reportError(error);
    }
}

const getEthereumContract = async () => {
    const accounts = await ethereum?.request?.({ method: 'eth_accounts' });
    const provider = accounts?.[0]
      ? new ethers.providers.Web3Provider(ethereum)
      : new ethers.providers.JsonRpcProvider(process.env.NEXT_APP_RPC_URL)
    const wallet = accounts?.[0] ? null : ethers.Wallet.createRandom();
    const signer = provider.getSigner(accounts?.[0] ? accounts[0] : wallet?.address);
    const contract = new ethers.Contract(ContractAddress, ContractAbi, signer);
    return contract
  }


  const addUserDetails = async (full_name, email, phone_num, aadharNumber, pan_card, pronouns) => {
    try {
        const contract = await getEthereumContract();
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
        const name=full_name;
        // Call the registerUser function on the contract with the user details
        const user = await contract.registerUser(name, email, phone_num, aadharNumber, pan_card, pronouns, { from: accounts[0] });
        console.log("New user registered:", user);
        

    } catch (error) {
        reportError(JSON.parse(JSON.stringify(error))?.reason);
        window.alert(JSON.parse(JSON.stringify(error))?.reason);
    }
}

const fetchAllUsers = async () => {
    try {
        // Get the contract instance
        const contract = await getEthereumContract();

        // Request accounts from the user
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });

        // Call the smart contract function to fetch all user addresses
        const userAddresses = await contract.ReturnAllUserList();

        // Return the array of user addresses
        return userAddresses;
    } catch (error) {
        // Handle errors
        reportError(error.message);
        console.error("Error fetching users:", error);
        // Rethrow the error or handle it as appropriate
        throw error;
    }
};

const getUserDetails = async(address) => {
    try {
        const contract = await getEthereumContract();

        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
        // Call the contract's function to check if the user is registered
        const isRegistered = await contract.isUserRegistered(address);
        if (!isRegistered) {
            throw new Error('User is not registered');
        }

        // Call the contract's function to retrieve user details
        const userDetails = await contract.UserMapping(address);
        console.log(userDetails);
        return userDetails;
    } catch (error) {
        console.error('Error fetching user details:', error);
        throw error; // Rethrow the error or handle it as appropriate
    }
}
const isUserVerified = async(user_address)=>{
    try{
        const contract = await getEthereumContract();
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
        const id=user_address;
        const status = await contract.isUserVerified(id);
        return status;
    }
    catch (error) {
        reportError(JSON.parse(JSON.stringify(error))?.reason);
        window.alert(JSON.parse(JSON.stringify(error))?.reason);
    }
}



const isUserRegistered = async(user_address)=>{
    try{
        const contract = await getEthereumContract();
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
        const addr=user_address;
        const status = await contract.isUserRegistered(addr);
        return status;
    }
    catch (error) {
        reportError(JSON.parse(JSON.stringify(error))?.reason);
        window.alert(JSON.parse(JSON.stringify(error))?.reason);
    }
}
const verifyUser=async(user_address,inspector_address)=>{
    try{
        
        const contract = await getEthereumContract();
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
        const userId=user_address;
        await contract.verifyUser(userId);
        return 'success';
    }
    catch (error) {
        reportError(JSON.parse(JSON.stringify(error))?.reason);
        window.alert(JSON.parse(JSON.stringify(error))?.reason);
    }
}

const addInspectorDetails = async(inspector_address, inspector_name, age, designation, city) => {
    try {
        const contract = await getEthereumContract();
        const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
        const addr = inspector_address;
        const name = inspector_name;
        const inspector = await contract.addPropertyInspector(addr, name, age, designation, city);
        await inspector.wait();
        console.log("Inspector added successfully - function");
    } catch (error) {
        reportError(JSON.parse(JSON.stringify(error))?.reason);
        window.alert(JSON.parse(JSON.stringify(error))?.reason);
    }
}

    const isPropertyInspector=async(id)=>{
        try{
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const inspector = await contract.isPropertyInspector(id);
            return inspector;
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const inspectorsList=async()=>{
        try{
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const inspector = await contract.ReturnAllPropertyIncpectorList();
            return inspector;
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const userRequestPropertyUpload = async (pname, propertyAddress, description, loaction, value, imagesCID, ownership_proofCID) => {
        try {
          const contract = await getEthereumContract();
          const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
          const name = pname;
          const images=imagesCID;
          const ownership_proof=ownership_proofCID;
          console.log("images", images); // Log images array for debugging
          console.log("ownership_proof", ownership_proof); // Log ownership_proof array for debugging
          const propertyDetails = await contract.addProperty(name, propertyAddress, description, loaction, value, images, ownership_proof, { from: accounts[0] });
          console.log("New property added:", propertyDetails); // Log propertyDetails for debugging
        } catch (error) {
          console.error("Error adding property:", error); // Log error for debugging
          reportError(JSON.parse(JSON.stringify(error))?.reason);
          window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
      }
      
      const fetchAllPropeties = async () => {
        try {
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const propertiesAddresses = await contract.ReturnAllPropertiesList();
            return propertiesAddresses;
        } catch (error) {
            reportError(error.message);
            console.error("Error fetching properties:", error);
            throw error;
        }
    };
    
    const getUserPropertyDetails = async (userAddress) => {
        try {
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const propertiesAddresses = await contract.getUserProperties(userAddress);
            return propertiesAddresses;
        } catch (error) {
            reportError(error.message);
            console.error("Error fetching properties:", error);
            throw error;
        }
    }
    
    
    
    const isPropertyVerified =async(id)=>{
        try{
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const status = await contract.isPropertyVerified(id);
            return status;
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }
    const verifyProperty =async(property_id)=>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const id=property_id;
            console.log("id:",id);
            await contract.verfifyProperty(id);
            return 'success';
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }
    const isPropertyOwner = async(id,userAddress) =>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const response = await contract.isPropertyOwner(id,userAddress);
            return response;
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const requestPropertyListing = async(property_id,name,loaction,images)=>{
        try{
            console.log(parseInt(property_id['_hex'],16),name,loaction,images);
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            await contract.requestPropertyListing(parseInt(property_id['_hex'],16),name,loaction,images);
            return 'requested successfully';
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const ReturnAllRequestedListingPropertiesList = async() =>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const requestList=await contract.ReturnAllRequestedListingPropertiesList();
            console.log(requestList);
            return requestList;
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const isPropertyRequested = async(property_id,userAddress) =>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const response=await contract.isPropertyRequested(property_id,userAddress);
            return response;
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }
    const AcceptListingRequest = async(property_id,userAddress) =>{
        try{
            console.log(property_id,userAddress);
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const user= await contract.isUserVerified(userAddress);
            const prop=await contract.isPropertyVerified(property_id);
            const propown=await contract.isPropertyOwner(property_id,userAddress);
            console.log(user,prop,propown);
            await contract.AcceptListingRequest(property_id,userAddress);
            return "property successfully listed in the platform";
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const getTokenBalances = async() =>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const Tokens=await contract.getTokenBalances();
             return Tokens;          
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const requestPropertyPart = async(property_id,userAddress,LiquidToken,propertyToken) =>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            await contract.requestPropertyPart(property_id,userAddress,LiquidToken,propertyToken);
            return "property Request sent successfully";          
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const returnAllListedProperties = async()=>{
        console.log("chapak");
    }
    const returnUserListedProperties =async(userAddress)=>{
        console.log("chapak");
    }


export {
    connectWallet,
    checkWallet,
    getEthereumContract,
    addUserDetails,
    fetchAllUsers,
    addInspectorDetails,
    isPropertyInspector,
    isUserVerified,
    isUserRegistered,
    verifyUser,
    inspectorsList,
    getUserDetails,
    userRequestPropertyUpload,
    fetchAllPropeties,
    getUserPropertyDetails,
    verifyProperty ,
    isPropertyVerified,
    requestPropertyListing,
    isPropertyOwner,
    ReturnAllRequestedListingPropertiesList,
    AcceptListingRequest,
    getTokenBalances,
    isPropertyRequested,
    requestPropertyPart,
    returnAllListedProperties,
    returnUserListedProperties
};
