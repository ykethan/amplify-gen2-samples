import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { Function } from "aws-cdk-lib/aws-lambda";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
});

// Create a stack in the us-east-2 region
const crossRegionStack = new Stack(backend.stack, "useast2stack", {
  env: {
    region: "us-east-2",
  },
});

// Reference the function called testFunction in the us-east-2 region
const refFunction = Function.fromFunctionName(
  crossRegionStack,
  "refFunction",
  "testFunction"
);

// Add the function as a data source to the API backend.data
backend.data.addLambdaDataSource("echo", refFunction, {
  description: "cross region lambda function",
  name: "echo",
});
