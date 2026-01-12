import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { EyeCloseIcon, EyeIcon } from "../../icons";
import Label from "../form/Label";
import Input from "../form/input/InputField";
import Checkbox from "../form/input/Checkbox";
import Button from "../ui/button/Button";
import { useLogin } from "../../hooks/useLogin";
import { useDebounce } from "../../hooks/useDebounce";
import Alert from "../../components/ui/alert/Alert";

interface SignInFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}


export default function SignInForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const emailValue = watch("email");
  const passwordValue = watch("password");

  const debouncedEmail = useDebounce(emailValue, 500);
  const debouncedPassword = useDebounce(passwordValue, 500);

  const { mutate: login, isPending, isError, error } = useLogin();
  const isTyping =
  emailValue !== debouncedEmail || passwordValue !== debouncedPassword;
  
  const onSubmit = (data: SignInFormData) => {
  login(
    { email: data.email, password: data.password },
    { onSuccess: () => navigate("/") }
  );
};

  const apiErrorMessage = isError ? error?.message : "";
    
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6">
              {/* Email */}
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  type="email"
                  placeholder="info@gmail.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.email.message}
                  </p>
                )}
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
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
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
                {errors.password && (
                  <p className="mt-1 text-sm text-error-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
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
              {apiErrorMessage && (
                <Alert
                  variant="error"
                  title={apiErrorMessage}
                  message={""}
                />
              )}

              {/* Submit */}
              <Button className="w-full" size="sm" disabled={isPending || isTyping}>
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
