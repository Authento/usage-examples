# Authento account-based verification example
This is react/nextjs demo implementation of Authento account-based verification flow.

## Prerequisites

- Node.js version 18 or above
- Authento API key/secret pair generated from [here](https://dashboard.authento.io/settings).
- Configure Authento JWT Secret [here](https://dashboard.authento.io/settings).

## Installation

1. Clone the repository from [here](https://github.com/Authento/usage-examples).

2. Navigate to the account-based folder under the cloned repository.

3. Install the dependencies by running the following command:

        npm install

4. Copy the .env.example file and rename it to .env. Configure the .env file as follows:
    - AUTHENTO_API_KEY: Your Authento API key
    - AUTHENTO_API_SECRET: Your Authento API secret
    - AUTHENTO_JWT_SECRET: Your Authento JWT secret
    - NEXTAUTH_SECRET: Encryption key for authentication token. You can generate the secret by running "openssl rand -base64 32" in a terminal.
    - NEXTAUTH_URL: The canonical URL of your site
    - NEXT_PUBLIC_DOMAIN_NAME: Your domain name registered with Autwhento. Please contact us if you are unsure of its value.


## Usage

To start the server in development mode, run the following command:

    npm run dev

The server will start running at http://localhost:3000.

## Dependencies

- authento-react@^1.0.9
- jsonwebtoken@^9.0.2
- next@13.4.7
- next-auth@^4.23.2
- react@18.2.0
- react-dom@18.2.0

## Bugs and Issues

If you encounter any bugs or issues, please report them [here](https://github.com/Authento/usage-examples/issues).

## License

This project is licensed under the ISC License. See the LICENSE file for more information.