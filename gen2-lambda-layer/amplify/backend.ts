import { defineBackend } from "@aws-amplify/backend";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { sharpFunction } from "./functions/sharp/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  sharpFunction,
});

backend.sharpFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["s3:ListBucket", "s3:GetObject", "s3:PutObject"],
    resources: ["*"],
  })
);
