"use client";

import { useCallback } from "react";
import type { NextPage } from "next";

import { useStatus, useVerifyPopup } from "authento-react";
import { useAccount, useConnect, useDisconnect } from "wagmi";

import { shortenEthAddress } from "@/utils/shortenEthAddress";
import { capitalize } from "@/utils/capitalize";

const Home: NextPage = () => {
  // Wagmi hooks
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  // Authento hooks
  const { verifyBasic, verifyPoa } = useVerifyPopup({
    domainName: process.env.NEXT_PUBLIC_DOMAIN_NAME as string,
    messageText: process.env.NEXT_PUBLIC_MESSAGE_TEXT as string,
    authentoUrl: process.env.NEXT_PUBLIC_AUTHENTO_URL as string,
    // Set default userType as required
    // userType: "INDIVIDUAL",
  });
  const { status, type } = useStatus({
    endpoint: "/api/userinfo/basic",
  });

  // Handle connect wallet button click
  const handleConnect = useCallback(() => {
    connect({ connector: connectors[0] });
  }, [connect, connectors]);

  // Handle disconnect button click
  const handleDisconnect = useCallback(() => {
    disconnect();
  }, [disconnect]);

  // Render the component
  return (
    <div className="container">
      <img
        src="/authento.svg"
        alt="Authento Logo"
        width={386}
        height={45}
        style={{ marginBottom: 40 }}
      />
      {address ? (
        <div className="panel">
          <table>
            <tbody>
              <tr>
                <td width={150} colSpan={2}>
                  <span className="address">
                    {`${shortenEthAddress(address)}`}
                  </span>
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
                  <span className={`status ${status?.basic}`}>
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
                  <span className={`status ${status?.poa}`}>
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
      ) : (
        <button className="primary-btn" onClick={handleConnect}>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default Home;
