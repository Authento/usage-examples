require("dotenv").config();
const { http, createPublicClient, createWalletClient } = require("viem");
const { privateKeyToAccount } = require("viem/accounts");
const chains = require("viem/chains");
const json = require("../artifacts/contracts/AuthentoOnChainAccess.sol/AuthentoOnChainAccess.json");

// Ensure required environment variables are set
if (!process.env.NEXT_PUBLIC_CHAIN || !process.env.SIGNER_PRIVATE_KEY) {
  console.error("Required environment variable is undefined");
  process.exit(1);
}

// Create public and wallet clients for contract deployment
const account = privateKeyToAccount(`0x${process.env.SIGNER_PRIVATE_KEY}`);
const chain = chains[process.env.NEXT_PUBLIC_CHAIN];
const publicClient = createPublicClient({
  chain,
  transport: http(
    process.env.NEXT_PUBLIC_RPC_URL || chain.rpcUrls.default.http[0]
  ),
});
const walletClient = createWalletClient({
  account,
  chain,
  transport: http(
    process.env.NEXT_PUBLIC_RPC_URL || chain.rpcUrls.default.http[0]
  ),
});

const main = async () => {
  console.log("Deploying contract. Please wait...");
  const hash = await walletClient.deployContract({
    abi: json.abi,
    args: [account.address],
    bytecode: json.bytecode,
  });
  const receipt = await publicClient.waitForTransactionReceipt({ hash });

  console.log(`Contract deployed to: ${receipt.contractAddress}`);
  console.log(
    "Please set NEXT_PUBLIC_CONTRACT_ADDRESS in the .env file to the address above."
  );
};

main().catch((error) => {
  console.error(error);
  process.exit(1); // Stop process on error
});
