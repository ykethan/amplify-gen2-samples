import { defineBackend } from "@aws-amplify/backend";
// import dotenvx from "@dotenvx/dotenvx";
// dotenvx.config({ path: [".env.local"] });
// import { PolicyStatement } from "aws-cdk-lib/aws-iam";
// import { StringParameter } from "aws-cdk-lib/aws-ssm";

import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { postConfirmation } from "./auth/post-confirmation/resource";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { storage } from "./storage/resource";
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  postConfirmation,
  data,
  storage,
});

const { cfnUserPool } = backend.auth.resources.cfnResources;

// Configure recovery mechanisms
cfnUserPool.accountRecoverySetting = {
  recoveryMechanisms: [
    {
      name: "verified_phone_number",
      priority: 2,
    },
    {
      name: "verified_email",
      priority: 1,
    },
  ],
};

cfnUserPool.mfaConfiguration = "ON";
cfnUserPool.enabledMfas = ["SMS_MFA", "EMAIL_OTP"];

backend.postConfirmation.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["cognito-idp:AdminUpdateUserAttributes"],
    resources: ["*"],
  })
);
