const { SESClient } = require("@aws-sdk/client-ses");
// Set the AWS Region.
const REGION = "ap-south-1";
// Create SES service object.
const sesClient = new SESClient({
  region: REGION,
  credentials: {
    accessKeyId: "AKIAYG24OPIEASEKQ55X",
    secretAccessKey: "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",
  },
});

module.exports = { sesClient };
// snippet-end:[ses.JavaScript.createclientv3]
