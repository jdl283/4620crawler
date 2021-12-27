import {AClock} from "./AClock";
import {Vector} from "../amath";
import {ASerializable} from "../aserial";
import {AObject} from "../aobject";
import {CallbackType} from "../basictypes";

const TIME_LISTENER_HANDLE="TIME_LISTENER_HANDLE";

@ASerializable("TimeFilter")
export class FilteredVector<V extends Vector> extends AObject{
    static UpdateEventHandle:string="FILTERED_VALUE_UPDATE";
    protected _clock:AClock;
    _filteredValue:V;
    _targetValue:V;
    latency:number;
    _lastTimeUpdated:number=0;
    protected _callback:((filteredVector:FilteredVector<V>)=>any)|undefined

    get value(){return this._filteredValue;}
    set target(v:V){this._targetValue=v;}
    get currentTarget(){return this._filteredValue;}

    constructor(value:V, latency:number=0.2, callback?:((filteredVector:FilteredVector<V>)=>any)|undefined) {
        super();
        this._targetValue=value;
        this._filteredValue = value;
        this.latency=latency;
        this._clock = new AClock();
        const self=this;
        this._callback=callback;
        this.subscribe(this._clock.addTimeListener((t:number)=>{
            let dTime = t-self._lastTimeUpdated;
            self._lastTimeUpdated = t;
            let progress = dTime/self.latency;
            if(progress>1){
                if(self._filteredValue.isEqualTo(self._targetValue)){
                    return;
                }else {
                    self._filteredValue = self._targetValue;
                }
            }else{
                self._filteredValue = self._filteredValue.times(1-progress).plus(self._targetValue.times(progress));
            }
            if(self._callback){
                self._callback(self);
            }
        }), TIME_LISTENER_HANDLE);
        this._clock.play();
    }

    signalUpdate(){
        this.signalEvent(FilteredVector.UpdateEventHandle);
    }

    dispose() {
        // this.unsubscribe(TIME_LISTENER_HANDLE);
        super.dispose();
    }

}
