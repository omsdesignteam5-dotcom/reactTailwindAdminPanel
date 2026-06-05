import * as Yup from "yup";
import { useFormik } from "formik";
import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

//Services
import { login } from "src/services/authService";

//Components
import { Label } from "src/components/ui/label/label";
import { Button } from "src/components/ui/button/button";
import { useToast } from "src/components/ui/toast/useToast";
import { ThemeSwitch } from "src/components/ui/themeSwtich";
import { Checkbox } from "src/components/ui/checkbox/checkbox";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card/card";
import {
  RenderInput,
  RenderSubmitButton,
  RenderInputPassword,
  RenderRegistrationFormGroup,
} from "src/components/common/form";

//Context
import { CommonContext } from "src/context/commonContext";

const DEMO_EMAIL = "admin@example.com";
const DEMO_PASSWORD = "admin123";

type loginFormValues = {
  username: string;
  password: string;
};

export function LoginPage() {
  const navigate = useNavigate();

  const { toast } = useToast();

  const { languageData } = useContext(CommonContext);

  //Login Data
  const initialFormValues: loginFormValues = {
    username: "",
    password: "",
  };
  //initial parameters
  const [data, setData] = useState(initialFormValues);

  //Password visibility and remember me
  const [rememberMe, setRememberMe] = useState(false);

  //Loading
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadSubmitBtn, setIsLoadSubmitBtn] = useState(false);

  //Error
  const [error, setError] = useState("");

  const schema = Yup.object().shape({
    username: Yup.string().required("Username is required!"),
    password: Yup.string().required("Password is required!"),
  });

  const doSubmit = async (values: loginFormValues) => {
    try {
      const response = await login(values);
      toast({
        variant: response.result ? "success" : "destructive",
        title: response.result ? languageData.success : languageData.error,
        description:
          languageData[response.result ? "loginSuccess" : "loginFailed"],
        position: "top-right",
        duration: 3000,
      });
      if (response.result) {
        navigate("/dashboard");
      }
    } catch (ex: any) {
      Object.values(ex.response.data.errors).forEach((error) => {
        toast({
          variant: "destructive",
          title: languageData.error,
          description: error as string,
        });
      });
    }
  };

  const formik = useFormik<loginFormValues>({
    initialValues: initialFormValues,
    validationSchema: schema,
    onSubmit: doSubmit,
  });

  const onChangeValues = (values: loginFormValues) => {
    formik.setValues(values);
    setData(values);
  };

  const usernameFormData = [
    {
      name: "username",
      label: "Username",
      render: RenderInput,
      isRequired: true,
      isShow: true,
    },
  ];

  const passwordFormData = [
    {
      name: "password",
      label: "Password",
      render: RenderInputPassword,
      isRequired: true,
      isShow: true,
    },
  ];

  return (
    <div className="relative flex min-h-svh items-center justify-center bg-background p-4">
      {/* Theme toggle — top-right corner */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeSwitch />
      </div>

      {/* Subtle background pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.015] dark:opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        {/* Logo / Branding */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {languageData.schoolManagementSystem}
          </h1>
        </div>

        <Card className="border-border/60 shadow-xl shadow-black/5">
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-left">
              {languageData.loginAccount}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={formik.handleSubmit}
              className="grid gap-4"
              id="login-form">
              {/* Error message */}
              {error && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Email */}
              <div className="grid gap-2">
                <RenderRegistrationFormGroup
                  data={usernameFormData}
                  formik={formik}
                  onChange={(values) => onChangeValues(values)}
                />
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password"></Label>
                  <Link
                    to={"/forgot-password"}
                    className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                    {languageData.forgetPassword}?
                  </Link>
                </div>
                <div className="relative">
                  <RenderRegistrationFormGroup
                    data={passwordFormData}
                    formik={formik}
                    onChange={(values) => onChangeValues(values)}
                  />
                </div>
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(v) => setRememberMe(v === true)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal text-muted-foreground cursor-pointer">
                  {languageData.rememberMe}
                </Label>
              </div>

              {/* Submit */}
              <RenderSubmitButton
                type="submit"
                className="w-full"
                label={languageData.signIn}
                disabled={!formik.isValid}
                isLoad={isLoadSubmitBtn}
              />
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <p className="text-center text-sm text-muted-foreground">
              {languageData.dontHaveAccount}{" "}
              <Link
                to={"/sign-up"}
                className="font-medium text-primary underline-offset-4 hover:underline">
                {languageData.createAccount}
              </Link>
            </p>
          </CardFooter>
        </Card>

        {/* Demo credentials hint */}
        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3">
          <p className="mb-1.5 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {languageData.demoCredentials}
          </p>
          <div className="flex items-center justify-between gap-2 text-sm">
            <div className="grid gap-0.5 text-muted-foreground">
              <span>
                <span className="font-medium text-foreground">
                  {languageData.email}:
                </span>{" "}
                {DEMO_EMAIL}
              </span>
              <span>
                <span className="font-medium text-foreground">
                  {languageData.password}:
                </span>{" "}
                {DEMO_PASSWORD}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => {}}
              className="shrink-0 text-xs">
              {languageData.autoFill}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
