"use client";

import { useCosmosVerifyPopup, useStatus } from "authento-react";
import { capitalize } from "@/utils/capitalize";
import { shortenCosmosAddress } from "@/utils/shortenCosmosAddress";

interface CosmosPanelProps {
  address: string;
  disconnect: () => void;
}

export const CosmoPanel = ({ address, disconnect }: CosmosPanelProps) => {
  // Cosmo hooks

  // Authento hooks
  const { verifyBasic, verifyPoa } = useCosmosVerifyPopup({
    chainId: process.env.NEXT_PUBLIC_COSMOS_CHAIN_ID,
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME as string,
    messageText: process.env.NEXT_PUBLIC_MESSAGE_TEXT as string,
    authentoUrl: process.env.NEXT_PUBLIC_AUTHENTO_URL as string,
    // Set default userType as required
    // userType: "INDIVIDUAL",
  });
  const { status, type } = useStatus({
    endpoint: "/api/userinfo/basic",
    address,
  });

  return (
    <div className="panel">
      <table>
        <tbody>
          <tr>
            <td width={180} colSpan={2}>
              <span className="address">
                {shortenCosmosAddress(address || "")}
              </span>
              <span className="user-type">{capitalize(type)}</span>
            </td>
            <td>
              <button
                type="button"
                className="secondary-btn"
                onClick={disconnect}
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
  );
};
