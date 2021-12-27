import {VisuallyHidden} from "@chakra-ui/react";
import {useRef} from "react";
import * as THREE from "three";
import {GetAppState} from "../amvc";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {PLYLoader} from "three/examples/jsm/loaders/PLYLoader";
import {Loader} from "three/src/loaders/Loader"

function getModelFromFile(file: File, callback:(obj:THREE.Object3D)=>void){
    let userOBJURL = URL.createObjectURL( file );
    let extension = file.name.split('.').pop();
    let loader:Loader;
    switch (extension) {
        case 'obj':
            loader = new OBJLoader();
            break;
        case 'ply':
            loader = new PLYLoader();
            break;
        default:
            throw new Error(`Extension "${extension}" not recognized`);
    }
    loader.setCrossOrigin("");
    // @ts-ignore
    loader.load(userOBJURL, callback);
}


export function ModelUploader() {
    const modelUploader = useRef<HTMLInputElement>(null);
    function uploadModel() {
        const files = modelUploader.current!.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                (async () => {
                    const file = files[i];
                    const obj = getModelFromFile(file, (obj:THREE.Object3D)=>{
                        GetAppState().modelUploaded(file.name, obj);
                    });
                })();
            }
        }
    }



    return (
        <>
            <label style={{ cursor: "pointer" }} htmlFor="modelUploader">
        Upload Model
    </label>
    <VisuallyHidden>
    <input
        multiple
    id="modelUploader"
    className="hidden"
    ref={modelUploader}
    onChange={uploadModel}
    type="file"
        ></input>
        </VisuallyHidden>
        </>
);
}
