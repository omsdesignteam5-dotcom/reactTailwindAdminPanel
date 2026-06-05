import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

//Icons
import { LogOut, User } from "lucide-react";

//LocalStorage
import {
  getLocalStorageCurrentUserData,
  removeAllLocalStorageItems,
} from "src/services/localStorage";

//Components
import { Button } from "src/components/ui/button/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "src/components/ui/avatar/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "src/components/ui/dropdown/dropdownMenu";

//Context
import CommonContext from "src/context/commonContext";

type CurrentUser = {
  fullName: string;
  email: string;
};

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { languageData } = useContext(CommonContext);

  //Current User Data
  // Get string from localStorage service
  const currentUserString = getLocalStorageCurrentUserData();

  // Parse string to object
  const currentUser: CurrentUser | null = currentUserString
    ? JSON.parse(currentUserString)
    : null;

  const handleSignOut = () => {
    removeAllLocalStorageItems();
    navigate("/login");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt="User" />
            <AvatarFallback>
              {currentUser?.fullName
                ? currentUser.fullName
                    .split(" ")
                    .map((item) => item[0])
                    .join("")
                    .toUpperCase()
                : "AD"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium leading-none">
              {currentUser?.fullName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            onClick={() => {
              navigate("/profile");
            }}>
            <User className="mr-2 h-4 w-4" />
            {languageData.profile}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          {languageData.signOut}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
