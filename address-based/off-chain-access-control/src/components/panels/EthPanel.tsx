"use client";

import { useCallback, useState } from "react";
import { useStatus, useVerifyPopup } from "authento-react";
import { useDisconnect } from "wagmi";
import { capitalize } from "@/utils/capitalize";
import { shortenEthAddress } from "@/utils/shortenEthAddress";
import { VerifiactionTypeSelector } from "@/components/VerificationTypeSelector";

interface EthPanelProps {
  address: `0x${string}`;
}

export const EthPanel = ({ address }: EthPanelProps) => {
  const [verificationType, setVerificationType] =
    useState<VerificationType>("INDIVIDUAL");

  // Wagmi hooks
  const { disconnect } = useDisconnect();

  // Authento hooks
  const { verifyBasic, verifyPoa } = useVerifyPopup({
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME as string,
    messageText: process.env.NEXT_PUBLIC_MESSAGE_TEXT as string,
    authentoUrl: process.env.NEXT_PUBLIC_AUTHENTO_URL as string,
    userType: verificationType,
  });

  const { status, type } = useStatus({
    endpoint: "/api/userinfo/basic",
  });

  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  return (
    <>
      {!type && (
        <VerifiactionTypeSelector
          verificationType={verificationType}
          setVerificationType={setVerificationType}
        />
      )}
      <div className="panel">
        <table>
          <tbody>
            <tr>
              <td width={150} colSpan={2}>
                <span className="address">{`${shortenEthAddress(
                  address
                )}`}</span>
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
            <tr>
              <td>
                <span className="status">POA:</span>
              </td>
              <td>
                <span className={`status ${status?.poa.toLowerCase()}`}>
                  {capitalize(status?.poa || "UNKNOWN")}
                </span>
              </td>
              <td>
                <button
                  type="button"
                  className="primary-btn"
                  onClick={verifyPoa}
                  disabled={
                    !(
                      status?.basic === "VERIFIED" &&
                      (status?.poa === "UNVERIFIED" ||
                        status?.poa === "INFO_REQUIRED")
                    )
                  }
                >
                  Verify
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
