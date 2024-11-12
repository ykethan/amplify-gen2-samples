import { env } from "$amplify/env/appConfigFunction";
export const handler: any = async (event: any) => {
  // Fetch first configuration
  const config1 = await fetch(`${env.APPCONFIG_URL}`).then((res) => res.json());

  console.log("🚀 ~ config1:", config1);

  return {
    config1,
  };
};
