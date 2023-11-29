import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { encodePacked, keccak256 } from "viem";
import { signMessage } from "viem/accounts";

const apiKey = process.env.AUTHENTO_API_KEY as string;
const apiSecret = process.env.AUTHENTO_API_SECRET as string;
const basicUserInfoEndpoint = `${process.env.API_BASE_ENDPOINT}/userinfo/basic`;
const privateKey = `0x${process.env.SIGNER_PRIVATE_KEY}` as Address;
const expireTsDelta = Number(process.env.EXPIRE_TS_DELTA) || 30 * 60;

const _fetchUserInfo = async (address: string) => {
  const url = `${basicUserInfoEndpoint}?address=${address}`;
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac("sha256", apiSecret)
    .update(`${timestamp}GET${url}`)
    .digest("hex");

  return await fetch(url, {
    headers: {
      "X-AUTHENTO-APIKEY": apiKey,
      "X-AUTHENTO-SIGNATURE": signature,
      "X-AUTHENTO-TS": timestamp,
    },
  }).then((response) => response.json());
};

const _canAccessContract = (address: Address, userInfo: BasicUserInfo) => {
  const found = userInfo.addresses.find(
    (addr: any) => addr.address === address
  );
  if (found?.action === "WHITELISTED") {
    return true;
  }
  if (found?.action === "BLACKLISTED") {
    return false;
  }
  // Grant access if user satifies the following conditions:
  // - has completed basic KYC
  // - is non-US
  // - is non-pep
  return (
    userInfo.status.basic === "VERIFIED" &&
    userInfo.basicInfo.nonUS &&
    !userInfo.basicInfo.pep
  );
};

const _generateSignature = async (address: Address) => {
  const expireTs = Math.floor(Date.now() / 1000) + expireTsDelta;
  const messageHash = keccak256(
    encodePacked(["address", "uint256"], [address, BigInt(expireTs)])
  );
  const signature = await signMessage({
    message: { raw: messageHash },
    privateKey,
  });

  return { expireTs, signature };
};

/**
 * Returns the digital signature for on-chain verification
 * @api {get} /signature?address=:address
 * @apiParam {String} address EVM compatible address
 * @apiSuccess {Object} An object containing signature and expireTs
 * @apiError {String} detail Error detail
 */
export const GET = async (request: NextRequest) => {
  try {
    const address = request.nextUrl.searchParams.get("address");
    if (!address) {
      throw new Error("Invalid address");
    }
    const response = await _fetchUserInfo(address);
    if (response.success) {
      if (_canAccessContract(address as Address, response.result)) {
        const { signature, expireTs } = await _generateSignature(
          address as Address
        );
        return NextResponse.json({ expireTs, signature });
      }
      return NextResponse.json({ detail: "Access denied" }, { status: 422 });
    }
    throw new Error("Error fetching userinfo");
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { detail: "Failed to generate signature" },
      { status: 400 }
    );
  }
};

// Forces dynamic route evaluation
// Reference: https://github.com/vercel/next.js/issues/49182
export const dynamic = "force-dynamic";
