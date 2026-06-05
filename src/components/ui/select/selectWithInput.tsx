import { useMemo, useState } from "react";

//Icons
import { Search } from "lucide-react";

//Components
import { Input } from "src/components/ui/input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select/select";

//Utils
import { cn } from "src/utils/utils";

type Option = {
  label: string;
  value: string;
};

type SelectWithInputProps = {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  className?: string;
};

export function SelectWithInput({
  options,
  value,
  onValueChange,
  placeholder = "Select option",
  searchPlaceholder = "Search...",
  className,
}: SelectWithInputProps) {
  const [query, setQuery] = useState("");

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter(
      (opt) =>
        opt.label.toLowerCase().includes(normalized) ||
        opt.value.toLowerCase().includes(normalized),
    );
  }, [options, query]);

  return (
    <div className={cn("space-y-2", className)}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={searchPlaceholder}
        leftIcon={<Search className="h-4 w-4" />}
      />

      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))
          ) : (
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
              No results
            </div>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
