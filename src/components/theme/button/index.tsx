"use client"

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ButtonThemeToggler() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(()=> {
    if (theme && theme === 'system' && resolvedTheme) return setTheme(resolvedTheme);
  }, [theme, setTheme]);

  return (
    <Button
      className="rounded-full bg-muted border transition-colors cursor-pointer w-10 h-10"
      variant="ghost"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-gray-800" />}
    </Button>
  )
}