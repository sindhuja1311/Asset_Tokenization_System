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
            console.log(propertiesAddresses);
            return propertiesAddresses;
        } catch (error) {
            reportError(error.message);
            console.error("Error fetching properties:", error);
            throw error;
        }
    };
    
    const getPropertyDetails = async (id) => {
        try {
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const propertiesAddresses = await contract.ReturnAllPropertiesList();
            const ownedProperties = propertiesAddresses.filter(property => {
                return parseInt(property.property_id['_hex'],16)===id;
            });
            return ownedProperties;
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
            const propertiesAddresses = await contract.ReturnAllPropertiesList();
            console.log(propertiesAddresses);
            // Filter properties owned by the user
            const ownedProperties = propertiesAddresses.filter(property => {
                return property.owner.toLowerCase() === userAddress.toLowerCase();
            });
            console.log("functions lo:", ownedProperties);
            return ownedProperties;
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

    const ReturnAllRequestedListingPropertiesList = async () => {
        try {
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const propertiesList = await contract.ReturnAllPropertiesList();
            // Array to store property listing details
            const propertyListings = [];
    
            // Iterate over each property in propertiesList
            for (const property of propertiesList) {
                // Convert the hex ID to number
                const propertyId = parseInt(property.property_id['_hex'],16);
    
                // Call getPropertyListing to get listing details for the property
                const listingDetails = await contract.getPropertyListing(propertyId);
    
                // Add the listing details to propertyListings array
                propertyListings.push(listingDetails);
            }
    
            console.log("requested ones:",propertyListings);
            return propertyListings;
        } catch (error) {
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
    
    const getPropertyShareofOwners = async(property_id,userAddress) => {
        try{
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const response=await contract.propertyOwnersShares(property_id,userAddress);
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
            const propertiesAddresses = await contract.ReturnAllPropertiesList();
            console.log(propertiesAddresses);
            
            // Filter properties owned by the user
            const ownedProperties = propertiesAddresses.filter(property => {
                return parseInt(property.property_id['_hex'], 16) === property_id;
            });
            if(ownedProperties[0].isListed==false){
            await contract.AcceptListingRequest(property_id);
            return "property successfully listed in the platform";
        }
            else{
                return "already listed";
            }
            
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const getTokenBalances = async(userAddress) =>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const Tokens=await contract.getTokenBalances(userAddress);
             return Tokens;          
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    const requestPropertyPart = async (property_id, userAddress, LiquidToken, propertyToken) => {
        try {
            console.log(property_id, userAddress, LiquidToken, propertyToken);
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const status= await contract.propertyShareRequstMapping(accounts[0],userAddress,property_id);
            console.log(status);
            const dets=await getPropertyDetails(property_id);
            console.log(dets);
            if(dets[0].isListed){
            if (parseInt(status.LiquidTokenPart['_hex'],16) >0 || parseInt(status.PropertyTokenPart['_hex'],16)>0) {
                // If it exists, return a message
                return "Cannot process until the current request is pending. Please try again later.";
            }
            else{
            await contract.requestPropertyPart(property_id, userAddress, LiquidToken, propertyToken);
            return "Property request sent successfully";
            }}
            else{
                return "illegal";
            }
        } catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }
    
    const getMySentPropertiesRequest = async (userAddress) => {
        try {
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const propertyIds = await contract.getMySentPropertiesRequest(userAddress);
            console.log(propertyIds);
            const decimalPropertyIds = propertyIds.map(id => parseInt(id["_hex"], 16));
            const shares = await Promise.all(decimalPropertyIds.map(async id => {
                const users= await contract.ReturnAllUserList();
                for (const user of users){ // Fix: Declare 'user' properly
                    console.log(user);
                    const share = await contract.propertyShareRequstMapping(userAddress,user, id);
                    console.log(share);
                    if(parseInt(share.LiquidTokenPart["_hex"],16)>0 || parseInt(share.PropertyTokenPart["_hex"],16)>0 ){
                        return {
                            propertyId: id,
                            user:user,
                            liquidTokenPart: parseInt(share[0]["_hex"],16),
                            propertyTokenPart: parseInt(share[1]["_hex"],16)
                        }
                    }
                }
            }));
            console.log(shares);
            return shares;
        } catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }
    
    
    

    const getMyReceivedPropertiesRequest = async (userAddress) => {
        try {
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            
            // Get the property IDs received by the user
            const propertyIds = await contract.getMyReceivedPropertiesRequest(userAddress);
            const decimalPropertyIds = propertyIds.map(id => parseInt(id["_hex"], 16));
            
            // Get all registered user addresses
            const allUsers = await contract.ReturnAllUserList();
            console.log(decimalPropertyIds,allUsers);
            // Create an array to store property details
            const properties = [];
    
            // Iterate over each property ID
            for (const id of decimalPropertyIds) {
                // Iterate over each user to find the matching property share request
                for (const user of allUsers) {
                    console.log(id,user);
                    const sharePart = await contract.propertyShareRequstMapping(user,userAddress, id);
                    console.log(sharePart);
                    const LiquidTokenPart= parseInt(sharePart[0]["_hex"],16);
                    const PropertyTokenPart= parseInt(sharePart[1]["_hex"],16);
                    if (LiquidTokenPart > 0 || PropertyTokenPart > 0) {
                        properties.push({ property_id: id, requested_address: user, LiquidTokenPart, PropertyTokenPart });
                    }
                }
            }
            console.log(properties);
            return properties;
        } catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }
    
    const acceptPropertyTransfer =async(property_id,requestingUser)=>{
        try{
            
            const contract = await getEthereumContract();
            const accounts = await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const dets=await getPropertyDetails(property_id);
            console.log(dets[0].isListed);
            if(dets[0].isListed){
            await contract.acceptPropertyTransfer(property_id,requestingUser);
            return "transfer done successfully!!";
        }
            else{
                return "illegal!";
            }          
        }
        catch (error) {
            reportError(JSON.parse(JSON.stringify(error))?.reason);
            window.alert(JSON.parse(JSON.stringify(error))?.reason);
        }
    }

    // Function to check if an address is a share owner for a specific property ID
        const isAddressShareOwner=async(propertyId, userAddress)=> {
            const contract =  await getEthereumContract();
            const accounts =  await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const response= contract.isShareOwnerMapping(propertyId, userAddress);
            return response;
        }

        const sharesOwner=async(propertyId, userAddress)=> {
            const contract =  await getEthereumContract();
            const accounts =  await ethereum?.request?.({ method: 'eth_requestAccounts' });
            const response=await  contract.propertyOwnersShares(propertyId, userAddress);
            console.log(response);
        }
        const getPropertyShareofOwnersofProperty = async (property_id) => {
            try {
                const contract = await getEthereumContract();
                const allUsers = await contract.ReturnAllUserList();
                const shareDetails = [];
        
                // Iterate over each user to check if they own shares of the property
                for (const user of allUsers) {
                    const shares = await contract.propertyOwnersShares(property_id, user);
                    const LiquidTokenPart = parseInt(shares.LiquidTokenPart["_hex"], 16);
                    const PropertyTokenPart = parseInt(shares.PropertyTokenPart["_hex"], 16);
        
                    // Check if both LiquidTokenPart and PropertyTokenPart are not zero
                    if (LiquidTokenPart !== 0 || PropertyTokenPart !== 0) {
                        // Check if the user is the owner of the property
                        const isOwner = await isPropertyOwner(property_id, user);
                        const isShareOwner = await isAddressShareOwner(property_id, user);
                        shareDetails.push({
                            user: user,
                            LiquidTokenPart: LiquidTokenPart,
                            PropertyTokenPart: PropertyTokenPart,
                        });
                    }
                }
                console.log(shareDetails);
                return shareDetails;
            } catch (error) {
                reportError(JSON.parse(JSON.stringify(error))?.reason);
                window.alert(JSON.parse(JSON.stringify(error))?.reason);
            }
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
    getMySentPropertiesRequest,
    getMyReceivedPropertiesRequest,
    acceptPropertyTransfer,
    getPropertyShareofOwners,
    getPropertyDetails,
    isAddressShareOwner,
    sharesOwner,
    getPropertyShareofOwnersofProperty
};
