# Authento off-chain access control example
This is a minimal react/nextjs implementation of Authento addressed-based off-chain access control.

## Prerequisites

- Node.js version 18 or above
- Authento API key/secret pair generated from [here](https://dashboard.authento.io/settings).

## Installation

1. Clone the repository from [here](https://github.com/Authento/usage-examples).

2. Navigate to the addressed-based/off-chain-access-control folder under the cloned repository.

3. Install the dependencies by running the following command:

        npm install

4. Copy the .env.example file and rename it to .env. Configure the .env file as follows:
    - AUTHENTO_API_KEY: Your Authento API key
    - AUTHENTO_API_SECRET: Your Authento API Secret
    - NEXT_PUBLIC_DOMAIN_NAME: Your domain name registered with Autwhento. Please contact us if you are unsure of its value.


## Usage

To start the server in development mode, run the following command:

    npm run dev

The server will start running at http://localhost:3000.

## Dependencies

- authento-react@^1.0.1
- next@13.4.7
- react@18.2.0
- react-dom@18.2.0
- uuid@^9.0.0
- wagmi@^1.3.5

## Bugs and Issues

If you encounter any bugs or issues, please report them [here](https://github.com/Authento/usage-examples/issues).

## License

This project is licensed under the ISC License. See the LICENSE file for more information.