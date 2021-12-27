import {VisuallyHidden} from "@chakra-ui/react";
import {useRef} from "react";
import {getSVGTextFromFile} from "./SvgToThreeJsObject";
import {GetAppState} from "../../../amvc";


export function SVGUploader() {
  const svgFileUploader = useRef<HTMLInputElement>(null);
  function addSVGToScene() {
    const files = svgFileUploader.current!.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        (async () => {
          const file = files[i];
          const svgText = (await getSVGTextFromFile(file)) as string;
          // newObject.name = file.name.replace(/\.svg/, "");

          // let sbsp = new ASVGModel(svgText);
          let svgname = file.name.replace(/\.svg/, "");
          GetAppState().addSVG(svgname, svgText);

          // appState.sceneModel.addNode(sbsp);
        })();
      }
    }
  }



  return (
    <>
      <label style={{ cursor: "pointer" }} htmlFor="svgFileUploader">
        From SVG File
      </label>
      <VisuallyHidden>
        <input
          multiple
          id="svgFileUploader"
          className="hidden"
          ref={svgFileUploader}
          onChange={addSVGToScene}
          type="file"
        ></input>
      </VisuallyHidden>
    </>
  );
}
