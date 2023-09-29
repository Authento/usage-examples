const crypto = require("crypto");
const express = require("express");

const app = express();

// TODO: Configure your Authento settings
const apiKey = "YOUR_API_KEY";
const apiSecret = "YOUR_API_SECRET";
const basicUserInfoEndpoint = "https://api.authento.io/v1/userinfo/basic";

/**
 * Returns the KYC status of an address retrieved using Authento API
 * @api {get} /userinfo/basic?address=:address
 * @apiParam {String} address EVM compatible address
 * @apiSuccess {String="unverified","processing","info_required",verified","rejected"}
 *   status KYC status of the address
 * @apiSuccess {String="individual","company"}
 *   type User type
 * @apiError {String} detail Error detail
 */
app.get("/userinfo/basic", async (req, res) => {
  try {
    const address = req.query.address;

    if (!address) {
      throw new Error("Invalid address");
    }

    const url = `${basicUserInfoEndpoint}?address=${address}`;
    const timestamp = Date.now();
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(`${timestamp}GET${url}`)
      .digest("hex");

    const { status, type } = await fetch(url, {
      headers: {
        "X-AUTHENTO-APIKEY": apiKey,
        "X-AUTHENTO-SIGNATURE": signature,
        "X-AUTHENTO-TS": timestamp,
      },
    })
      .then((response) => response.json())
      .then((data) => data.result);

    // TODO: Implement additional filters based on user attributes such
    //  as nationality/age/pep/riskScore as needed.
    //  Fields other than 'status' and 'verified' should not be included
    //  in the response as they might contain sensitive information.
    res.json({ status, type });
  } catch {
    res.status(400).json({ detail: "Failed to retrieve basic user info" });
  }
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
