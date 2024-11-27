import { defineBackend } from "@aws-amplify/backend";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { DynamoEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { apiFunction } from "./functions/apiFunction/resource";
import { uploadFunction } from "./functions/uploadFunction/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  uploadFunction,
  apiFunction,
});

const dynamoEventSource = new DynamoEventSource(
  backend.data.resources.tables["Todo"],
  {
    startingPosition: StartingPosition.LATEST,
    batchSize: 5,
  }
);

backend.uploadFunction.resources.lambda.addEventSource(dynamoEventSource);
