import { defineFunction } from "@aws-amplify/backend";

export const appConfigFunction = defineFunction({
  name: "appConfigFunction",
  environment: {},
  layers: {
    AppConfig:
      "arn:aws:lambda:us-east-1:027255383542:layer:AWS-AppConfig-Extension:173",
  },
});
