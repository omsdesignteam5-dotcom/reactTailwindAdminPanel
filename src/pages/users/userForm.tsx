import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";

//Icons
import { XCircle } from "lucide-react";

//Services
import { getUserDataById, createOrUpdateUser } from "src/services/usersService";

//Components
import { Button } from "src/components/ui/button/button";
import { useToast } from "src/components/ui/toast/useToast";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "src/components/ui/card/card";
import {
  RenderInput,
  RenderSwitch,
  RenderInputPassword,
  RenderSubmitButton,
  RenderCancelButton,
  RenderFormDataParallel,
} from "src/components/common/form";

//Context
import { CommonContext } from "src/context/commonContext";

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

type UserFormValues = {
  id: number;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  status: number | boolean;
};

export default function UserForm() {
  const navigate = useNavigate();
  const pastRoute = "/setting/users";

  const { languageData } = useContext(CommonContext);

  const { id: userId } = useParams<{ id?: string }>(); // string | undefined

  const userIdNumber = userId ? Number(userId) : 0; // number
  const isEditMode =
    Boolean(userId) && Number.isInteger(userIdNumber) && userIdNumber > 0;

  const { toast } = useToast();

  const initialFormValues: UserFormValues = {
    id: 0,
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    status: 1,
  };
  //initial parameters
  const [data, setData] = useState(initialFormValues);

  //Loading
  const [isLoad, setIsLoad] = useState(false);
  const [isLoadSubmitBtn, setIsLoadSubmitBtn] = useState(false);

  const schema = Yup.object().shape({
    id: Yup.number().nullable(),
    email: Yup.string()
      .email(languageData.invalidEmail)
      .required(languageData.emailIsRequired),
    firstName: Yup.string().required(languageData.firstNameIsRequired),
    lastName: Yup.string().required(languageData.lastNameIsRequired),
    password: isEditMode
      ? Yup.string().notRequired()
      : Yup.string()
          .min(
            8,
            languageData.passwordLengthMustBe + " 8" + languageData.characters,
          )
          .required(languageData.passwordIsRequired)
          .matches(passwordRegex, languageData.requiredPasswordTypes),
    confirmPassword: isEditMode
      ? Yup.string().notRequired()
      : Yup.string()
          .required(languageData.confirmPasswordIsRequired)
          .oneOf([Yup.ref("password")], languageData.passwordsDoNotMatch),
  });

  useEffect(() => {
    void populateUserData();
  }, []);

  const populateUserData = async () => {
    try {
      if (!isEditMode) {
        return;
      } else if (isEditMode) {
        const response = (await getUserDataById(userIdNumber)) as {
          result?: boolean;
          data?: UserFormValues;
        };

        if (response.result && response.data) {
          setData(response.data);
          formik.setValues(response.data);
        }
      }
    } catch (ex) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while fetching user data",
      });
    }
  };

  const doSubmit = async (values: UserFormValues) => {
    setIsLoadSubmitBtn(true);
    try {
      const payload = {
        ...values,
        status:
          values.status === true ||
          values.status === 1 ||
          String(values.status) === "1"
            ? 1
            : 0,
      };

      const response = (await createOrUpdateUser(payload)) as {
        result?: boolean;
        message?: string;
      };
      toast({
        variant: response.result ? "success" : "destructive",
        title: response.result ? languageData.success : languageData.error,
        description: response.message
          ? (languageData[response.message] ?? response.message)
          : "",
        position: "top-right",
        duration: 3000,
      });
      if (response.result) {
        navigate(pastRoute);
      }
      setIsLoadSubmitBtn(false);
    } catch (ex: any) {
      // Loop through each error and show a toast notification
      Object.values(ex.response.data.errors).forEach((error) => {
        toast({
          variant: "destructive",
          title: "Error",
          description: error as string,
        });
      });
    }
  };

  // declare formik
  const formik = useFormik<UserFormValues>({
    initialValues: initialFormValues,
    validationSchema: schema,
    onSubmit: doSubmit,
  });

  const onChangeValues = (values: UserFormValues) => {
    formik.setValues(values);
    setData(values);
  };

  const emailFormData = [
    {
      name: "email",
      label: languageData.email,
      render: RenderInput,
      isRequired: true,
      isShow: true,
    },
    {
      name: "status",
      label: languageData.status,
      render: RenderSwitch,
      isRequired: true,
      isShow: true,
    },
  ];

  const generalFormData = [
    {
      name: "firstName",
      label: languageData.firstName,
      render: RenderInput,
      isRequired: true,
      isShow: true,
    },
    {
      name: "lastName",
      label: languageData.lastName,
      render: RenderInput,
      isRequired: true,
      isShow: true,
    },
    {
      name: "password",
      label: languageData.password,
      render: RenderInputPassword,
      isRequired: true,
      isShow: !isEditMode,
    },
    {
      name: "confirmPassword",
      label: languageData.confirmPassword,
      render: RenderInputPassword,
      isRequired: true,
      isShow: !isEditMode,
    },
  ];

  console.log("formik errors", formik.errors);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h5 className="tracking-tight text-foreground sm:text-1xl">
            {userIdNumber > 0
              ? languageData.userEditionForm
              : languageData.addNewUser}
          </h5>
          <Button
            onClick={() => navigate(pastRoute)}
            variant="ghost"
            size="icon"
            title={languageData.backToUsersList}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <RenderFormDataParallel
            data={emailFormData}
            formik={formik}
            onChange={(values) => onChangeValues(values)}
          />
          <RenderFormDataParallel
            data={generalFormData}
            formik={formik}
            onChange={(values) => onChangeValues(values)}
          />
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <RenderSubmitButton
            className="btn btn-primary px-4 mb-0"
            label={userIdNumber > 0 ? languageData.update : languageData.create}
            disabled={!formik.isValid}
            isLoad={isLoadSubmitBtn}
          />
          <RenderCancelButton label={languageData.cancel} />
        </CardFooter>
      </form>
    </Card>
  );
}
