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
    getUserDetails
};
