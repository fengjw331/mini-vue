import { extend, isObject } from "../share"
import { track, trigger } from "./effect"
import { reactive, reactiveFlags, readOnly } from "./reactive"

function createGetter(_readOnly=false,_shallow=false){
    return function get(target,key){
        if(key===reactiveFlags.IS_REACTIVE){
            return !_readOnly
        }else if(key==reactiveFlags.IS_READONLY){
            return _readOnly
        }
        const res=Reflect.get(target,key)

        if(_shallow)return res

        if(isObject(res)){//如果是object,不用track
          return _readOnly ? readOnly(res): reactive(res)
        }

        if(!_readOnly){
            //todo 依赖收集
            track(target,key)
        }
        return res
    }
}

function createSetter(){
    return function set(target,key,value){
        const res=Reflect.set(target,key,value)
        //todo 触发依赖
        trigger(target,key)
        return res
    }
}

const get=createGetter()
const getReadOnly=createGetter(true)
const getShallow=createGetter(true,true)
const set=createSetter()

export const reactiveOption={
    get:get,
    set:set
}
export const readOnlyOption={
    get:getReadOnly,
    set:(target,key,value)=>{
        console.warn(`key= ${key} readonly no set`,target)
        return true
    }
}
export const shallowReadonlyOption =extend({},readOnlyOption,{
    get:getShallow
})