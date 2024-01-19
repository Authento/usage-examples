"use client";

import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";

import { useAccount, useConnect, useContractWrite } from "wagmi";

import Logo from "src/components/Logo";
import KycPanel from "src/components/KycPanel";
import TxSuccess from "src/components/TxSucess";
import json from "artifacts/contracts/AuthentoOnChainAccess.sol/AuthentoOnChainAccess.json";

const Home: NextPage = () => {
  const [minted, setMinted] = useState(false);

  // Wagmi hooks
  const { address } = useAccount();
  const { connect, connectors } = useConnect();

  // Viem hooks
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as Address,
    abi: json.abi,
    functionName: "mint",
  });

  // Handle wallet connection request using the first connector
  const handleConnect = useCallback(() => {
    connect({ connector: connectors[0] });
  }, [connect, connectors]);

  // Set minted state based on data and isSuccess state
  useEffect(() => {
    setMinted(!!data && isSuccess);
  }, [data, isSuccess]);

  // Reset minted state when address changes
  useEffect(() => {
    setMinted(false);
  }, [address]);

  return (
    <div className="container">
      <Logo />
      {address ? (
        <>
          <KycPanel address={address} write={write} txLoading={isLoading} />
          {minted && data && <TxSuccess txHash={data["hash"]} />}
        </>
      ) : (
        <button className="primary-btn" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Home;
