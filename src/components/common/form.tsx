import React from "react";
import { useNavigate } from "react-router-dom";
import { type CheckedState } from "@radix-ui/react-checkbox";

// Icons
import { Check, X, type LucideIcon } from "lucide-react";

// Utils
import { cn } from "src/utils/utils";

// Form Components
import { Input } from "src/components/ui/input/input";
import { Label } from "src/components/ui/label/label";
import { Button } from "src/components/ui/button/button";
import { Switch } from "src/components/ui/checkbox/switch";
import { Textarea } from "src/components/ui/input/textarea";
import { Checkbox } from "src/components/ui/checkbox/checkbox";
import { InputGroup } from "src/components/ui/input/inputGroup";
import { DatePicker } from "src/components/ui/datePicker/datePicker";
import { ImageCrop } from "src/components/ui/fileUpload/imageUpload";
import { FileUpload } from "src/components/ui/fileUpload/fileUpload";
import { InputPassword } from "src/components/ui/input/inputPassword";
import {
  RadioGroup,
  RadioGroupItem,
} from "src/components/ui/checkbox/radioGroup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select/select";

type FormValues = Record<string, unknown>;

interface FormikLike<TValues extends FormValues = FormValues> {
  values: TValues;
  errors: Record<string, string | undefined>;
}

type FormChangeHandler<TValues extends FormValues = FormValues> = (
  values: TValues,
  name: string,
) => void;

type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface BaseRenderProps<TValues extends FormValues = FormValues> {
  label?: string;
  name: string;
  type?: string;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  options?: Array<Record<string, unknown>>;
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
  left?: React.ReactNode;
  right?: React.ReactNode;
  addOn?: React.ReactNode;
  src?: string;
  aspect?: number;
  formik: FormikLike<TValues>;
  onChange: FormChangeHandler<TValues>;
  isShow?: boolean;
  isRequired?: boolean;
  showNewLayout?: boolean;
  [key: string]: any;
}

type RenderComponent<TValues extends FormValues = FormValues> =
  React.ComponentType<BaseRenderProps<TValues>>;

interface FormItem<TValues extends FormValues = FormValues> extends Omit<
  BaseRenderProps<TValues>,
  "formik" | "onChange" | "name"
> {
  name: string;
  render: RenderComponent<TValues>;
  onChange?: FormChangeHandler<TValues>;
}

interface FormGroupProps<TValues extends FormValues = FormValues> {
  data?: FormItem<TValues>[];
  formik: FormikLike<TValues>;
  onChange: FormChangeHandler<TValues>;
}

interface FormikLike<TValues extends FormValues = FormValues> {
  values: TValues;
  errors: Record<string, string | undefined>;
  touched?: Record<string, boolean | undefined>;
  submitCount?: number;
}

const colSpanMap: Record<string, string> = {
  "12": "md:col-span-12",
  "9": "md:col-span-9",
  "8": "md:col-span-8",
  "6": "md:col-span-6",
  "4": "md:col-span-4",
  "3": "md:col-span-3",
};

const getColSpanClass = (col: string | number): string =>
  colSpanMap[String(col)] ?? "md:col-span-12";

const toInputValue = (value: unknown): string | number => {
  if (typeof value === "string" || typeof value === "number") return value;
  if (value == null) return "";
  return String(value);
};

const toOptionValue = (option: Record<string, unknown>): string => {
  const raw = option.value ?? option.id ?? "";
  return String(raw);
};

const toOptionLabel = (option: Record<string, unknown>): React.ReactNode => {
  return (option.label ??
    option.name ??
    option.value ??
    option.id ??
    "Unknown") as React.ReactNode;
};

const getFieldError = <TValues extends FormValues = FormValues>(
  formik: FormikLike<TValues>,
  name: string,
): string | undefined => {
  return formik.errors[name];
};

const RenderFieldError = <TValues extends FormValues = FormValues>({
  formik,
  name,
}: {
  formik: FormikLike<TValues>;
  name: string;
}) => {
  const error = getFieldError(formik, name);

  if (!error) return null;

  return <p className="mt-1 text-xs text-destructive">{error}</p>;
};

