import { hasChanged, isObject } from "../share";
import { isTracking, track, trackEffect, trigger ,triggerEffect} from "./effect";
import { reactive } from "./reactive";

class refImpl{
    private _value: any;
    public dep: Set<any>;
    __v_isRef=true
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

export function isRef(val){
    return !!val.__v_isRef
}

export function unRef(ref){
    return  isRef(ref)?ref.value:ref
}

export function proxyRefs(val){
    return new Proxy(val,{
        get(target,key){

            return unRef(Reflect.get(target,key)) 
        },
        set(target,key,val){
            if(isRef(target[key]) && !isRef(val) ){
                return target[key].value=val
            }else{

                return Reflect.set(target,key,val)
            }
        }
    })
}