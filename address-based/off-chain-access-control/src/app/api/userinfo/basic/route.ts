import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.AUTHENTO_API_KEY as string;
const apiSecret = process.env.AUTHENTO_API_SECRET as string;
const basicUserInfoEndpoint = `${process.env.API_BASE_ENDPOINT}/userinfo/basic`;

/**
 * Returns the KYC status of an address retrieved using Authento API
 * @api {get} /userinfo/basic?address=:address
 * @apiParam {String} address EVM compatible address
 * @apiSuccess {String="unverified","processing","info_required",verified","rejected"}
 *   status KYC status of the address
 * @apiError {String} detail Error detail
 */
export const GET = async (request: NextRequest) => {
  try {
    const address = request.nextUrl.searchParams.get("address");

    // Check if the address is undefined or empty
    if (!address) {
      throw new Error("Invalid address");
    }

    const url = `${basicUserInfoEndpoint}?address=${address}`;
    const timestamp = Date.now().toString();
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(`${timestamp}GET${url}`)
      .digest("hex");

    // Make a GET request to the Authento endpoint with the required headers
    const { status, type } = await fetch(url, {
      headers: {
        "X-AUTHENTO-APIKEY": apiKey,
        "X-AUTHENTO-SIGNATURE": signature,
        "X-AUTHENTO-TS": timestamp,
      },
    })
      .then((response) => response.json())
      .then((data) => data.result);

    return NextResponse.json({ status, type });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { detail: "Failed to retrieve basic user info" },
      { status: 400 }
    );
  }
};

// Forces dynamic route evaluation
// Reference: https://github.com/vercel/next.js/issues/49182
export const dynamic = "force-dynamic";
