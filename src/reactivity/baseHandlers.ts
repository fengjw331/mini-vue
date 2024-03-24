import { extend, isObject } from "../shared/index"
import { Track, Trigger } from "./effect"
import { reactive, ReactiveFlags, readonly } from "./reactive"

function createGetter(isReadOnly=false,shallow=false){
    return function get(target,key){
        //依赖收集
        // console.log(key)
        // console.log('get track')
        if(key==ReactiveFlags.IS_REACTIVE){
            return !isReadOnly
        }
        if(key==ReactiveFlags.IS_READONLY){
            return isReadOnly
        }
        const res=Reflect.get(target,key)

        if(shallow){
            return res
        }

        if(isObject(res)){
            return isReadOnly? readonly(res) : reactive(res)
        }
        if(!isReadOnly){
            Track(target,key)
        }
        return res
    }
}
function createSetter(){
    return function  set(target,key,value){
        const res=Reflect.set(target,key,value)
        Trigger(target,key)
        return true
    }
}

const get=createGetter()
const set=createSetter()
const readonlyGet=createGetter(true)
const shallowReadonlyGet=createGetter(true,true)
export const mutableHandlers={
    get,
    set
}
export const readonlyHandlers={
    get:readonlyGet,
    set(target,key,value){
        const res=Reflect.set(target,key,value)
        console.warn('read only')
        return true
    }
}
export const shallowReadonlyHandlers=extend({},readonlyHandlers,{
    get:shallowReadonlyGet,

}) 
