# Asset Tokenization System // Asset Management System

## Introduction

This project aims to create a decentralized application for property management through tokenization using ERC-20 (Fungible tokens) on the Ethereum blockchain. Each property is assigned tokens of two types
a) Value-Based Tokens
b) Liquid-Based Tokens
and there is a Platform Fee of a certain charge for an asset to be listed.

## Tokenization

The original idea was to allot tokens for a property,
i) Value-Based: each value token holds the value based on the property price.
ii) Liquid-Based: each liquid token holds the value based on the exchange value respective to the erc20 token.
every approved property will be listed on the platform and each property will be allocated an equal amount of tokens ( be 1000 ), and all 1000 tokens will be divided into 500 tokens each.

### Current Tokenization Approach

With the help of these two tokens, we will approach the tokenization concept,
However, a challenge emerged where different-cost properties resulted in the same number of tokens, creating a lack of differentiation based on market value. Additionally, the platform charges were not reflective of the property's market value.

### Example Scenario

- **Property 1:** (with 2 types of token concept)

  - Cost: 100000
  - Tokens: 1000
  - Value tokens - 500 (value of 1.5 let be)
  - Liquid Tokens - 500 (value of 1 let be)
  - Platform charge: 2% tokens or amount ( done by listing the property)

- **Property 2:** (another approach)
  - Cost: 12,33,500
  - Tokens: 1233500 // 1000 = 1233 tokens
  - Platform charge: 1233500 % 1000 = 500/- tokens or amount

Currently, the project is proceeding with a 1/- token, but this may lead to a large number of tokens being generated. Ongoing discussions and considerations are in place to explore alternative solutions that address the issues of differentiation and charges. Contributions and suggestions are encouraged to enhance the tokenization system.

Updated (April):

- Currently, we are using the two tokens concept but are welcomed

# Tokenization Challenges and Ongoing Considerations

## Ongoing Considerations

The current approach is to use 2 types of tokens, but this may result in a large number of tokens needing to be generated. The project team is actively exploring alternative solutions to address these challenges. Contributions and suggestions from the community are highly encouraged to enhance the tokenization system.

Your insights and proposed solutions are crucial as the project evolves. Feel free to provide feedback and contribute to finding a more effective tokenization mechanism that ensures differentiation based on market value and aligns platform charges accordingly.

Exploring UNISWAP to manage token generation

## Technologies Used

1. **Blockchain Platforms and Technologies:**
   - Ethereum blockchain
   - Solidity for smart contracts
   - Sepholia testnet for ERC currency
   - Ether.js library
   - Metamask wallet or any wallet of choice
2. **User Interface:**
   - Reactjs + Vite, Express.js, Node.js, Redux, TailWind CSS

# Functionality

## Admin Functions

- **Approve users**: Admins can approve new user registrations.
- **View assets**: Admins can view all assets in the system.
- **List assets**: Admins can list assets for sale or investment.
- **Approve assets**: Admins can approve asset listings or uploads.

## User Functions

- **View assets**: Users can view all available assets.
- **Owned assets**: Users can view assets they own.
- **Common properties**: Users can view properties they co-own with others.
- **Sent Requests**: Users can view requests they have sent to other users.
- **Received Requests**: Users can view requests they have received from other users.
- **Request Asset Upload**: Users can request to upload new assets.
- **Assets in process (verified or listed)**: Users can view assets that are either verified or listed for sale/investment.


## Process

1. **Asset Request:**
   - Users submit requests to register assets on the platform.
2. **Admin Approval:**
   - admin validates asset authenticity and government approval.
3. **Successful Registration:**
   - Assets are successfully registered on the platform after 3rd party approval.
4. **Asset Management:**
   - Users can trade and view assets.

## Smart Contract Attributes

### User Attributes

- Metamask address
- Name
- email
- Phone number
- Aadhar, PAN, pronouns
- verified
### Admin Attributes

- Metamask address
- Name
- age
- designation
- City

### Asset Attributes

- Unique ID
- Name
- Address
- Description
- Location
- Image
- verified
- listed
- Owner address
- Value
- Ownership proof

### Admin Functions

- Approve users
- View assets
- List assets
- Approve assets

### User Functions

- View assets
- Owned assets
- Common properties
- Sent Requests
- Received Requests
- Request Asset Upload
- Assets in process (verified or listed)

_Contributions are welcome to enhance and improve the tokenization system._
