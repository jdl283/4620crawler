import {Button, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import {IoIosArrowDown} from "react-icons/io";
import {AAppState, ModelUploader} from "src/anigraph/index";
import React from "react";
import {SVGUploader} from "./fileloading/svg/SVGUploader";
import {ImageUploader} from "./ImageUploader";

// let appState = GetAppState();

function openNav() {
    if(!document){
        return;
    }
    let sidebar = document.getElementById("mySidebar");
    if(sidebar) {
        sidebar.style.width = "250px";
    }
    let maindiv = document.getElementById("main");
    if(maindiv){
        maindiv.style.marginLeft = "250px";
    }
}

export function AppMenu() {
    return (
        <>
            <Menu>
                <MenuButton as={Button} rightIcon={<IoIosArrowDown />} m={4}>
                    Menu
                </MenuButton>
                <MenuList>
                    <MenuItem
                        onClick={() => {
                            // console.log("CLICKED!")
                            for(let s in AAppState.GetAppState().sceneControllers){
                                AAppState.GetAppState().sceneControllers[s].view.recordNextFrame();
                                console.log(s);
                            }
                        }}
                    >
                        Save Contexts to PNG
                    </MenuItem>
                    <MenuItem>
                        <SVGUploader/>
                    </MenuItem>
                    <MenuItem>
                        <ImageUploader/>
                    </MenuItem>
                    <MenuItem>
                        <ModelUploader/>
                    </MenuItem>
                    <MenuItem
                        onClick={openNav}
                        >
                        Show SceneGraph
                    </MenuItem>

                </MenuList>
            </Menu>
        </>
    );
}
