import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const dockerFunction = defineFunction(
  (scope) =>
    new Function(scope, "docker-function", {
      handler: "index.handler",
      runtime: Runtime.PYTHON_3_9,
      timeout: Duration.seconds(20),

      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("amazon/aws-lambda-python"),
          platform: "linux/amd64",
          entrypoint: ["/bin/sh", "-c"],
          command: [
            "pip install -r requirements.txt -t /asset-output && cp -au . /asset-output",
          ],
        },
      }),
    })
);
