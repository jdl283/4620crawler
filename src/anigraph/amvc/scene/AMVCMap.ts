import {ASceneNodeController, ASceneNodeModel} from "../node";
import {AModel, AModelClassInterface, AModelInterface} from "../base/AModel";
import {AViewClassInterface} from "../base/AView";
import {AControllerClassInterface} from "../base/AController";

// export interface AMVCMapEntry<NodeModelType extends ASceneNodeModel>{
//     modelClass:AModelClassInterface<AModelInterface>;
//     viewClass:AViewClassInterface;
//     controllerClass:ClassInterface<AControllerInterface<NodeModelType>>,
//     details:GenericDict
// }

// export const enum AMVCMapEntryDetail{
//     CAN_SELECT_IN_GUI='CAN_SELECT_IN_GUI',
//     CAN_CLICK_TO_CREATE='CAN_CLICK_TO_CREATE',
// }




// export type AMVCNodeClassSpec<NodeModelType extends ASceneNodeModel> = [AModelClassInterface<AModelInterface>, AViewClassInterface, AControllerClassInterface<ASceneNodeController<ASceneNodeModel>>, AMVCMapDetailDict];

// export function NewAMVCNodeClassSpec(
//     modelClass:AModelClassInterface<ASceneNodeModel>,
//     viewClass:AViewClassInterface,
//     controllerClass:AControllerClassInterface<ASceneNodeController<ASceneNodeModel>>,
//     details?:AMVCMapDetailDict
// ):AMVCNodeClassSpec<ASceneNodeModel>{
//     details = (details!==undefined)?details:{};
//     // if(details){
//     return [modelClass, viewClass, controllerClass, details];
//     // }else{
//     //     return [modelClass, viewClass, controllerClass, {}];
//     // }
//
// }


export interface AMVCSpecDetails {
    isGUIOption?:boolean;
    canDrawVerts?:boolean;
    canCreateDefault?:boolean;
}
function AMVCSpecDetailWithDefaults(d:AMVCSpecDetails){
    let defaultValues:AMVCSpecDetails = {
        isGUIOption:true,
        canDrawVerts:true,
        canCreateDefault:true,
    }
    return {...defaultValues, ...d};
}

export class AMVCSpec{
    modelClass:AModelClassInterface<AModelInterface>;
    viewClass:AViewClassInterface;
    controllerClass:AControllerClassInterface<ASceneNodeController<ASceneNodeModel>>;
    details:AMVCSpecDetails;
    constructor(modelClass:AModelClassInterface<ASceneNodeModel>,
                viewClass:AViewClassInterface,
                controllerClass:AControllerClassInterface<ASceneNodeController<ASceneNodeModel>>,
                details?:AMVCSpecDetails) {
        this.modelClass=modelClass;
        this.viewClass=viewClass;
        this.controllerClass=controllerClass;
        this.details = AMVCSpecDetailWithDefaults(details?details:{});
    }
}

export class AMVCMap{
    protected _classMap:{[modelClassName:string]:AMVCSpec};
    constructor(specs?:AMVCSpec[]) {
        this._classMap = {};
        if(specs){
            this.addSpecs(specs);
        }
    }

    get modelClassNames(){return Object.keys(this._classMap);}
    get specs(){return Object.values(this._classMap);}


    getGUIModelOptions(){
        let rval:{[name:string]:string}={}
        // let rval = [];
        for(let m in this._classMap){
            if(this._classMap[m].details.isGUIOption){
                rval[m]=m;
            }
        }
        return rval;
    }
    getGUIModelOptionsList(){
        let rval = [];
        for(let m in this._classMap){
            if(this._classMap[m].details.isGUIOption){
                rval.push(m);
            }
        }
        return rval;
    }

    getSpecForModel(model:string|AModelClassInterface<AModelInterface>|AModel){
        if(model instanceof AModel){
            return this._classMap[model.serializationLabel];
        }else if (typeof model ==='string'||model instanceof String) {
            return this._classMap[model as string];
        }else{
            return this._classMap[(model as AModelClassInterface<AModelInterface>).SerializationLabel()];
        }
    }

    _viewClassForModel(model:string|AModelClassInterface<AModelInterface>|AModel){
        return this.getSpecForModel(model).viewClass;
    }
    _controllerClassForModel(model:string|AModelClassInterface<AModelInterface>|AModel){
        return this.getSpecForModel(model).controllerClass;
    }
    _classDetailsForModel(model:string|AModelClassInterface<AModelInterface>|AModel){
        return this.getSpecForModel(model).details;
    }

    addSpecs(specs:AMVCSpec|AMVCSpec[]){
        if(Array.isArray(specs)){
            for(let spec of specs){
                this.addSpec(spec);
            }
        }else{
            this.addSpec(specs);
        }
    }
    addSpec(spec:AMVCSpec){
        this._classMap[spec.modelClass.SerializationLabel()]=spec;
    }
}
