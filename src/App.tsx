import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React, { Suspense, useState, useEffect, useReducer } from "react";

//Default CSS
import "src/index.css";

//Services
import {
  getAllLanguages,
  getLanguageData,
  type LanguageData,
  getCurrentLanguage,
  setLanguage,
} from "src/services/languageService";

//Components
import { LoginPage } from "src/pages/auth/login";
import { Toaster } from "src/components/ui/toast/toaster";
import ProtectedRoute from "src/pages/auth/protectedRoute";

//Context
import CommonContext from "src/context/commonContext";
import { ThemeProvider } from "src/context/themeContext";

//Config
import { baseUrl } from "src/config/config.json";

type AppState = {
  languageData: Record<string, string>;
  connection: unknown | null;
};

const initialState: AppState = {
  languageData: {},
  connection: null,
};

type AppAction = { type: "setLanguageData"; payload: Record<string, string> };

const reducer: React.Reducer<AppState, AppAction> = (state, action) => {
  switch (action.type) {
    case "setLanguageData":
      return { ...state, languageData: action.payload };
    default:
      throw new Error(`Unsupported action type ${action.type}`);
  }
};

function toLanguageMap(value: unknown): Record<string, string> {
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed as Record<string, string>;
      }
      return {};
    } catch {
      return {};
    }
  }

  if (value && typeof value === "object") {
    return value as Record<string, string>;
  }

  return {};
}

function App() {
  const [common, dispatch] = useReducer(reducer, initialState);

  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [basicInfo] = useState({});

  const baseRoute = import.meta.env.BASE_URL || "/";

  useEffect(() => {
    (async () => {
      try {
        await loadLanguagesData();
      } catch (ex) {
        console.error("Error loading languages data in useEffect:", ex);
      }
    })();
  }, []);

  const loadLanguagesData = async () => {
    try {
      const res = await getAllLanguages();
      const siteLanguages = res.data?.data ?? [];
      if (siteLanguages.length > 0) {
        setLanguages(siteLanguages);
      }
      const currentLanguage = getCurrentLanguage();
      if (currentLanguage == null) {
        setLanguage(siteLanguages[0]);
      }

      const languagePath =
        currentLanguage?.directory || siteLanguages[0]?.directory || "eng";

      const { data } = await getLanguageData(languagePath);
      const languageData = toLanguageMap(data.data);
      dispatch({ type: "setLanguageData", payload: languageData });
    } catch (ex) {
      console.error("Error loading languages data in loadLanguageData:", ex);
    }
  };

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse">Loading...</div>
    </div>
  );

  return (
    <ThemeProvider defaultTheme="system">
      <CommonContext.Provider value={common}>
        <BrowserRouter basename={baseRoute}>
          <Suspense fallback={loading}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="*"
                element={
                  <ProtectedRoute languages={languages} basicInfo={basicInfo} />
                }
              />
            </Routes>
            <Toaster />
          </Suspense>
        </BrowserRouter>
      </CommonContext.Provider>
    </ThemeProvider>
  );
}

export default App;
