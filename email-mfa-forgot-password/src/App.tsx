import { FileUploader } from "@aws-amplify/ui-react-storage";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import {
  confirmResetPassword,
  confirmSignIn,
  confirmSignUp,
  resetPassword,
  signIn,
  signUp,
} from "aws-amplify/auth";
import { parseAmplifyConfig } from "aws-amplify/utils";
import { useState } from "react";
import outputs from "../amplify_outputs.json";

const amplifyConfig = parseAmplifyConfig(outputs);
Amplify.configure({
  ...amplifyConfig,
});

export default function App() {
  const [user, setUser] = useState<boolean | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [mfaCode, setMfaCode] = useState("");
  const [showMFA, setShowMFA] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const output = await signIn({
        username,
        password,
      });

      if (output.nextStep.signInStep === "CONFIRM_SIGN_IN_WITH_EMAIL_CODE") {
        setShowMFA(true);
      } else {
        setUser(output.isSignedIn);
      }
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const handleMFASubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const output = await confirmSignIn({
        challengeResponse: mfaCode,
      });
      setUser(output.isSignedIn);
    } catch (error) {
      console.error("Error confirming sign in:", error);
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: phoneNumber,
          },
        },
      });
      setShowConfirm(true);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await confirmSignUp({
        username,
        confirmationCode: confirmCode,
      });
      setShowConfirm(false);
      setShowSignUp(false);
    } catch (error) {
      console.error("Error confirming sign up:", error);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const output = await resetPassword({ username });
      if (
        output.nextStep.resetPasswordStep === "CONFIRM_RESET_PASSWORD_WITH_CODE"
      ) {
        setShowResetConfirm(true);
      }
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await confirmResetPassword({
        username,
        confirmationCode: resetCode,
        newPassword,
      });
      setShowForgotPassword(false);
      setShowResetConfirm(false);
    } catch (error) {
      console.error("Error confirming password reset:", error);
    }
  };

  if (!user) {
    if (showSignUp) {
      return (
        <div>
          {!showConfirm ? (
            <form onSubmit={handleSignUp}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Phone Number (+12345678900)"
                value={"+11234567890"}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <button type="submit">Sign Up</button>
              <button type="button" onClick={() => setShowSignUp(false)}>
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmSignUp}>
              <input
                type="text"
                placeholder="Confirmation Code"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
              />
              <button type="submit">Confirm Sign Up</button>
            </form>
          )}
        </div>
      );
    }

    if (showForgotPassword) {
      return (
        <div>
          {!showResetConfirm ? (
            <form onSubmit={handleForgotPassword}>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <button type="submit">Reset Password</button>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
              >
                Back to Sign In
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmReset}>
              <input
                type="text"
                placeholder="Reset Code"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button type="submit">Confirm New Password</button>
            </form>
          )}
        </div>
      );
    }

    return (
      <div>
        {!showMFA ? (
          <form onSubmit={handleSignIn}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
            <button type="button" onClick={() => setShowSignUp(true)}>
              Sign Up
            </button>
            <button type="button" onClick={() => setShowForgotPassword(true)}>
              Forgot Password?
            </button>
          </form>
        ) : (
          <form onSubmit={handleMFASubmit}>
            <input
              type="text"
              placeholder="Enter MFA code from email"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
            />
            <button type="submit">Verify</button>
          </form>
        )}
      </div>
    );
  }

  return (
    <main>
      <h1>Hello {user}</h1>
      <FileUploader
        accessLevel="private"
        path={`media/${user}/`}
        acceptedFileTypes={["image/*"]}
        maxFileCount={1}
      />
    </main>
  );
}
