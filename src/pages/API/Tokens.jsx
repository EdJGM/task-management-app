// src/pages/api/tokens.jsx
import { getTokens } from "next-firebase-auth-edge";
import { cookies } from "next/headers";
import { clientConfig, serverConfig } from "../../config";

export default async function handler(req, res) {
    const tokens = await getTokens(cookies(), {
        apiKey: clientConfig.apiKey,
        cookieName: serverConfig.cookieName,
        cookieSignatureKeys: serverConfig.cookieSignatureKeys,
        serviceAccount: serverConfig.serviceAccount,
    });

    if (!tokens) {
        res.status(404).json({ error: "Tokens not found" });
        return;
    }

    res.status(200).json({ tokens });
}