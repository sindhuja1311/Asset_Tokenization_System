# Asset Tokenization System // Asset Management System

## Introduction

This project aims to create a decentralized application for property management through tokenization using ERC-20 (Fungible tokens) on the Ethereum blockchain. Each property is assigned tokens of two types
a) Value Based Tokens
b) Liquid Based Tokens
and there is a Platform Fee of a certain charge for an asset to be listed.

## Tokenization

The original idea was to allot tokens for a property,
i) Value Based : each value token holds the value based on the property price .
ii) Liquid Based : each liquid token holds te value based on the exchange value with respective to erc20 token.
every apporved property will be listed into the platform and each property will be allocated with equal amount of tokens (be 1000) , and all 1000 tokens will be divided to 500 tokens each.

### Current Tokenization Approach

With the help of these two tokens we will approach the tokenization concept ,
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

Updated (22nd feb):

- Currently we are using the two tokens concept but are welcomed

# Tokenization Challenges and Ongoing Considerations

## Challenges in Tokenization

The initial idea was to assign a value of 1000/- to each token. However, challenges arose when different-cost properties resulted in the same number of tokens, leading to a lack of differentiation based on market value. Additionally, the platform charges were not reflective of the property's market value.

In this scenario, both Property 1 and Property 2 have different costs but are worth the same tokens. This lack of differentiation based on market value poses a significant issue, as distinct market-valued properties should not have the same number of tokens.

Additionally, there is a concern with charges. If, for instance, **Property 1** costs 12,33,900/- and **Property 2** costs 15,00,900/-, both would generate the same platform charge, which is undesirable. Higher-priced properties should ideally incur higher platform charges.

## Ongoing Considerations

The current approach is to use 1/- tokens, but this may result in a large number of tokens being generated. The project team is actively exploring alternative solutions to address these challenges. Contributions and suggestions from the community are highly encouraged to enhance the tokenization system.

Your insights and proposed solutions are crucial as the project evolves. Feel free to provide feedback and contribute to finding a more effective tokenization mechanism that ensures differentiation based on market value and aligns platform charges accordingly.

## Technologies Used

1. **Blockchain Platforms and Technologies:**
   - Ethereum blockchain
   - Solidity for smart contracts
   - Sepholia testnet for ERC currency
   - Ether.js library
   - Metamask wallet or any wallet of choice
2. **User Interface:**
   - Reactjs + Vite, Express.js, Node.js , Redux , TailWind CSS

## Functionality

### Admin Functions

- **Add Asset:**
  - Create assets based on specified properties.
- **View Assets:**
  - View all assets on the platform with filter options (e.g., asset ID, location).
- **Update Assets:**
  - Modify asset details, including updates to market value.
- **Approve Assets:**
  - Assets go through a 3rd-party admin approval process before registration on the platform.

### User Functions

- **View Owned Assets:**
  - Users can view their owned assets.
- **Explore and Invest:**
  - Explore and invest in other users' assets.
- **Shared Assets:**
  - View shared assets and ownership percentages.
- **Transaction History:**
  - Access transaction history.
- **Assets for Sale:**
  - View assets listed for sale.
- **Asset Status:**
  - Track assets in the process of being bought or undergoing approval.
- **Auction Participation:**
  - Participate in auctions for assets.

## Process

1. **Asset Request:**
   - Users submit requests to register assets on the platform.
2. **3rd Party Approval:**
   - 3rd party admin validates asset authenticity and government approval.
3. **Successful Registration:**
   - Assets are successfully registered on the platform after 3rd party approval.
4. **Asset Management:**
   - Users can buy, sell, share, update, and view assets.

## Smart Contract Attributes

### User Attributes

- Metamask address
- Name
- Phone number
- Aadhar, PAN
- Assets up for sale
- Owned assets with share percentage
- Sold assets

### Asset Attributes

- Unique ID
- Name
- Address
- Description
- Location
- Image
- Total owners
- Ownership percentage
- Value
- Owner details
- Ownership proof

### Admin Functions

- Add asset
- View assets
- Update assets
- Approve assets

### User Functions

- View assets
- Owned assets
- Common properties
- Transaction history
- Assets up for sale
- Auction
- Assets in process

_Contributions are welcome to enhance and improve the tokenization system._
