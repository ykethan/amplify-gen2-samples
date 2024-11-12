import { defineBackend } from "@aws-amplify/backend";
import {
  Application,
  ConfigurationContent,
  DeploymentStrategy,
  Environment,
  HostedConfiguration,
  RolloutStrategy,
} from "aws-cdk-lib/aws-appconfig";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { appConfigFunction } from "./function/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  appConfigFunction,
});

const appConfigStack = backend.createStack("app-config");
const app = new Application(appConfigStack, "MyApp");
const env = new Environment(appConfigStack, "MyEnv", {
  application: app,
});

// Collect all resources
const tables = Object.values(backend.data.resources.tables);
const userPool = backend.auth.resources.userPool;
const userPoolClient = backend.auth.resources.userPoolClient;
const identityPool = backend.auth.resources.cfnResources.cfnIdentityPool;

const config = new HostedConfiguration(appConfigStack, "MyConfig", {
  application: app,
  deployTo: [env],
  deploymentStrategy: new DeploymentStrategy(
    appConfigStack,
    "MyDeploymentStrategy",
    {
      rolloutStrategy: RolloutStrategy.ALL_AT_ONCE,
    }
  ),
  content: ConfigurationContent.fromInlineJson(
    JSON.stringify({
      resources: {
        tables: tables.map((table) => ({
          name: table.tableName,
          arn: table.tableArn,
        })),
        auth: {
          userPool: {
            name: userPool.userPoolId,
            arn: userPool.userPoolArn,
            id: userPool.userPoolId,
          },
          userPoolClient: {
            id: userPoolClient.userPoolClientId,
          },
          identityPool: {
            name: identityPool.identityPoolName,
            id: identityPool.identityPoolName,
          },
        },
        data_api: {
          name: backend.data.apiId,
          url: backend.data.graphqlUrl,
        },
      },
    })
  ),
});

// Add environment variables to your Lambda function
backend.appConfigFunction.addEnvironment(
  "APPCONFIG_URL",
  `http://localhost:2772/applications/${app.name}/environments/${env.name}/configurations/${config.name}`
);

// Add AppConfig permissions to the Lambda function
backend.appConfigFunction.resources.lambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["appconfig:*"],
    resources: ["*"],
  })
);