export const RenderSubmitButton: React.FC<{
  label?: string;
  className?: string;
  disabled?: boolean;
  isLoad?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: LucideIcon;
}> = ({
  label,
  className,
  disabled,
  isLoad = false,
  type = "submit",
  icon = Check,
}) => {
  const Icon = icon;
  return (
    <Button
      className={cn(className)}
      type={type}
      disabled={Boolean(disabled || isLoad)}>
      <Icon className={cn("h-4 w-4")} />
      <span>{label}</span>
    </Button>
  );
};

export const RenderCancelButton: React.FC<{
  label?: string;
  type?: "button" | "submit" | "reset";
  isLoad?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
}> = ({
  label,
  type = "button",
  isLoad = false,
  disabled,
  className,
  icon = X,
}) => {
  const navigate = useNavigate();
  const Icon = icon;

  return (
    <Button
      className={cn("px-4 ms-2 mb-0", className)}
      type={type}
      disabled={Boolean(disabled || isLoad)}
      onClick={() => navigate(-1)}
      variant="secondary">
      <Icon className={cn("h-4 w-4")} />
      <span>{label}</span>
    </Button>
  );
};

export const RenderInput = <TValues extends FormValues = FormValues>({
  name,
  type = "text",
  onChange,
  disabled = false,
  placeholder = "",
  formik,
  autoFocus = false,
  className,
}: BaseRenderProps<TValues>) => {
  const handleChangeValue = ({ currentTarget: input }: InputChangeEvent) => {
    onChange({ ...formik.values, [input.name]: input.value } as TValues, name);
  };

  const hasError = Boolean(formik.errors[name]);

  return (
    <Input
      type={type as React.HTMLInputTypeAttribute}
      name={name}
      value={toInputValue(formik.values[name])}
      onChange={handleChangeValue}
      disabled={disabled}
      placeholder={String(placeholder)}
      autoFocus={Boolean(autoFocus)}
      className={cn(
        hasError && "border-destructive focus-visible:ring-destructive/40",
        className,
      )}
      aria-invalid={hasError}
    />
  );
};

export const RenderInputPassword = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  placeholder = "",
  formik,
  autoFocus = false,
  className,
}: BaseRenderProps<TValues>) => {
  const handleChangeValue = ({ currentTarget: input }: InputChangeEvent) => {
    onChange({ ...formik.values, [input.name]: input.value } as TValues, name);
  };

  const hasError = Boolean(formik.errors[name]);

  return (
    <InputPassword
      name={name}
      value={toInputValue(formik.values[name])}
      onChange={handleChangeValue}
      disabled={disabled}
      placeholder={String(placeholder)}
      autoFocus={Boolean(autoFocus)}
      className={cn(
        hasError && "border-destructive focus-visible:ring-destructive/40",
        className,
      )}
      aria-invalid={hasError}
    />
  );
};

export const RenderTextarea = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  placeholder = "",
  formik,
  autoFocus = false,
  className,
}: BaseRenderProps<TValues>) => {
  const handleChangeValue = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = event.currentTarget;
    onChange({ ...formik.values, [input.name]: input.value } as TValues, name);
  };

  const hasError = Boolean(formik.errors[name]);

  return (
    <Textarea
      name={name}
      value={String(formik.values[name] ?? "")}
      onChange={handleChangeValue}
      disabled={disabled}
      placeholder={String(placeholder)}
      autoFocus={Boolean(autoFocus)}
      className={cn(
        hasError && "border-destructive focus-visible:ring-destructive/40",
        className,
      )}
      aria-invalid={hasError}
    />
  );
};

export const RenderInputGroup = <TValues extends FormValues = FormValues>({
  name,
  type = "text",
  onChange,
  disabled = false,
  placeholder = "",
  formik,
  autoFocus = false,
  className,
  left,
  right,
  addOn,
}: BaseRenderProps<TValues>) => {
  const hasError = Boolean(formik.errors[name]);

  const handleChangeValue = ({ currentTarget: input }: InputChangeEvent) => {
    onChange({ ...formik.values, [input.name]: input.value } as TValues, name);
  };

  return (
    <InputGroup className={cn(hasError && "border-destructive", className)}>
      {(left ?? addOn) && (
        <div className="flex items-center border-r border-input px-3 text-sm text-muted-foreground">
          {left ?? addOn}
        </div>
      )}
      <Input
        type={type as React.HTMLInputTypeAttribute}
        name={name}
        value={toInputValue(formik.values[name])}
        onChange={handleChangeValue}
        disabled={disabled}
        placeholder={String(placeholder)}
        autoFocus={Boolean(autoFocus)}
        className="rounded-none border-0 focus-visible:ring-0"
        aria-invalid={hasError}
      />
      {right && (
        <div className="flex items-center border-l border-input px-3 text-sm text-muted-foreground">
          {right}
        </div>
      )}
    </InputGroup>
  );
};

