// src/app/provider.jsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }) {
  return (
    <NextThemesProvider 
      attribute="class"       // Forces theme tracking via HTML element classes
      defaultTheme="light"    // Guarantees Light mode loads by default
      enableSystem={false}    // Ignores local computer/OS dark mode settings
    >
      {children}
    </NextThemesProvider>
  );
}