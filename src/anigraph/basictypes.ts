
export type Constructor<T> = new(...args: any[]) => T;
export type CallbackType =(...args:any[])=>any;
export type GenericDict={[name:string]:any};

export interface ClassInterface<InstanceClass> extends Function {new (...args:any[]): InstanceClass};

export function TextureKeyForName(name:string){return name+'Map';}
export function TextureProvidedKeyForName(name:string){return name+'MapProvided';}


export enum AniGraphEnums{
    BackgroundElementName = 'BackgroundElement',
    OccludesInteractions='OccludesInteractions',
    CreateShapeInteractionName='CreateShape',
    LightBoxSize = 25,
    CONTEXT_ASPECT_HOW = 1.2,
    DefaultZNear=0.5,
    DefaultZFar=4000,
    DefaultMovementSpeed=10,
}



