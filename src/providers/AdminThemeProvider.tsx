import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const AdminThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function AdminThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "admin-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  useEffect(() => {
    // Create a scoped container for admin theme instead of modifying document root
    const adminContainer = document.querySelector('[data-admin-theme-scope]');
    if (adminContainer) {
      adminContainer.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";

        adminContainer.classList.add(systemTheme);
        return;
      }

      adminContainer.classList.add(theme);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <AdminThemeProviderContext.Provider {...props} value={value}>
      {children}
    </AdminThemeProviderContext.Provider>
  );
}

export const useAdminTheme = () => {
  const context = useContext(AdminThemeProviderContext);

  if (context === undefined)
    throw new Error("useAdminTheme must be used within an AdminThemeProvider");

  return context;
};