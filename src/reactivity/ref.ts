import { reactive } from "./reactive";

class refImpl{
    private _value: any;
    dep=new Set()
    constructor(value){
        this._value=value
    }
    get value(){

        
        return this._value
    }
    set value(newVal){
        this._value=newVal
    }


}



export function ref(val){

    return new refImpl(val)
}