import { useCallback } from "react";

import { useSignature, useStatus, useVerifyPopup } from "authento-react";
import {
  useContractWrite,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

import { shortenEthAddress } from "src/utils/shortenEthAddress";
import { capitalize } from "src/utils/capitalize";
import { chain } from "src/constants/blockExplorer";

interface KycPanelProps {
  address: Address;
  write: ReturnType<typeof useContractWrite>["write"];
  txLoading: boolean;
}

const KycPanel = ({ address, write, txLoading }: KycPanelProps) => {
  // Wagmi hooks
  const { chain: activeChain } = useNetwork();
  const { isLoading: chainSwitching, switchNetworkAsync } = useSwitchNetwork({
    chainId: chain.id,
  });
  const { disconnect } = useDisconnect();

  // Authento hooks
  const { verifyBasic } = useVerifyPopup({
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME as string,
    messageText: process.env.NEXT_PUBLIC_MESSAGE_TEXT as string,
    authentoUrl: process.env.NEXT_PUBLIC_AUTHENTO_URL as string,
  });
  const { status, type } = useStatus({
    endpoint: "/api/userinfo/basic",
  });
  const { refetch: getSignature } = useSignature({
    endpoint: "/api/signature",
    onSuccess: (expireTs, signature) => {
      console.log({ expireTs, signature });
      // On successful fetch of signature, execute smart contract function
      write?.({ args: [BigInt(expireTs), signature] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  const handleMint = useCallback(async () => {
    if (txLoading || chainSwitching) return;
    try {
      if (activeChain?.id !== chain.id) {
        await switchNetworkAsync?.();
      }
      await getSignature();
    } catch (error) {
      console.error(error);
    }
  }, [
    activeChain?.id,
    chainSwitching,
    getSignature,
    switchNetworkAsync,
    txLoading,
  ]);

  return (
    <div className="panel">
      <table>
        <tbody>
          <tr>
            <td width={150} colSpan={2}>
              <span className="address">{`${shortenEthAddress(address)}`}</span>
              <span className="user-type">{capitalize(type)}</span>
            </td>
            <td>
              <button
                type="button"
                className="secondary-btn"
                onClick={handleDisconnect}
              >
                Disconnect
              </button>
            </td>
          </tr>
          <tr>
            <td>
              <span className="status">BASIC: </span>
            </td>
            <td>
              <span className={`status ${status?.basic.toLowerCase()}`}>
                {capitalize(status?.basic || "UNKNOWN")}
              </span>
            </td>
            <td>
              <button
                type="button"
                className="primary-btn"
                onClick={verifyBasic}
                disabled={
                  !(
                    status?.basic === "UNVERIFIED" ||
                    status?.basic === "INFO_REQUIRED"
                  )
                }
              >
                Verify
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />
      <button
        type="button"
        disabled={status?.basic !== "VERIFIED"}
        className="primary-btn mint"
        onClick={handleMint}
      >
        {chainSwitching || txLoading ? <span className="spinner" /> : "Mint"}
      </button>
    </div>
  );
};

export default KycPanel;
