import type { CustomMessageTriggerHandler } from "aws-lambda";

export const handler: CustomMessageTriggerHandler = async (event) => {
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    const { codeParameter } = event.request;

    const message = `
      <p>Hello,</p>
      <p>Your temporary password reset code is: ${codeParameter}</p>
      <p>Please use this code to reset your password.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
    `;

    event.response.emailSubject = "Password Reset Code";
    event.response.emailMessage = message;
  }
  return event;
};
