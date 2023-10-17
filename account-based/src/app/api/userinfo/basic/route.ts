import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const { AUTHENTO_API_KEY, AUTHENTO_API_SECRET, API_BASE_ENDPOINT } =
  process.env;
const apiKey = AUTHENTO_API_KEY!;
const apiSecret = AUTHENTO_API_SECRET!;
const basicUserInfoEndpoint = `${API_BASE_ENDPOINT}/userinfo/basic`;

/**
 * Fetches user from Authento API using session userId as userIdentifier
 * @returns Object containing user status
 */

const _mockGetUserStatus = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) {
    throw new Error("Unable to retrieve user ID from session");
  }

  const url = `${basicUserInfoEndpoint}?userIdentifier=${session.user.id}`;
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(`${timestamp}GET${url}`)
    .digest("hex");

  const response = await fetch(url, {
    headers: {
      "X-AUTHENTO-APIKEY": apiKey,
      "X-AUTHENTO-SIGNATURE": signature,
      "X-AUTHENTO-TS": timestamp,
    },
  });

  if (!response.ok) {
    throw new Error("Error occurred while fetching user status");
  }

  return await response.json();
};

/**
 * WARNING: This implementation is intended FOR DEMO PURPOSES ONLY AND
 *          SHOULD NOT BE USED IN PRODUCTION without modification.
 *
 * Returns the KYC status of a userIdentifier retrieved using Authento API
 * @api {get} /userinfo/basic
 * @apiSuccess {String="unverified","processing","info_required",verified","rejected"}
 *   status KYC status of the userIdentifier
 * @apiError {String} detail Error detail
 */
export const GET = async (request: NextRequest) => {
  try {
    // In a production server, you should replace the next line with codes to
    // retrieve user verification status from your own database.
    const { success, result, error } = await _mockGetUserStatus();
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
