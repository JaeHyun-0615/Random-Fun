import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import {
  ThemeProvider,
  extendTheme,
} from "@chakra-ui/react";
import posthog from 'posthog-js'
import { CookiesProvider } from 'react-cookie';

posthog.init(process.env.REACT_APP_POSTHOG_API_KEY, { api_host: 'https://us.posthog.com' })

const root = ReactDOM.createRoot(document.getElementById("root"));

const theme = extendTheme({
  colors: {
    brand: {
      100: "#f7fafc",
      900: "#1a202c",
    },
    // breakpoints: {
    //   sm: '320px',
    //   md: '768px',
    //   lg: '960px',
    //   xl: '1200px',
    //   '2xl': '1536px',
    // },
  },
});

root.render(
  <ThemeProvider theme={theme}>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </ThemeProvider>
);