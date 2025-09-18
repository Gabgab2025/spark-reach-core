import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminTheme } from "@/providers/AdminThemeProvider";

export function AdminThemeToggle() {
  const { theme, setTheme } = useAdminTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle admin theme</span>
    </Button>
  );
}