import { h } from "preact";
import { useState } from "preact/hooks";
import AppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import baseroute from "../utils/baseroute";
import StateInspector from "./StateInspector";

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

const stubbedOutState = {
  foo: {
    detail: "details about foo",
    bar: {
      detail: "details about bar",
      baz: []
    }
  }
};

export default function App() {
  const [appState, setAppState] = useState(stubbedOutState);
  return (
    <div id="App">
      <ThemeProvider theme={theme}>
        <AppBar>
          <img src={`${baseroute}/assets/icon.svg`} width={32} height={32} />
          <Typography variant="caption">perusal</Typography>
        </AppBar>
        <Toolbar />
        <StateInspector nodeState={appState} setNode={setAppState} />
      </ThemeProvider>
    </div>
  );
}
