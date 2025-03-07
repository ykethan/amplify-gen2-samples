// import { referenceAuth } from "@aws-amplify/backend";

// export const auth = referenceAuth({
//   userPoolId: "us-east-1_UHJabjTT2",
//   identityPoolId: "us-east-1:6e6fba88-8ade-4199-9558-81517a497151",
//   authRoleArn: "arn:aws:iam::053649414724:role/service-role/t6aireauthrole",
//   unauthRoleArn: "arn:aws:iam::053649414724:role/service-role/t6aireunauthrole",
//   userPoolClientId: "6n6vvt4nuimqf94e9puqvs3cck",
//   groups: {
//     admin: "arn:aws:iam::053649414724:role/us-east-1_YLKJbt050_Full-access",
//   },
// });

import { defineAuth } from "@aws-amplify/backend";
import { forgotPassword } from "./forgot-password/resource";
import { postConfirmation } from "./post-confirmation/resource";
export const auth = defineAuth({
  name: "myAuth",
  loginWith: {
    email: true,
    phone: true,
  },
  triggers: {
    customMessage: forgotPassword,
    postConfirmation: postConfirmation,
  },
  accountRecovery: "PHONE_AND_EMAIL",
  senders: {
    email: {
      fromEmail: "abc@test.com",
    },
  },
  multifactor: {
    mode: "REQUIRED",
    sms: true,
    totp: false,
  },
});
