# Authento Python backend example

## Prerequisites

- Python version 3.8 or above
- Authento API key/secret pair generated from [here](https://dashboard.authento.io/settings).

## Installation

1. Clone the repository from [here](https://github.com/Authento/usage-examples).

2. Navigate to the address-based/backend/python folder under the cloned repository.

3. Create and activate a virtual environment.

4. Install the dependencies by running the following command:

        python -m pip install -r requirements.txt

5. In the file main.py, replace YOUR_API_KEY and YOUR_API_SECRET with your actual API key and API secret.

## Usage

To start the server, run the following command:

    uvicorn main:app

The server will start running at http://127.0.0.1:8000.

## Dependencies

- requests
- fastapi
- uvicorn

## Bugs and Issues

If you encounter any bugs or issues, please report them [here](https://github.com/Authento/usage-examples/issues).

## License

This project is licensed under the ISC License. See the LICENSE file for more information.