export const RenderSelect = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  placeholder = "Select option",
  formik,
  className,
  options = [],
}: BaseRenderProps<TValues>) => {
  const value = String(formik.values[name] ?? "");
  const hasError = Boolean(formik.errors[name]);

  return (
    <Select
      value={value}
      onValueChange={(next) => {
        onChange({ ...formik.values, [name]: next } as TValues, name);
      }}
      disabled={disabled}>
      <SelectTrigger
        className={cn(
          hasError && "border-destructive focus:ring-destructive/40",
          className,
        )}>
        <SelectValue placeholder={String(placeholder)} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => {
          const optionValue = toOptionValue(option);
          return (
            <SelectItem key={`${optionValue}-${index}`} value={optionValue}>
              {toOptionLabel(option)}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

export const RenderCheckbox = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  formik,
  label,
}: BaseRenderProps<TValues>) => {
  const checked = Boolean(formik.values[name]);

  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={name}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value: CheckedState) => {
          onChange(
            { ...formik.values, [name]: value === true } as TValues,
            name,
          );
        }}
      />
      <Label htmlFor={name}>{label ?? name}</Label>
    </div>
  );
};

export const RenderSwitch = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  formik,
  label,
}: BaseRenderProps<TValues>) => {
  const checked = Boolean(formik.values[name]);

  return (
    <div className="flex items-center gap-2">
      <Switch
        id={name}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(value) => {
          onChange({ ...formik.values, [name]: value } as TValues, name);
        }}
      />
    </div>
  );
};

export const RenderRadioGroup = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  formik,
  options = [],
  className,
}: BaseRenderProps<TValues>) => {
  const value = String(formik.values[name] ?? "");

  return (
    <RadioGroup
      value={value}
      onValueChange={(next) => {
        onChange({ ...formik.values, [name]: next } as TValues, name);
      }}
      disabled={disabled}
      className={cn("grid gap-2", className)}>
      {options.map((option, index) => {
        const optionValue = toOptionValue(option);
        return (
          <div
            key={`${optionValue}-${index}`}
            className="flex items-center gap-2">
            <RadioGroupItem id={`${name}-${optionValue}`} value={optionValue} />
            <Label htmlFor={`${name}-${optionValue}`}>
              {toOptionLabel(option)}
            </Label>
          </div>
        );
      })}
    </RadioGroup>
  );
};

export const RenderDatePicker = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  disabled = false,
  placeholder = "Pick a date",
  formik,
  className,
}: BaseRenderProps<TValues>) => {
  const selected =
    formik.values[name] instanceof Date
      ? (formik.values[name] as Date)
      : undefined;

  return (
    <DatePicker
      selected={selected}
      onSelect={(date) => {
        onChange({ ...formik.values, [name]: date } as TValues, name);
      }}
      placeholder={String(placeholder)}
      className={className}
      disabled={disabled}
    />
  );
};

export const RenderImageCrop = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  formik,
  className,
  src,
  aspect,
  maxSizeMB,
  multiple = false,
}: BaseRenderProps<TValues>) => {
  return (
    <ImageCrop
      src={src}
      aspect={aspect}
      maxSizeMB={maxSizeMB}
      multiple={Boolean(multiple)}
      className={className}
      onCroppedImage={(file) => {
        const nextValue = Boolean(multiple)
          ? [...((formik.values[name] as File[]) ?? []), file]
          : file;
        onChange({ ...formik.values, [name]: nextValue } as TValues, name);
      }}
    />
  );
};

