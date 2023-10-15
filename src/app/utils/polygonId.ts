//something is wrong with this package
import { auth, resolver } from "@iden3/js-iden3-auth";

export async function getRequestBody() {
  try {
    const sessionId = 1;
    // Audience is verifier id
    const hostUrl = "<NGROK_URL>";
    const callbackURL = "/api/polygon-id/request/callback";
    const audience =
      "did:polygonid:polygon:mumbai:2qDyy1kEo2AYcP3RT4XGea7BtxsY285szg6yP9SPrs";

    const uri = `${hostUrl}${callbackURL}?sessionId=${sessionId}`;

    // Generate request for basic authentication
    const request = auth.createAuthorizationRequest("test flow", audience, uri);

    request.id = "7f38a193-0918-4a48-9fac-36adfdb8b542";
    request.thid = "7f38a193-0918-4a48-9fac-36adfdb8b542";

    // Add request for a specific proof
    const proofRequest = {
      id: 1,
      circuitId: "credentialAtomicQuerySigV2",
      query: {
        allowedIssuers: ["*"],
        type: "KYC",
        context: "ipfs://QmV8ExVNH9Ks5YeRK2u1RhKvEVyAHYTmdgpt1ATJp7f9R5",
        credentialSubject: {
          age: {
            $eq: 27,
          },
        },
      },
    };
    const scope = request.body.scope ?? [];
    request.body.scope = [...scope, proofRequest];

    return request;
  } catch (error: any) {
    throw error;
  }
}
