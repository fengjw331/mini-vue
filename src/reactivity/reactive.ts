import { reactiveOption, readOnlyOption,shallowReadonlyOption } from "./basehandler"

export const enum reactiveFlags{
    IS_REACTIVE="__v_is_reactive",
    IS_READONLY="__v_is_readonly",
}


export function reactive (target){
  return createProxy(target,reactiveOption)
}

export function readOnly(target){
   return createProxy(target,readOnlyOption)
}

export function shallow(target){
    return createProxy(target,shallowReadonlyOption)
}

function createProxy(target,options){
    const proxy= new Proxy(target,options)
    return proxy
}

export function isReactive(value){
    return !!value[reactiveFlags.IS_REACTIVE]
}

export function isReadOnly(value){
    return  !!value[reactiveFlags.IS_READONLY]
}