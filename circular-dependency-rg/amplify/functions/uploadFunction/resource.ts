import { defineFunction } from "@aws-amplify/backend";

export const uploadFunction = defineFunction({
  name: "upload-function",
  entry: "./handler.ts",
  resourceGroupName: "data", // create a new resource group for this function
});
