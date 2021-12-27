import {AView} from "./AView";
import {AModel, AModelInterface} from "./AModel";
import {AObject} from "../../aobject";
import {AInteraction, AInteractionEvent, BasicInteractionModes} from "../../ainteraction";
import {AInteractionMode} from "../../ainteraction/AInteractionMode";
import {AInteractionModeMap} from "../../ainteraction/AInteractionModeMap";
import {ACallbackSwitch} from "../../aevents";
import {AKeyboardInteraction} from "../../ainteraction/DOM/AKeyboardInteraction";
import {GetAppState} from "../AAppState";
import {AClock} from "../AClock";
import {BezierTween} from "../../amath";
import {CallbackType} from "../../basictypes";
import {v4 as uuidv4} from 'uuid';

// export interface AControllerInterface<ModelType extends AModel, NodeModelType extends ASceneNodeModel> extends AObject{
export interface AControllerInterface<ModelType extends AModel> extends AObject {
    model: AModelInterface;
    view: AView<ModelType>;

    getContextDOMElement(): HTMLCanvasElement;

    // sceneController:ASceneController<NodeModelType, ASceneModel<NodeModelType>>;
    // normalizedToViewCoordinates(v:Vec2):Vec2;
    init(model: ModelType, ...args: any[]): void;
}


// export interface AControllerClassInterface<ControllerType extends AController<AModel>> extends Function {new (...args:any[]): ControllerType}
export interface AControllerClassInterface<ControllerType extends AController<AModel>> extends Function {
    new(...args: any[]): ControllerType
}


export abstract class AController<ModelType extends AModel> extends AObject {
    protected abstract _model: AModelInterface;
    abstract view: AView<ModelType>;

    abstract getContextDOMElement(): HTMLCanvasElement;

    protected _clock: AClock;
    protected _modelDisposedListener!: ACallbackSwitch;
    /**
     * Interaction mode map. Has a .modes property that maps mode names to AInteractionModes.
     * @type {AInteractionModeMap}
     * @protected
     */
    protected _interactions!: AInteractionModeMap;
    /**
     * Right now, controllers are restricted to having one or zero active modes at a time. The name of the current mode, which can be active or inactive, is stored here.
     * @type {string}
     * @protected
     */
    protected _currentInteractionModeName: string;


    //##################//--Init functions--\\##################
    //<editor-fold desc="Init functions">
    /**
     * WARNING: You should never call init() inside of the constructor!
     * This is dangerous due to a weird TypeScript quirk where subclasses can easily overwrite properties set by parent
     * constructors.
     */
    constructor() {
        super();
        this._clock = new AClock();
        this._clock.play();
        this._interactions = new AInteractionModeMap(this);
        this._currentInteractionModeName = BasicInteractionModes.default;
    }

    abstract initView(): void;

    abstract initInteractions(): void;

    init(model?: ModelType, view?: AView<ModelType>) {
        if (model) {
            this.setModel(model);
        }
        if (view) {
            this.view = view;
            view.controller = this;
        }
        this.initView();
        this.initInteractions();
    }

    _initMock(model: ModelType) {
        this.setModel(model);
        this.initInteractions();
    }

    //</editor-fold>
    //##################\\--Init functions--//##################


    /**
     * Getter for the current interaction mode.
     * @returns {AInteractionMode}
     */
    get interactionMode() {
        return this._interactions.modes[this._currentInteractionModeName];
    }


    getInteractionMode(name: string) {
        return this._interactions.modes[name];
    }

    /**
     * Add an interaction to the current mode.
     * @param interaction
     */
    addInteraction(interaction: AInteraction) {
        this.interactionMode.addInteraction(interaction);
        // interaction.owner = this;
        return interaction;
    }

    activateInteractions() {
        this.interactionMode.activate();
    }

    setCurrentInteractionMode(name?: string) {
        this.interactionMode.deactivate();
        let activeMode = name ? name : BasicInteractionModes.default;
        this._interactions.setActiveMode(activeMode);
        this._currentInteractionModeName = activeMode;
    }

    defineInteractionMode(name: string, mode?: AInteractionMode) {
        this._interactions.defineMode(name, mode);
    }

    clearInteractionMode(name: string) {
        this._interactions.undefineMode(name)
    }

    isInteractionModeDefined(name: string) {
        return this._interactions.modeIsDefined(name);
    }

    get model() {
        return this._model;
    };

    setModel(model: AModelInterface) {
        if (this._modelDisposedListener) {
            throw new Error("tried to set model when _modelDisposedListener is already defined");
        }
        this._model = model;
        const self = this;
        this._modelDisposedListener = this._model.addEventListener(AModel.Events.DISPOSE, () => {
            self.dispose();
        })
    }

    /**
     * If you provide a handle, then the action will not call so long as an existing subscription by that handle exists.
     * This means that you won't duplicate the action before one has finished previously.
     * @param callback
     * @param duration
     * @param tween
     * @param actionOverCallback
     * @param handle
     */
    addTimedAction(callback: (actionProgress: number) => any, duration: number, actionOverCallback?: CallbackType, tween?: BezierTween, handle?: string) {
        if (handle && (handle in this._subscriptions)) {
            return;
        }
        const self = this;
        const subscriptionHandle = handle ?? uuidv4();
        this.subscribe(this._clock.CreateTimedAction(callback, duration, () => {
                self.unsubscribe(subscriptionHandle);
                if (actionOverCallback) {
                    actionOverCallback();
                }
            }, tween),
            subscriptionHandle);
    }


    dispose() {
        this._interactions.dispose();
        this.view.dispose();
        super.dispose();
    }
}

