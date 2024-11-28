import { defineBackend } from "@aws-amplify/backend";
import { PythonFunction } from "@aws-cdk/aws-lambda-python-alpha";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const backend = defineBackend({
  data,
  auth,
});

const CustomStack = backend.createStack("custom");

const myFunction = new PythonFunction(CustomStack, "myFunction", {
  entry: path.join(__dirname, "function"),
  runtime: Runtime.PYTHON_3_13,
  handler: "index.handler",
});

backend.data.addLambdaDataSource("pythonFunc", myFunction, {
  description: "python function",
  name: "pythonFunc",
});
