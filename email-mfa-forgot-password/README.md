# React(Vite) + Amplify Gen 2

## Backend

Set the email and phone number as MFA options. MFA is required.
override auth to add email MFA.

custom Email sender using SES and account recovery options. sets the email as the priority recovery option.

2 triggers:

1. post-confirmation
2. custom message

post-confirmation:
- sets phone as verified with a dummy number.

custom message:
- handles forgot password event.

## Frontend

Testing forgot password flow with Amplify JS:

- Amplify Js to handle the sign in, sign up, and sign out manually.
- manually added email and phone number inputs.
- manually added forgot password flow.

