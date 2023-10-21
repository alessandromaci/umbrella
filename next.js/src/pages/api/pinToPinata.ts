import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";

const pinata = new pinataSDK(
  "ce1e4bde29ce0d8805c3",
  "57709ac19350a15a4c18cd8ac993d9aa124a0eef0f84b92cd354dcd6f71c2f13"
);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      // Assume data is a valid object to be pinned
      const data = req.body;

      const result = await pinata.pinJSONToIPFS(data);

      return res.status(200).json(result);
    } else {
      return res.status(405).send("Method Not Allowed");
    }
  } catch (error) {
    return res.status(500).json({ error: "Error pinning to Pinata" });
  }
};

export default handler;
