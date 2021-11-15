import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

// A custom theme for this app
const theme = createTheme({
  typography: {
    fontFamily: `"Public Sans", "Roboto", "Helvetica", "Arial", "sans-serif"`,
  },
  palette: {
    primary: {
      main: "#00AB55",
      light: "#5BE584",
      dark: "#007B55",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#3366FF",
      light: "#84A9FF",
      dark: "#1939B7",
      contrastText: "#FFFFFF",
    },
    error: {
      main: red.A400,
    },
    grey: {
      50: "#FAFAFA",
      100: "#F9FAFB",
      200: "#F4F6F8",
      300: "#DFE3E8",
      400: "#C4CDD5",
      500: "#919EAB",
      600: "#637381",
      700: "#454F5B",
      800: "#212B36",
      900: "#161C24",
      A100: "#F9FAFB",
      A200: "#F4F6F8",
      A400: "#C4CDD5",
      A700: "#454F5B",
    },
  },
});

export default theme;
