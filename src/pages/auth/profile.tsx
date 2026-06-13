import * as Yup from "yup";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

//Services
import { getProfileData, updateProfile } from "src/services/adminService";

//Components
import { useToast } from "src/components/ui/toast/useToast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card/card";
import {
  RenderInput,
  RenderSwitch,
  RenderImageCrop,
  RenderSubmitButton,
  RenderCancelButton,
  RenderFormDataParallel,
  RenderRegistrationFormGroup,
} from "src/components/common/form";

//Context
import { CommonContext } from "src/context/commonContext";

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { languageData } = useContext(CommonContext);

  const initialFormValues = {
    name: "",
    fullName: "",
    email: "",
    phone: "",
    image: "",
    status: "",
  };
  const crop = {
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  };

  //initial parameters
  const [data, setData] = useState(initialFormValues);

  //pageLoad and button load
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoadSubmitBtn, setIsLoadSubmitBtn] = useState(false);

  const schema = Yup.object().shape({
    name: Yup.string().required(languageData.loginNameIsRequired),
    fullName: Yup.string().required(languageData.fullNameIsRequired),
    email: Yup.string().email().required(languageData.emailIsRequired),
    phone: Yup.string().required(languageData.phoneIsRequired),
    image: Yup.string().nullable(),
    status: Yup.number().max(1),
  });

  useEffect(() => {
    (async () => {
      try {
        await populateProfileData();
      } catch (error) {
        console.log("Error fetching profile data:", error);
        toast({
          title: languageData.error,
          description: languageData.fetchProfileDataError,
          variant: "destructive",
        });
      }
    })();
  }, []);

  const populateProfileData = async () => {
    try {
      setPageLoad(true);
      const rData: any = await getProfileData();
      if (rData.result) {
        let sampleData = rData.data;
        let tempData = {
          name: sampleData.name,
          fullName: sampleData.fullName,
          email: sampleData.email,
          phone: sampleData.phone,
          image: sampleData.image,
          status: sampleData.status,
        };

        setData(tempData);
        onChangeValues(tempData);
      }
      setPageLoad(false);
    } catch (err: any) {
      console.log("Profile API error:", {
        status: err?.response?.status,
        data: err?.response?.data,
        message: err?.message,
      });
      toast({
        title: languageData.error,
        description: err.message,
        variant: "destructive",
      });
      setPageLoad(false);
    }
  };

  const doSubmit = async (values: any) => {
    setIsLoadSubmitBtn(true);
    try {
      let response = await updateProfile(values);
      toast({
        variant: response.result ? "success" : "destructive",
        title: response.result ? languageData.success : languageData.error,
        description: languageData[response.message],
        position: "top-right",
        duration: 3000,
      });
      if (response.result) {
        navigate("/dashboard");
      }
    } catch (err: any) {
      // Loop through each error and show a toast notification
      Object.values(err.response.data.errors).forEach((error) => {
        toast({
          variant: "destructive",
          title: languageData.error,
          description: error as string,
        });
      });
    }
    setIsLoadSubmitBtn(false);
  };

  // declare formik
  const formik = useFormik({
    initialValues: data,
    validationSchema: schema,
    onSubmit: doSubmit,
  });

  const onChangeValues = (values: any) => {
    formik.setValues(values);
    setData(values);
  };

  const formValues = [
    {
      name: "name",
      label: languageData.loginName,
      placeholder: languageData.enterLoginName,
      render: RenderInput,
      isRequired: true,
    },
    {
      name: "fullName",
      label: languageData.fullName,
      placeholder: languageData.enterFullName,
      render: RenderInput,
      isRequired: true,
    },
    {
      name: "email",
      label: languageData.email,
      placeholder: languageData.enterEmail,
      render: RenderInput,
      isRequired: true,
    },
    {
      name: "phone",
      label: languageData.phone,
      placeholder: languageData.enterPhone,
      render: RenderInput,
      isRequired: true,
    },
    {
      name: "image",
      label: languageData.image,
      render: RenderImageCrop,
      crop: crop,
      showHorizontal: true,
      isRequired: true,
      warningMessage: languageData.productImageSizeWarningMsg,
      // Pass filename (like old JSX props.value)
      value:
        typeof formik.values.image === "string"
          ? formik.values.image
          : undefined,
      // Upload callback: receives the server filename after upload
      getFile: (fileName: string | null) => {
        if (fileName) {
          formik.setFieldValue("image", fileName);
        }
      },
    },
    {
      name: "status",
      label: languageData.status,
      render: RenderSwitch,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>{languageData.profile}</CardTitle>
        </div>
      </CardHeader>
      <form onSubmit={formik.handleSubmit}>
        <CardContent>
          <RenderFormDataParallel
            data={formValues}
            formik={formik}
            onChange={(values) => onChangeValues(values)}
          />
        </CardContent>
        <CardFooter className="justify-center gap-2">
          <RenderSubmitButton
            className="btn btn-primary px-4 mb-0"
            label={languageData.update}
            disabled={!formik.isValid}
            isLoad={isLoadSubmitBtn}
          />
          <RenderCancelButton label={languageData.cancel} />
        </CardFooter>
      </form>
    </Card>
  );
}
