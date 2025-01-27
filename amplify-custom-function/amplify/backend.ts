import { defineBackend } from "@aws-amplify/backend";

import { auth } from "./auth/resource";
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
});

const env = {
  variables: {
    APPSYNC_API_ENDPOINT: backend.data.graphqlUrl,
  },
};
backend.customAPIFunction.resources.cfnResources.cfnFunction.environment = env;
backend.pythonFunctionSchema.resources.cfnResources.cfnFunction.environment =
  env;
