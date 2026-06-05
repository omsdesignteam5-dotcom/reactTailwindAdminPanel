import { Check, Globe } from "lucide-react";

// Components
import { Button } from "src/components/ui/button/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown/dropdownMenu";

// Services
import {
  getCurrentLanguage,
  setLanguage,
  type LanguageData,
} from "src/services/languageService";

// Config
import config from "src/config/config.json";

// Utils
import { cn } from "src/utils/utils";

// Config
const { imageDisplayUrl } = config;

interface LanguageDropdownProps {
  languages: LanguageData[];
}

export function LanguageDropdown({ languages }: LanguageDropdownProps) {
  const storedLanguage = getCurrentLanguage();

  const currentLanguage =
    languages.find((language) => {
      return String(language.id) === String(storedLanguage?.id);
    }) ?? languages[0];

  if (!currentLanguage) {
    return null;
  }

  console.log("Current language:", currentLanguage);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-2 px-2 text-muted-foreground hover:text-foreground">
          <Globe className="h-4 w-4 md:hidden" />

          <div className="items-center gap-2 md:flex">
            {currentLanguage.image ? (
              <img
                src={imageDisplayUrl + currentLanguage.image}
                alt={currentLanguage.name ?? "Language"}
                className="h-5 w-5 rounded-sm object-cover"
              />
            ) : (
              <Globe className="h-4 w-4" />
            )}

            <span className="max-w-28 truncate text-sm text-dark font-medium">
              {currentLanguage.name ?? currentLanguage.code ?? "Language"}
            </span>
          </div>

          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-48">
        {languages.map((language) => {
          const isSelected = String(language.id) === String(currentLanguage.id);

          return (
            <DropdownMenuItem
              key={String(language.id)}
              onClick={() => {
                void setLanguage(language);
              }}>
              {language.image ? (
                <img
                  src={imageDisplayUrl + language.image}
                  alt={language.name ?? "Language"}
                  className="h-5 w-5 rounded-sm object-cover"
                />
              ) : (
                <Globe className="h-4 w-4" />
              )}

              <span className="truncate">
                {language.name ?? language.code ?? "Unknown language"}
              </span>

              <Check
                className={cn("ml-auto h-4 w-4", !isSelected && "invisible")}
              />
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
