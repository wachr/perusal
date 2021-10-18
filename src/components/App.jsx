import baseroute from "../utils/baseroute";
import { h } from "preact";
import AppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#815d56",
      light: "#be9c91",
      dark: "#5f4339"
    },
    secondary: {
      main: "#827717",
      light: "#b4a345",
      dark: "#524a00"
    },
    background: {
      paper: "#e6e6e6"
    }
  }
});

export default function App() {
  return (
    <div id="App">
      <ThemeProvider theme={theme}>
        <AppBar>
          <img src={`${baseroute}/assets/icon.svg`} width={32} height={32} />
          <Typography variant="caption">perusal</Typography>
        </AppBar>
        <Toolbar />
        <Paper elevation={0}>
          <h1>Hello, World!</h1>
        </Paper>
      </ThemeProvider>
    </div>
  );
}
