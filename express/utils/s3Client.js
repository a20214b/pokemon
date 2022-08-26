import { S3Client } from "@aws-sdk/client-s3";
import { REGION } from "./env";

const s3Client = new S3Client({ region: REGION });

export default s3Client;

// import { S3Client } from "@aws-sdk/client-s3";
// import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
// import ProxyAgent from "proxy-agent";

// const proxyHttpHandler = new NodeHttpHandler({
//   httpAgent: new ProxyAgent(process.env.HTTP_PROXY),
//   httpsAgent: new ProxyAgent(process.env.HTTPS_PROXY),
// });

// const s3Client = new S3Client({
//   region: "ap-northeast-1", //e.g. "us-east-1"
//   requestHandler: proxyHttpHandler,
// });

// //export { s3Client };

// export default s3Client;
