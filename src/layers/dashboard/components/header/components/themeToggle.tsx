import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@components/ui/button";
import useThemeSchema from "../../../../hooks/useThemeSchema.hook";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useThemeSchema();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return (
    <Button variant="ghost" size="icon" className="rounded-full" onClick={toggleTheme}>
      {isDark ? <Sun className="size-4.5" /> : <Moon className="size-4.5" />}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}

export default ThemeToggle;
