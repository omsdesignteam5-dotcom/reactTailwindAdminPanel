import React from "react";

export interface CommonContextValue {
  languageData: Record<string, string>;
  connection: unknown | null;
}

export const CommonContext = React.createContext<CommonContextValue>({
  languageData: {},
  connection: null,
});

export default CommonContext;
