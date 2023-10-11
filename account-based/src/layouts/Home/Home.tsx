"use client";

import { useCallback, useEffect, useState } from "react";
import type { NextPage } from "next";
import { useSession, signOut, signIn } from "next-auth/react";

import { capitalize } from "@/utils/capitalize";
import { useTokenVerifyPopup } from "@/app/hooks/useTokenVerifyPopup";

type Status = {
  basic: string;
  poa: string;
};

const Home: NextPage = () => {
  const [status, setStatus] = useState<Status>();
  const [unusedIdentifier, setUnusedIdentifier] = useState(false);

  const { data: session, status: sessionStatus } = useSession();

  const { verify: verifyBasic } = useTokenVerifyPopup({
    endpoint: "/api/jwt",
    params: { verificationType: "BASIC" },
    authentoUrl: process.env.NEXT_PUBLIC_AUTHENTO_URL,
  });

  const { verify: verifyPoa } = useTokenVerifyPopup({
    endpoint: "/api/jwt",
    params: { verificationType: "POA" },
    authentoUrl: process.env.NEXT_PUBLIC_AUTHENTO_URL,
  });

  const fetchStatus = useCallback(() => {
    setUnusedIdentifier(false);
    if (session?.user.id) {
      fetch(`/api/userinfo/basic`)
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            setStatus(data.status);
          } else if (data.error === "INVALID_USER_IDENTIFIER") {
            setUnusedIdentifier(true);
          }
        })
        .catch(console.error);
    }
  }, [session?.user.id]);

  // Debounce fetch status by userIdentifier
  useEffect(() => {
    const timeout = setTimeout(fetchStatus, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [fetchStatus]);

  // Refetch user status on window focus
  useEffect(() => {
    window.addEventListener("focus", fetchStatus);
    return () => {
      window.removeEventListener("focus", fetchStatus);
    };
  }, [fetchStatus]);

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
      {sessionStatus === "unauthenticated" && (
        <button
          className="primary-btn"
          onClick={() => {
            signIn();
          }}
        >
          Sign in
        </button>
      )}
      {sessionStatus === "loading" && (
        <span className="loading">Loading...</span>
      )}
      {sessionStatus === "authenticated" && (
        <div className="panel">
          <table>
            <tbody>
              <tr>
                <td>Username:</td>
                <td width={80}>{session?.user.id}</td>
                <td>
                  <button
                    className="secondary-btn"
                    onClick={() => {
                      signOut();
                    }}
                  >
                    Sign out
                  </button>
                </td>
              </tr>
              <tr>
                <td>BASIC:</td>
                <td>
                  <span className={`${status?.basic}`}>
                    {capitalize(status?.basic || "–")}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={verifyBasic}
                    disabled={
                      !(
                        unusedIdentifier ||
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
                <td>POA:</td>
                <td>
                  <span className={`${status?.poa}`}>
                    {capitalize(status?.poa || "–")}
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
      )}
    </div>
  );
};

export default Home;
