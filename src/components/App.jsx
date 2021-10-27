import { h } from "preact";
import { useState } from "preact/hooks";
import AppBar from "@mui/material/AppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import baseroute from "../utils/baseroute";
import StateInspector from "./StateInspector";
import TopicCards from "./TopicCards";

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

const stubbedOutState = [
  { topicTitle: "foo" },
  { topicTitle: "bar", topicDetails: "barbar bar barbarbar" },
  "baz",
  { topicTitle: "quux", topicSubtopics: ["q", "u", "u", "x"] }
];

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
        <TopicCards topics={appState} />
        <StateInspector nodeState={appState} setNode={setAppState} />
      </ThemeProvider>
    </div>
  );
}
