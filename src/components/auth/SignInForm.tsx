import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useLogin } from "../../hooks/useLogin";
import Alert from "../../components/ui/alert/Alert";


export default function SignInForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [formError, setFormError] = useState("");

  const { mutate: login, isPending, isError, error } = useLogin();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      setFormError("Email và mật khẩu không được để trống");
      return;
    }

    setFormError("");

    login(
      { email, password },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };

const apiErrorMessage =  isError ? error?.message : ""
    
  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          {/* Header */}
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                type="email"
                  placeholder="info@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Password */}
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="size-5 fill-gray-500 dark:fill-gray-400" />
                    )}
                  </span>
                </div>
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox checked={isChecked} onChange={setIsChecked} />
                  <span className="text-theme-sm text-gray-700 dark:text-gray-400">
                    Keep me logged in
                  </span>
                </div>
                <Link
                  to="/reset-password"
                  className="text-sm text-brand-500 hover:text-brand-600"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Errors */}
              {formError && (
                <Alert variant="warning" title="Warning" message={formError} />
              )}

              {apiErrorMessage && (
                <Alert
                  variant="error"
                  title="Login failed"
                  message={apiErrorMessage}
                />
              )}

              {/* Submit */}
              <Button className="w-full" size="sm" disabled={isPending} >
                {isPending ? "Signing in..." : "Sign in"}
              </Button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-brand-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
