# Authento on-chain access control example
This is a minimal react/nextjs implementation of Authento addressed-based on-chain access control.

## Prerequisites

- Node.js version 18 or above
- Authento API key/secret pair generated from [here](https://demo-dashboard.authento.io/settings).

## Installation

1. Clone the repository from [here](https://github.com/Authento/usage-examples).

2. Navigate to the addressed-based/on-chain-access-control folder under the cloned repository.

3. Install the dependencies by running the following command:

        npm install

4. Copy the .env.example file and rename it to .env. Configure the .env file as follows:
    - AUTHENTO_API_KEY: Your Authento API key
    - AUTHENTO_API_SECRET: Your Authento API Secret
    - SIGNER_PRIVATE_KEY: Private key of your signer address
    - NEXT_PUBLIC_CHAIN: The EVM-compatible chain on which the smart contract should be deployed
    - NEXT_PUBLI_RPC_URL: The http URL of the JSON-RPC API
    - NEXT_PUBLIC_CONTRACT_ADDRESS: Leave this blank for now
    - NEXT_PUBLIC_DOMAIN_NAME: Your domain name registered with Authento. Please contact us if you are unsure of its value.

5. Compile and deploy the smart contract by running the following command:

        npm run deploy

6. Update the .env file as follow:
    - NEXT_PUBLIC_CONTRACT_ADDRESS: The address of the contract deployed in the previous step.


## Usage

To start the server in development mode, run the following command:

    npm run dev

The server will start running at http://localhost:3000.

## Dependencies

- authento-react@^1.0.12
- next@13.4.7
- react@18.2.0
- react-dom@18.2.0
- viem@^1.19.8
- wagmi@^1.4.7

## Bugs and Issues

If you encounter any bugs or issues, please report them [here](https://github.com/Authento/usage-examples/issues).

## License

This project is licensed under the ISC License. See the LICENSE file for more information.