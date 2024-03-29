import { h } from "preact";
import { useState } from "preact/hooks";
import { BrowserRouter, Link } from "react-router-dom";
import { StaticRouter } from "react-router-dom/server";

import baseroute from "../utils/baseroute";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useImmerReducer } from "use-immer";

import NotYetImplemented from "./NotYetImplemented";
import Perusal from "./Perusal";
import StateInspector from "./StateInspector";

const theme = createTheme({
  palette: {
    type: "light",
    primary: {
      main: "#815d56",
      light: "#be9c91",
      dark: "#5f4339",
    },
    secondary: {
      main: "#827717",
      light: "#b4a345",
      dark: "#524a00",
    },
    background: {
      paper: "#e6e6e6",
    },
  },
});

const Router = (props) => {
  if (typeof window !== "undefined") return <BrowserRouter {...props} />;
  return <StaticRouter {...props} />;
};

export default function App() {
  const [appState, dispatch] = useImmerReducer(Perusal.reducer, {});
  const setAppState = (state) => dispatch({ payload: state });
  const [showTodoSnackbar, setShowTodoSnackbar] = useState(false);
  const closeTodoSnackbar = () => setShowTodoSnackbar(false);
  const displayTodoSnackbar = () => setShowTodoSnackbar(true);
  return (
    <div id="App">
      <Router basename={baseroute}>
        <ThemeProvider theme={theme}>
          <AppBar>
            <Box>
              <Link to={"."}>
                <ButtonBase size={"small"}>
                  <Stack>
                    <img
                      src={`${baseroute}/assets/icon.svg`}
                      width={32}
                      height={32}
                    />
                    <Typography variant="caption">perusal</Typography>
                  </Stack>
                </ButtonBase>
              </Link>
            </Box>
          </AppBar>
          <Toolbar />
          <NotYetImplemented
            open={showTodoSnackbar}
            close={closeTodoSnackbar}
          />
          <Perusal
            nodeState={appState}
            dispatch={dispatch}
            setNode={setAppState}
            displayTodoAlert={displayTodoSnackbar}
          />
          <StateInspector nodeState={appState} setNode={setAppState} />
        </ThemeProvider>
      </Router>
    </div>
  );
}
