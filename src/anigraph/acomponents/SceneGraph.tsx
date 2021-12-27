import "./SceneGraph.css";
import {Box, List, ListIcon, ListItem} from "@chakra-ui/react";
import {useState} from "react";
import {MdKeyboardArrowDown, MdKeyboardArrowRight} from "react-icons/md";
import {BsDot} from "react-icons/bs";
// import { appState, SceneGraphNode } from "../appState/appState";
// import {appState} from "../anigraph/aapps/Base2DApp1/Base2DApp1Component";
// import {appState} from "../anigraph/amvc/AAppState";
import {useSnapshot} from "valtio";
import {AAppState, AModel, ASceneModel} from "../amvc";
// import {GetGlobalAppState} from "../AppGlobalState";

// let appState = GetAppState();

const helperObjects = ["gridHelper", "TransformController"];

export function GraphNode({ root }: { root: AModel }) {
    const [expanded, setExpanded] = useState(true);
    function selectObject() {
        // GetAppState().selectedObjects = [root.threeJsRef];
        // console.log(root);
        AAppState.GetAppState().handleSceneGraphSelection(root);
        // GetAppState().transformController.attach(root.threeJsRef);
        // GetAppState().transformController.attach(root.threeJsRef);
    }
    function toggleExpand() {
        setExpanded((v) => !v);
    }

    if (!helperObjects.includes(root.name)) {
        return (
            <List pl="1.2rem">
                <ListItem>
          <span className="item" onClick={selectObject}>
            <ListIcon
                as={
                    root.children.length > 0
                        ? expanded
                            ? MdKeyboardArrowDown
                            : MdKeyboardArrowRight
                        : BsDot
                }
                onClick={toggleExpand}
            ></ListIcon>
              {root.name}
          </span>
                    {expanded &&
                    root.children.map((child) => (
                        <GraphNode
                            key={(child instanceof AModel)?child.name:child.uid}
                            root={child as ASceneModel<any>}
                        ></GraphNode>
                    ))}
                </ListItem>
            </List>
        );
    } else {
        return <></>;
    }
}

//TODO Can we make the scenevis graph update when a model name changes?
export function SceneGraph() {
    // const { sceneGraphRoot } = useSnapshot(GetAppState());
    const sceneGraphChildren = useSnapshot(AAppState.GetAppState().sceneModel.children);
    return (
        sceneGraphChildren && (
            <Box className="sceneGraph">
                <p>Scene Graph</p>
                <Box ml="-1.2rem">
                    {/* @ts-ignore */}
                    {sceneGraphChildren.map((child) => (
                        <GraphNode key={child.uid} root={child as AModel}></GraphNode>
                    ))}
                </Box>
            </Box>
        )
    );
}
