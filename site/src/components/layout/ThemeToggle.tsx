import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./useTheme";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const label = theme === "dark" ? "Switch to light theme" : "Switch to dark theme";
  return (
    <Button variant="ghost" size="icon" onClick={toggle} aria-label={label} title={label} data-testid="theme-toggle">
      {theme === "dark" ? <Sun /> : <Moon />}
    </Button>
  );
}