export const RenderFileUpload = <TValues extends FormValues = FormValues>({
  name,
  onChange,
  formik,
  className,
  accept,
  multiple = false,
  maxSizeMB,
  disabled = false,
}: BaseRenderProps<TValues>) => {
  return (
    <FileUpload
      className={className}
      accept={accept}
      multiple={Boolean(multiple)}
      maxSizeMB={maxSizeMB}
      disabled={disabled}
      onFilesChange={(files) => {
        const nextValue = Boolean(multiple) ? files : (files[0] ?? null);
        onChange({ ...formik.values, [name]: nextValue } as TValues, name);
      }}
    />
  );
};

export const renderLabel = <TValues extends FormValues = FormValues>(
  label: React.ReactNode,
  name: string,
  formik: FormikLike<TValues>,
  required?: boolean,
) => {
  const requiredClassName = cn(
    "ms-2",
    formik.errors[name] ? "text-destructive" : "text-primary",
  );

  return (
    <div className="flex items-center gap-1">
      <Label className={cn("text-sm font-medium leading-none")}>{label}</Label>
      {required ? <small className={requiredClassName}>*</small> : null}
    </div>
  );
};

export const RenderFormGroup = <TValues extends FormValues = FormValues>({
  data = [],
  formik,
  onChange,
}: FormGroupProps<TValues>) => {
  return (
    <div className={cn("space-y-2")}>
      {data.map((item) => {
        if (!(item.isShow || item.isShow === undefined)) return null;

        return (
          <div
            key={item.name}
            className={cn("grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4")}>
            <div className={cn("mt-2 md:col-span-3")}>
              {renderLabel(
                item.label || "",
                item.name,
                formik,
                item.isRequired,
              )}
            </div>
            <div className={cn("mt-2 md:col-span-9")}>
              <item.render
                {...item}
                name={item.name}
                formik={formik}
                onChange={onChange}
              />
              <RenderFieldError formik={formik} name={item.name} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RenderRegistrationFormGroup = <
  TValues extends FormValues = FormValues,
>({
  data = [],
  formik,
  onChange,
  col = "12",
}: FormGroupProps<TValues> & { col?: string | number }) => {
  return (
    <div className={cn("grid grid-cols-1 gap-2 md:grid-cols-12")}>
      {data.map((item) => {
        if (!(item.isShow || item.isShow === undefined)) return null;

        return (
          <div key={item.name} className={cn(getColSpanClass(col), "mb-2")}>
            {renderLabel(item.label || "", item.name, formik, item.isRequired)}
            <item.render
              {...item}
              name={item.name}
              formik={formik}
              onChange={onChange}
            />
            <RenderFieldError formik={formik} name={item.name} />
          </div>
        );
      })}
    </div>
  );
};

export const RenderRegistrationFilesFormGroup = <
  TValues extends FormValues = FormValues,
>({
  data = [],
  formik,
  onChange,
}: FormGroupProps<TValues>) => {
  return (
    <div className={cn("space-y-2")}>
      {data.map((item) => {
        if (!(item.isShow || item.isShow === undefined)) return null;

        return (
          <div
            key={item.name}
            className={cn(Boolean(item.showNewLayout) && "mb-2")}>
            <div className={cn("grid grid-cols-1 gap-2")}>
              <div className={cn("mt-1")}>
                {renderLabel(
                  item.label || "",
                  item.name,
                  formik,
                  item.isRequired,
                )}
              </div>
              <div className={cn("mt-1 mb-1")}>
                <item.render
                  {...item}
                  name={item.name}
                  formik={formik}
                  onChange={onChange}
                />
                <RenderFieldError formik={formik} name={item.name} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const RenderFormDataParallel = <
  TValues extends FormValues = FormValues,
>({
  data = [],
  formik,
  onChange,
}: FormGroupProps<TValues>) => {
  return (
    <div className={cn("grid grid-cols-1 gap-3 md:grid-cols-2")}>
      {data.map((item, idx) => {
        if (!(item.isShow || item.isShow === undefined)) return null;

        return (
          <div key={`${item.name}-${idx}`} className={cn("mb-2")}>
            {renderLabel(item.label || "", item.name, formik, item.isRequired)}
            <item.render
              {...item}
              name={item.name}
              formik={formik}
              onChange={item.onChange ?? onChange}
            />
            <RenderFieldError formik={formik} name={item.name} />
          </div>
        );
      })}
    </div>
  );
};
