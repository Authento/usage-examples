"use client";

import { useCallback } from "react";
import type { NextPage } from "next";
import { useCosmos } from "authento-react";
import { useAccount, useConnect } from "wagmi";

import { ConnectPanel } from "@/components/panels/ConnectPanel";
import { CosmoPanel } from "@/components/panels/CosmoPanel";
import { EthPanel } from "@/components/panels/EthPanel";

const Home: NextPage = () => {
  // Wagmi hooks
  const { connect: connectEth, connectors } = useConnect();
  const { address: ethAddress } = useAccount();

  //Cosmos hooks
  const {
    address: cosmosAddress,
    connect: connectCosmos,
    disconnect: disconnectCosmos,
  } = useCosmos(process.env.NEXT_PUBLIC_COSMOS_CHAIN_ID);

  // Handlers for connect wallet buttons
  const handleEthConnect = useCallback(() => {
    connectEth({ connector: connectors[0] });
  }, [connectEth, connectors]);

  const handleCosmosConnect = useCallback(() => {
    connectCosmos("keplr");
  }, [connectCosmos]);

  // Render the component
  return (
    <div className="container">
      <img
        id="logo"
        src="/authento.svg"
        alt="Authento Logo"
        width={386}
        height={45}
      />
      {ethAddress ? (
        <EthPanel address={ethAddress} />
      ) : cosmosAddress ? (
        <CosmoPanel address={cosmosAddress} disconnect={disconnectCosmos} />
      ) : (
        <ConnectPanel
          handleEthConnect={handleEthConnect}
          handleCosmosConnect={handleCosmosConnect}
        />
      )}
    </div>
  );
};

export default Home;
