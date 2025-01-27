import { defineBackend } from "@aws-amplify/backend";

import { auth } from "./auth/resource";
import { sayHelloFunctionHandler } from "./custom-python-function-api/resource";
import { data } from "./data/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  sayHelloFunctionHandler,
});

const env = {
  variables: {
    APPSYNC_API_ENDPOINT: backend.data.graphqlUrl,
  },
};
backend.sayHelloFunctionHandler.resources.cfnResources.cfnFunction.environment =
  env;
