const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {
  const cleanTo = toAddress.trim().replace(/\s|\r|\n/g, "");
  const cleanFrom = fromAddress.trim().replace(/\s|\r|\n/g, "");

  return new SendEmailCommand({
    Destination: { ToAddresses: [cleanTo] },
    Message: {
      Subject: { Charset: "UTF-8", Data: subject || "No Subject" },
      Body: {
        Html: { Charset: "UTF-8", Data: `<h1>${body || "No Content"}</h1>` },
        Text: { Charset: "UTF-8", Data: body || "No Content" },
      },
    },
    Source: cleanFrom,
  });
};

const run = async (subject, body, toEmailId) => {
  try {
    // ✅ Verified email must be the sender
    const fromAddress = "kamalsharmag123@gmail.com";

    // 👇 you can send only to verified emails in sandbox
    const toAddress = (toEmailId || "kamalsharmag123@gmail.com").trim();

    const sendEmailCommand = createSendEmailCommand(toAddress, fromAddress, subject, body);

    const result = await sesClient.send(sendEmailCommand);
    console.log("✅ Email sent successfully:", result.MessageId);
    return result;
  } catch (error) {
    console.error("❌ Email send error:", error.name, "-", error.message);
    throw error;
  }
};

module.exports = { run };
