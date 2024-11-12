import { defineFunction } from "@aws-amplify/backend";

// Define the image optimization function
export const sharpFunction = defineFunction({
  name: "imageOptimizer",
  runtime: 18,
  timeoutSeconds: 120,
  layers: {
    sharp: "arn:aws:lambda:us-east-1:012346677889:layer:SharpLayerGen2:1", // Replace with your Layer's ARN
  },
});
