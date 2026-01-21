/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router";
import { useVerifyEmail } from "../../hooks/useVerifyEmail";
import { CheckCircleIcon } from "../../icons";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");

  const { mutate: verifyEmail, error } = useVerifyEmail();

  useEffect(() => {
    if (!token) {
      setVerificationStatus("invalid");
      return;
    }

    // Call verify API
    verifyEmail(token, {
      onSuccess: () => {
        setVerificationStatus("success");
        // Redirect to signin after 3 seconds
        setTimeout(() => {
          navigate("/signin");
        }, 3000);
      },
      onError: () => {
        setVerificationStatus("error");
      },
    });
  }, [token, verifyEmail, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        {/* Loading State */}
        {verificationStatus === "loading" && (
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
            <h2 className="mt-4 text-xl font-semibold text-gray-800 dark:text-white">
              Verifying your email...
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Please wait a moment
            </p>
          </div>
        )}

        {/* Success State */}
        {verificationStatus === "success" && (
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              Email Verified Successfully!
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Your email has been verified. You can now sign in to your account.
            </p>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Redirecting to sign in page in 3 seconds...
            </p>
            <Link
              to="/signin"
              className="inline-block px-6 py-3 mt-6 text-white transition-colors bg-neutral-600 rounded-lg hover:bg-neutral-700"
            >
              Go to Sign In
            </Link>
          </div>
        )}

        {/* Error State */}
        {verificationStatus === "error" && (
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              Verification Failed
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              {(error as any)?.error || "Invalid or expired verification token"}
            </p>
            <div className="mt-6 space-y-3">
              <Link
                to="/signup"
                className="block px-6 py-3 text-white transition-colors bg-neutral-600 rounded-lg hover:bg-neutral-700"
              >
                Register Again
              </Link>
              <Link
                to="/signin"
                className="block px-6 py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* Invalid Token State */}
        {verificationStatus === "invalid" && (
          <div className="text-center">
            <CheckCircleIcon className="w-16 h-16 mx-auto text-red-500" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
              Invalid Verification Link
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              The verification link is invalid or missing.
            </p>
            <Link
              to="/signin"
              className="inline-block px-6 py-3 mt-6 text-white transition-colors bg-neutral-600 rounded-lg hover:bg-neutral-700"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
