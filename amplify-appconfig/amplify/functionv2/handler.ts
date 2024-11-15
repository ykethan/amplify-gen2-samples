import { env } from "$amplify/env/appConfigFunctionV2";
import { getAppConfig } from "@aws-lambda-powertools/parameters/appconfig";
export const handler: any = async (event: any) => {
  const config = await getAppConfig(env.CONFIG, {
    environment: env.ENV,
    application: env.APP,
    transform: "json",
  });

  console.log("🚀 ~ config1:", config);

  return {
    config,
  };
};
