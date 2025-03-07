import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "pictureDrive",
  isDefault: true,
  access: (allow) => ({
    "media/{entity_id}/*": [allow.entity("identity").to(["write", "list"])],
    "videos/*": [allow.guest.to(["read"])],
  }),
});

export const fileStorage = defineStorage({
  name: "fileStorage",
  access: (allow) => ({
    "users/*": [allow.entity("identity").to(["read", "write", "delete"])],
    "files/*": [allow.entity("identity").to(["read", "write", "delete"])],
  }),
});
