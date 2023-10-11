import { useCallback, useState } from "react";

type useTokenVerifyPopupConfig = {
  endpoint: string;
  params?: Record<string, string>;
  authentoUrl?: string;
};

type Status = "unstarted" | "fetching" | "success" | "error";

/**
 * Custom hook to handle token verification popup functionality.
 *
 * @param {string} endpoint - The endpoint to retrieve the verification JWT.
 * @param {object} params - Query parameters
 * @param {string} authentoUrl - (Optional) The URL of the Authento webpage
 * @returns An object containing functions and state variables related to the token
 *   verification popup
 */
export const useTokenVerifyPopup = ({
  endpoint,
  params,
  authentoUrl = "https://app.authento.io",
}: useTokenVerifyPopupConfig) => {
  const [status, setStatus] = useState<Status>("unstarted");

  let url = endpoint;
  if (params) {
    url += `?${new URLSearchParams(params).toString()}`;
  }

  const verify = useCallback(() => {
    setStatus("fetching");
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          window.open(
            `${authentoUrl}/verify/token?jwt=${data.token}`,
            "_blank",
            "toolbar=no, location=no, status=no, menubar=no, width=640, height=720"
          );
          setStatus("success");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [authentoUrl, url]);

  return { verify, status };
};
