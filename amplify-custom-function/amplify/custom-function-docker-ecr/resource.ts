import { defineFunction } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import {
  Architecture,
  Code,
  Function,
  Handler,
  Runtime,
} from "aws-cdk-lib/aws-lambda";

export const dockerFunctionecr = defineFunction(
  (scope) =>
    new Function(scope, "docker-function-ecr2", {
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      timeout: Duration.seconds(20),
      architecture: Architecture.ARM_64,
      environment: {
        Hello: "there",
      },

      code: Code.fromEcrImage(
        Repository.fromRepositoryName(
          scope,
          "PythonRepo",
          "amplify/custom-function"
        ),
        {
          tagOrDigest: "new",
        }
      ),
    }),
  {
    resourceGroupName: "data",
  }
);
