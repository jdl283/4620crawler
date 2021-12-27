import {VisuallyHidden} from "@chakra-ui/react";
import {useRef} from "react";
import * as THREE from "three";
import {GetAppState} from "../amvc";


function getTextureFromFile(file: File, callback:(texture:THREE.Texture)=>void){
    let userImageURL = URL.createObjectURL( file );
    let loader = new THREE.TextureLoader();
    loader.setCrossOrigin("");
    loader.load(userImageURL, callback);

    // return new Promise((resolve, reject) => {
    //     const reader = new FileReader();
    //     reader.onload = (event) => {
    //         resolve(event.target?.result);
    //     };
    //     reader.onerror = (err) => {
    //         alert("failed to upload file with err" + err);
    //     };
    //     // reader.readAsText(file);
    //
    // });
}


export function ImageUploader() {
    const imageUploader = useRef<HTMLInputElement>(null);
    function uploadImage() {
        const files = imageUploader.current!.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                (async () => {
                    const file = files[i];
                    const texture = getTextureFromFile(file, (texture:THREE.Texture)=>{
                        GetAppState().imageUploaded(file.name, texture);
                    });
                    // newObject.name = file.name.replace(/\.svg/, "");
                    // let sbsp = new ASVGModel(svgText);
                    // appState.sceneModel.addNode(sbsp);
                })();
            }
        }
    }



    return (
        <>
            <label style={{ cursor: "pointer" }} htmlFor="imageUploader">
        Upload Image File
    </label>
    <VisuallyHidden>
    <input
        multiple
    id="imageUploader"
    className="hidden"
    ref={imageUploader}
    onChange={uploadImage}
    type="file"
        ></input>
        </VisuallyHidden>
        </>
);
}
