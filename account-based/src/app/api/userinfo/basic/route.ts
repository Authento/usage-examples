import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const apiKey = process.env.AUTHENTO_API_KEY as string;
const apiSecret = process.env.AUTHENTO_API_SECRET as string;
const basicUserInfoEndpoint = `${process.env.API_BASE_ENDPOINT}/userinfo/basic`;

/**
 * WARNING: This implementation is intended FOR DEMO PURPOSES ONLY AND
 *          SHOULD NOT BE USED IN PRODUCTION without modification.
 *
 * In a production server, you should NOT retrieve the KYC status of a user
 * through the Authento API. Instead, you are advised to build an endpoint
 * to handle verificaiton result webhooks and keep track of user KYC statuses
 * in your own database.
 *
 * Please refer to https://authento.gitbook.io/authento-api/ for more
 * information on account-based integration with Authento.
 *
 * Returns the KYC status of a userIdentifier retrieved using Authento API
 * @api {get} /userinfo/basic?userIdentifier=:userIdentifier
 * @apiParam {String} userIdentifier client provided userIdentifier
 * @apiSuccess {String="unverified","processing","info_required",verified","rejected"}
 *   status KYC status of the userIdentifier
 * @apiError {String} detail Error detail
 */
export const GET = async (request: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);

    // Throws if the userIdentifier is undefined or empty
    if (!session?.user.id) {
      throw new Error();
    }

    const url = `${basicUserInfoEndpoint}?userIdentifier=${session.user.id}`;
    const timestamp = Date.now().toString();
    const signature = crypto
      .createHmac("sha256", apiSecret)
      .update(`${timestamp}GET${url}`)
      .digest("hex");

    // Make a GET request to the Authento endpoint with the required headers
    const { success, result, error } = await fetch(url, {
      headers: {
        "X-AUTHENTO-APIKEY": apiKey,
        "X-AUTHENTO-SIGNATURE": signature,
        "X-AUTHENTO-TS": timestamp,
      },
    }).then((response) => response.json());
    if (!success) {
      return NextResponse.json({
        success,
        error,
      });
    }
    return NextResponse.json({
      success,
      status: result.status,
    });
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
