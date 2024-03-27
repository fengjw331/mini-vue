import { hasChanged, isObject } from "../shared/index"
import { isTracking, trackEffect, triggerEffect } from "./effect"
import { reactive } from "./reactive"

class RefImpl{
    private _value: any
    public dep
    private _rawValue: any
    public __v_isRef=true
    constructor(value){
        this._rawValue=value
        this._value=convert(value) 
        this.dep=new Set()
    }
    get value(){
        trackRefValue(this)
        return this._value
    }
    set value(newValue){
        if(hasChanged(this._rawValue,newValue)){
            this._rawValue=newValue
            this._value=convert(newValue)
            triggerEffect(this.dep)
        }
    }
}

function convert(value){
    return isObject(value) ? reactive(value) :value 
}

function trackRefValue(ref){
    if(isTracking()){
        trackEffect(ref.dep)
    }
}


export function ref(value){
    return new RefImpl(value)
}


export function isRef(ref){
    return !!ref.__v_isRef
}

export function unRef(ref){
    return isRef(ref)? ref.value:ref
}