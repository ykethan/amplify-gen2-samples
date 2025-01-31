import { defineFunction } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { Repository } from "aws-cdk-lib/aws-ecr";
import { Code, Function, Handler, Runtime } from "aws-cdk-lib/aws-lambda";

export const dockerFunctionecr = defineFunction(
  (scope) =>
    new Function(scope, "docker-function-ecr2", {
      handler: Handler.FROM_IMAGE,
      runtime: Runtime.FROM_IMAGE,
      timeout: Duration.seconds(20),
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
          tagOrDigest: "latest",
        }
      ),
    }),
  {
    resourceGroupName: "data",
  }
);
