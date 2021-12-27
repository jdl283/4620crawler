export {};
// import {Base2DAppSceneController} from "./controllers";
// import {AAppState} from "../../amvc";
// import {useSnapshot} from "valtio";
// import ControlPanel from "./ControlPanel";
// import "./Base2DApp.css"
//
// export enum Base2DAppScenes{
//     ModelScene='ModelScene'
// }
//
// let appState = AAppState.GetAppState();
// const Base2DAppSceneComponent = appState.AppComponent(
//     Base2DAppSceneController,
//     Base2DAppScenes.ModelScene
// );
//
// /**
//  * The main component for your app
//  * @constructor
//  */
// export function Base2DAppComponent() {
//     const state = useSnapshot(AAppState.GetAppState().state);
//     const selectionModel = state.selectionModel;
//     return (
//         <div>
//             <ControlPanel modelControlSpecs={selectionModel.getModelGUIControlSpecs()} />
//             <div className={"container-fluid"}>
//                 <div className={"row"}>
//                     <div className={"Base2DApp-explanation"}>
//                         <h1 className={"Base2DApp-title"}>Base2DApp MainApp</h1>
//                         <p>[MainApp description here...]</p>
//                         <br />
//                     </div>
//                 </div>
//                 <div className={"row"}>
//                     <div className={"col-5"}>
//                         <div className={"row"}>
//                             <h2 className={"Base2DApp-label"}>Model Space:</h2>
//                         </div>
//                         <div className={"row"}>
//                             <Base2DAppSceneComponent />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
