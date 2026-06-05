import React, { useContext } from "react";
import { Search } from "lucide-react";

//Utils
import { cn } from "src/utils/utils";

// Components
import { Button } from "src/components/ui/button/button";

//Context
import { CommonContext } from "src/context/commonContext";

type Id = string | number;
type ParamsState = Record<string, string | number | Date | null | undefined>;

interface SelectOption {
  id?: Id;
  value?: Id;
  name?: string;
  mainShopId?: Id;
  [key: string]: unknown;
}

interface GroupItem {
  key: string;
  [key: string]: unknown;
}

interface SelectedGroup {
  key: string;
  isSelect?: boolean;
  isGroup?: boolean;
  isShow?: boolean;
}

interface RenderFieldProps {
  name: string;
  placeholder?: string;
  value?: unknown;
  onChange: (value: unknown) => void;
  defaultText?: string;
  options?: SelectOption[];
  minDate?: Date | string;
  maxDate?: Date | string;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
  setSelectedAdmin?: React.Dispatch<React.SetStateAction<SelectOption>>;
  isOnlyMonthSelect?: boolean;
}

type RenderFieldComponent = React.ComponentType<RenderFieldProps>;

interface FilterItem {
  name: string;
  label?: string;
  placeholder?: string;
  render: RenderFieldComponent;
  isShow?: boolean;
  isCustomSelect?: boolean;
  isDateInput?: boolean;
  value?: string | Date | null;
  defaultText?: string;
  options?: SelectOption[];
  minDate?: Date | string;
  maxDate?: Date | string;
  dateFormat?: string;
  className?: string;
  disabled?: boolean;
  isOnlyMonthSelect?: boolean;
  setSelectedOptions?: (options: Array<Record<string, unknown>>) => void;
}

interface CustomSelectChange {
  value: Id;
  mainShopId?: Id;
  [key: string]: unknown;
}

interface FilterProps {
  includeGroup?: boolean;
  showFilterTitle?: boolean;
  data?: FilterItem[];
  params?: ParamsState;
  setParams: React.Dispatch<React.SetStateAction<ParamsState>>;
  selectedAdmin?: SelectOption;
  setSelectedAdmin?: React.Dispatch<React.SetStateAction<SelectOption>>;
  initialItemsGroup?: GroupItem[];
  itemsForGroup?: GroupItem[];
  setItemsForGroup?: React.Dispatch<React.SetStateAction<GroupItem[]>>;
  selectedGroups?: SelectedGroup[];
  setSelectedGroups?: React.Dispatch<React.SetStateAction<SelectedGroup[]>>;
  loadApi?: () => void | Promise<void>;
  isLoad?: boolean;
  setIsLoad?: React.Dispatch<React.SetStateAction<boolean>>;
  isAdminRole?: boolean;
  needToResize?: boolean;
  fromEmployee?: boolean;
}

const isNativeChangeEvent = (
  value: unknown,
): value is React.ChangeEvent<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
> => {
  return (
    typeof value === "object" &&
    value !== null &&
    "currentTarget" in value &&
    typeof (value as { currentTarget?: unknown }).currentTarget === "object"
  );
};

