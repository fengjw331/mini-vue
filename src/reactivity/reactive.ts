import { track, trigger } from "./effect"

export function reactive (target){
    return new Proxy(target,{
        get(target,key){
            //todo 依赖收集
            track(target,key)
            return Reflect.get(target,key)
        },
        set(target,key,value){
            //todo 触发依赖
            trigger(target,key)
            return Reflect.set(target,key,value)
        }
    })
}

