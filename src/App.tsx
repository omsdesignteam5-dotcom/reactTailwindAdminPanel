import React, {
  Suspense,
  useState,
  useEffect,
  useRef,
  useReducer,
} from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//Default CSS
import "./App.css";

//Services
import {
  setLanguage,
  getAllLanguages,
  type LanguageData,
  getLanguageData,
  getCurrentLanguage,
} from "./services/languageService";

//Components
import Login from "./pages/auth/login";
import ProtectedRoute from "./pages/auth/protectedRoute";

//Context
import CommonContext from "./context/commonContext";
import { ThemeProvider } from "./context/themeContext";

function App() {
  const [languages, setLanguages] = useState<LanguageData[]>([]);
  const [basicInfo, setBasicInfo] = useState({});

  const baseRoute = import.meta.env.BASE_URL || "/";
  const contextValue = {
    languageData: {},
    connection: null,
  }; // Define your context value here

  useEffect(() => {
    (async () => {
      // Clear any existing web session if deep-linking from merchant app editor
      try {
        await loadLanguagesData();
      } catch (ex) {
        console.error("Error loading languages data:", ex);
      }
    })();
  }, []);

  const loadLanguagesData = async () => {
    try {
      const res = await getAllLanguages();
      const siteLanguages = res.data?.data ?? [];
      setLanguages(siteLanguages);
    } catch (ex) {
      console.error("Error loading languages data:", ex);
    }
  };

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse">Loading...</div>
    </div>
  );

  return (
    <ThemeProvider defaultTheme="system">
      <CommonContext.Provider value={contextValue}>
        <BrowserRouter basename={baseRoute}>
          <Suspense fallback={loading}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="*"
                element={
                  <ProtectedRoute languages={languages} basicInfo={basicInfo} />
                }
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CommonContext.Provider>
    </ThemeProvider>
  );
}

export default App;