export const Filter: React.FC<FilterProps> = ({
  includeGroup = true,
  showFilterTitle = true,
  data = [],
  params = {},
  setParams,
  selectedAdmin = {},
  setSelectedAdmin,
  initialItemsGroup = [],
  itemsForGroup,
  setItemsForGroup,
  selectedGroups,
  setSelectedGroups,
  loadApi,
  isLoad = false,
  setIsLoad,
  isAdminRole = false,
  needToResize = false,
  fromEmployee = false,
}) => {
  const { languageData } = useContext(CommonContext);
  const onChangeValues = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = event.currentTarget;
    setParams((prev) => ({ ...prev, [name]: value }));

    if (!includeGroup || type === "text") return;

    data.forEach((item) => {
      if (item.name === name && typeof item.setSelectedOptions === "function") {
        const finalName = item.name.endsWith("s")
          ? item.name.slice(0, -1)
          : item.name;
        const optionName = item.options?.find(
          (opt) => String(opt.id) === String(value),
        )?.name;

        item.setSelectedOptions([
          {
            id: value,
            name: optionName,
            [finalName]: value,
          },
        ]);
      }
    });

    if (itemsForGroup && setItemsForGroup) {
      if (value) {
        if (name !== "shopId") {
          setItemsForGroup(
            itemsForGroup.filter((item) => item.key !== `${name}s`),
          );
        }
      } else {
        setItemsForGroup(initialItemsGroup);
      }
    }

    if (selectedGroups && setSelectedGroups && name !== "shopId") {
      const nextGroups = selectedGroups.map((group) =>
        group.key === `${name}s` && value
          ? { ...group, isSelect: false, isGroup: false, isShow: false }
          : group,
      );
      setSelectedGroups(nextGroups);
    }
  };

  const onChangeCustomSelect = (event: CustomSelectChange, name: string) => {
    const value = event.value;

    if (setSelectedAdmin) {
      setSelectedAdmin(event);
    }

    setParams((prev) => ({ ...prev, [name]: value as string | number }));

    if (!includeGroup) return;

    data.forEach((item) => {
      if (item.name === name && typeof item.setSelectedOptions === "function") {
        const finalName = item.name.endsWith("s")
          ? item.name.slice(0, -1)
          : item.name;
        const optionName = item.options?.find(
          (opt) => String(opt.id) === String(value),
        )?.name;

        item.setSelectedOptions([
          {
            id: value,
            name: optionName,
            [finalName]: value,
          },
        ]);
      }
    });

    if (itemsForGroup && setItemsForGroup) {
      setItemsForGroup(itemsForGroup.filter((item) => item.key !== `${name}s`));
    }

    if (selectedGroups && setSelectedGroups) {
      const nextGroups = selectedGroups.map((group) =>
        group.key === `${name}s`
          ? { ...group, isSelect: false, isGroup: false, isShow: false }
          : group,
      );
      setSelectedGroups(nextGroups);
    }
  };

  const handleDateChange = (date: Date | null, name: string) => {
    setParams((prev) => ({ ...prev, [name]: date }));
  };

  const renderFormClassName = () =>
    cn(
      "min-w-0",
      isAdminRole || fromEmployee
        ? "w-full sm:w-[240px] md:w-[260px]"
        : needToResize
          ? "w-full md:w-[320px]"
          : "w-full sm:w-[260px]",
    );

  const renderButtonClassName = () => cn("w-full sm:w-auto");

  return (
    <div
      className={cn(
        "group-report-wrap rounded-xl p-0",
        showFilterTitle
          ? "border border-border bg-card text-card-foreground shadow-sm"
          : "border-0 bg-transparent shadow-none",
      )}>
      {showFilterTitle && (
        <div className="border-b border-border px-4 py-3">
          <span className="text-sm font-medium">{languageData.filter}</span>
        </div>
      )}

      <div className={cn(showFilterTitle && "px-4 py-3")}>
        <div className="flex flex-wrap items-end gap-3">
          {data.map((item, idx) => {
            if (!(item.isShow || item.isShow === undefined)) return null;

            const selectedValue = !item.isCustomSelect
              ? item.isDateInput
                ? item.value
                  ? new Date(item.value)
                  : null
                : params[item.name]
              : item.name !== "adminId"
                ? item.options?.find(
                    (opt) =>
                      String(opt.value) === String(params[item.name]) ||
                      String(opt.id) === String(params[item.name]),
                  )
                : item.options?.find(
                    (opt) =>
                      String(opt.value) === String(selectedAdmin?.value) &&
                      String(opt.mainShopId) ===
                        String(selectedAdmin?.mainShopId),
                  );

            return (
              <div key={idx} className={renderFormClassName()}>
                {item.label && (
                  <label className={cn("mb-1 block text-sm font-medium")}>
                    {item.label}
                  </label>
                )}

                <item.render
                  name={item.name}
                  placeholder={item.placeholder}
                  value={selectedValue}
                  onChange={(e: unknown) => {
                    if (!e) {
                      if (
                        item.isCustomSelect &&
                        item.name === "adminId" &&
                        setSelectedAdmin
                      ) {
                        setSelectedAdmin({});
                      }

                      setParams((prev) => ({
                        ...prev,
                        [item.name]: item.isDateInput ? null : "",
                      }));
                      return;
                    }

                    if (item.isDateInput) {
                      handleDateChange(e as Date | null, item.name);
                      return;
                    }

                    if (item.isCustomSelect) {
                      onChangeCustomSelect(e as CustomSelectChange, item.name);
                      return;
                    }

                    if (isNativeChangeEvent(e)) {
                      onChangeValues(e);
                    }
                  }}
                  defaultText={item.defaultText}
                  options={item.options}
                  minDate={item.minDate}
                  maxDate={item.maxDate}
                  dateFormat={item.dateFormat}
                  className={item.className}
                  disabled={item.disabled}
                  setSelectedAdmin={setSelectedAdmin}
                  isOnlyMonthSelect={item.isOnlyMonthSelect}
                />
              </div>
            );
          })}

          {!includeGroup && (
            <div className={renderButtonClassName()}>
              <Button
                type="button"
                className="filter-search-btn"
                disabled={isLoad}
                onClick={() => {
                  setIsLoad?.(true);
                  setParams((prev) => ({ ...prev, page: 1 }));
                  void loadApi?.();
                }}>
                <Search className="h-4 w-4" />
                <span>{languageData.search}</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
