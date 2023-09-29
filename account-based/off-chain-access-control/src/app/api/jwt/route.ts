import jwt from "jsonwebtoken";

const clientName = process.env.CLIENT_NAME!;
const privateKey = process.env.JWT_PRIVATE_KEY!;

const getUserDetails = () => {
  return ["733268ac-0593-4832-8dbf-64bc3631567e", "INDIVIDUAL"];
};

/**
 * Returns the encoded JWT
 * @api {get} /jwt
 * @apiSuccess {String} Encoded JWT
 */
export const GET = async () => {
  const [userIdentifier, userType] = getUserDetails();

  return jwt.sign(
    {
      iss: clientName, // ClientName: This can be obtained from the settings page in Authento dashboard
      sub: userIdentifier, // UserIdentifier: Unique string for identification (e.g. User id in client DB)
      aud: "Authento", // This should always be "Authento"
      ut: userType, // UserType: "INDIVIDUA" | "CORPORATE"
      vt: "BASIC", // VerificationType: "BASIC" | "POA"
    },
    privateKey
  );
};

// Forces dynamic route evaluation
// Reference: https://github.com/vercel/next.js/issues/49182
export const dynamic = "force-dynamic";
