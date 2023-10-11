import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import jwt from "jsonwebtoken";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * WARNING: This implementation is intended FOR DEMO PURPOSES ONLY AND
 *          SHOULD NOT BE USED IN PRODUCTION without modification.
 *
 * Please refer to https://authento.gitbook.io/authento-api/ for more
 * information on account-based integration with Authento.
 *
 * Returns the encoded JWT for account-based verification
 * @api {get} /jwt?userIdentifier=:userIdentifier&verificationType=:verificationType
 * @apiParam {String} userIdentifier
 * @apiParam {String} verificationType
 * @apiSuccess {String} Encoded JWT
 */
export const GET = async (request: NextRequest) => {
  try {
    const verificationType =
      request.nextUrl.searchParams.get("verificationType");

    const session = await getServerSession(authOptions);
    if (
      !(
        session?.user.id &&
        verificationType &&
        ["BASIC", "POA"].includes(verificationType)
      )
    ) {
      throw new Error();
    }

    const token = jwt.sign(
      {
        iss: process.env.CLIENT_NAME!, // Obtained from the settings page in Authento dashboard
        sub: session.user.id, // userIdentifier: this should be unique to each user.
        aud: "Authento", // This should always be "Authento"
        ut: "INDIVIDUAL", // userType: "INDIVIDUA" | "CORPORATE"
        vt: verificationType, // verificationType: "BASIC" | "POA"
        lang: "en", // (Optional) ISO 639-1 language code
      },
      process.env.JWT_PRIVATE_KEY! // Obtained from the settings page in Authento dashboard
    );

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { detail: "Failed to generate JWT" },
      { status: 400 }
    );
  }
};

// Forces dynamic route evaluation
// Reference: https://github.com/vercel/next.js/issues/49182
export const dynamic = "force-dynamic";
