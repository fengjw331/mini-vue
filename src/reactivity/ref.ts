import { hasChanged, isObject } from "../share";
import { isTracking, track, trackEffect, trigger ,triggerEffect} from "./effect";
import { reactive } from "./reactive";

class refImpl{
    private _value: any;
    public dep: Set<any>;
    flag=true
    rawValue: any;
    constructor(value){
        this.rawValue=value
        this._value=convert(value)
        this.dep=new Set()
    }
    get value(){
        // track()
        trackRefValue(this)
        return this._value
    }
    set value(newVal){
        // if(this.flag){//第一次set flag变为false
        //     this.flag=false
        //     this._value=newVal
        //     //trigger()
        //     triggerEffect(this.dep)
        // }else if(!Object.is(newVal,this.value)){
        //     //再次set 值和之前值不同
        //     this._value=newVal
        //     //trigger()
        //     triggerEffect(this.dep)
        // }
        if(hasChanged(newVal,this.rawValue)){

            this.rawValue=newVal
            this._value=convert(newVal)
            //     //trigger()
            triggerEffect(this.dep)
        }
        
    }


}

function trackRefValue(ref){
    if(isTracking()){
        trackEffect(ref.dep)
    }
}

function convert(value){
   return isObject(value) ? reactive(value):value
}

export function ref(val){

    return new refImpl(val)
}

