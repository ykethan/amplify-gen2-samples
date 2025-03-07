import {
  AdminUpdateUserAttributesCommand,
  CognitoIdentityProviderClient,
} from "@aws-sdk/client-cognito-identity-provider";
import { PostConfirmationTriggerHandler } from "aws-lambda";

const cognitoClient = new CognitoIdentityProviderClient({});

export const handler: PostConfirmationTriggerHandler = async (event) => {
  try {
    await cognitoClient.send(
      new AdminUpdateUserAttributesCommand({
        UserPoolId: event.userPoolId,
        Username: event.userName,
        UserAttributes: [
          {
            Name: "phone_number_verified",
            Value: "true",
          },
          {
            Name: "phone_number",
            Value: "+11234567890",
          },
        ],
      })
    );
  } catch (error) {
    console.error("Error updating user attributes:", error);
    throw error;
  }
  return event;
};
