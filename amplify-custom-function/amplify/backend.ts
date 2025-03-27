import { defineBackend } from "@aws-amplify/backend";

import { auth } from "./auth/resource";
import { dockerFunctionecr } from "./custom-function-docker-ecr/resource";
import { dockerFunction } from "./custom-function-docker/resource";
import { customAPIMutationFunction } from "./custom-python-function-api-mutation/resource";
import { customAPIFunction } from "./custom-python-function-api/resource";
import { data } from "./data/resource";
import { pythonFunctionSchema } from "./python-function-schema/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  customAPIFunction,
  pythonFunctionSchema,
  dockerFunction,
  dockerFunctionecr,
  customAPIMutationFunction,
});

const env = {
  variables: {
    APPSYNC_API_ENDPOINT: backend.data.graphqlUrl,
  },
};
backend.customAPIFunction.resources.cfnResources.cfnFunction.environment = env;
backend.pythonFunctionSchema.resources.cfnResources.cfnFunction.environment =
  env;
backend.dockerFunction.resources.cfnResources.cfnFunction.environment = env;

const cfnFn = backend.dockerFunctionecr.resources.cfnResources.cfnFunction;

cfnFn.addPropertyOverride("Environment.Variables", {
  // @ts-expect-error
  ...((cfnFn.environment?.variables || {}) as Record<string, string>),
  KEY3: "value3", // Add new vars
  KEY4: "value4",
  ba1c: "test1",
});

backend.customAPIMutationFunction.resources.cfnResources.cfnFunction.environment =
  env;
