"use client";

import { CacheProvider } from "@chakra-ui/next-js";
import {
  ChakraProvider,
  ColorModeScript,
  StyleFunctionProps,
} from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// https://coolors.co/141214-9999a1-e6e6e9-f4f4f6-cba135
const colors = {
  brand: {
    900: "#9999A1",
    800: "#E6E6E9",
    700: "#F4F4F6",
    500: "#cba135",
  },
};

const styles = {
  global: (props: StyleFunctionProps | Record<string, any>) => ({
    body: {
      color: mode("gray.800", "whiteAlpha.900")(props),
      bg: mode("gray.100", "#141214")(props),
      overflow: "hidden",
    },
  }),
};

export const theme = extendTheme({
  colors,
  styles,
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  );
}
