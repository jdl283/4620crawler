import React from "react";
import ReactDOM from "react-dom";
import "@fontsource/anonymous-pro";
import App from "./App";
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import "focus-visible/dist/focus-visible";
import {AppMenu, SceneGraph} from "./anigraph";
import "./index.css";
import "./anigraph/acomponents/SceneGraph.css";

const theme = extendTheme({
  fonts: {
    heading: "Anonymous Pro",
  },
});



function closeNav() {
    if(!document){
        return;
    }
    let sidebar = document.getElementById("mySidebar");
    if(sidebar) {
        sidebar.style.width = "0";
    }
    let maindiv = document.getElementById("main");
    if(maindiv){
        maindiv.style.marginLeft= "0";
    }
}

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
        <div id={"mySidebar"} className={"sidebar"}>
            <a href={"javascript:void(0)"} className={"closebtn"} onClick={closeNav}>&times;</a>
            <SceneGraph />
        </div>
        <div className={"row"}>
            <div className={"col-2"}>
                <div className={"container"}>
                    <div className={"row"}>
                        <AppMenu/>
                    </div>
                </div>
            </div>
        </div>
        <App />
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
