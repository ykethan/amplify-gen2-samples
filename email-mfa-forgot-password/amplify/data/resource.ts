// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
// import { adminCreateUser } from "./admin-create-user/resource";
const schema = a.schema({
  UserProfile: a
    .model({
      email: a.string(),
      profileOwner: a.string(),
    })
    .authorization((allow) => [allow.ownerDefinedIn("profileOwner")]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  name: "CoolName", // Give the API a name
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
