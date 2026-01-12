import { Link } from "react-router";
import { CheckCircleIcon } from "../../icons";

export default function RegistrationSuccess() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <CheckCircleIcon className="w-16 h-16 mx-auto text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-800 dark:text-white">
            Registration Successful!
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Thank you for registering! We've sent a verification email to your inbox.
          </p>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Please check your email and click the verification link to activate your account.
          </p>

          <div className="p-4 mt-6 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> If you don't see the email, please check your spam folder.
            </p>
          </div>

          <Link
            to="/signin"
            className="inline-block px-6 py-3 mt-6 text-white transition-colors bg-neutral-950 rounded-lg hover:bg-neutral-700"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
