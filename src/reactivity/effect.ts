import { extend } from "../shared/index";

let targetMap=new Map()
let activeEffect,shouldTrack;
class ReactiveEffect {
    private _fn: any
    deps=[]
    active=true
    onStop?:()=>void;
    constructor(fn,public scheduler?){
        this._fn=fn
    }
    run(){
        if(!this.active){
            //stop状态  active->false
            return this._fn()
        }
        shouldTrack=true
        activeEffect=this
        // fn 作为副作用 必定会触发get 触发track 收集依赖
        const result= this._fn()
        shouldTrack=false
        return result
    }
    stop(){
        if(this.active){
            cleanupEffect(this)
            if(this.onStop){
                this.onStop()
            }
            this.active=false
        }
       
    }
}

function cleanupEffect(effect){
    effect.deps.forEach((dep:any)=>{
        dep.delete(effect)
    })
    effect.deps.length=0
}

export  function effect(fn,options:any={}){
    const _effect=new ReactiveEffect(fn,options.scheduler)
    extend(_effect,options)
    _effect.run()
    const runner:any=_effect.run.bind(_effect)
    runner.effect=_effect
    return runner
}

export function stop(runner){
    runner.effect.stop()
}


export function Track(target,key){
    if(!isTracking())return
    //target->key->fn
    let  depsMap=targetMap.get(target)
    if(!depsMap){
        depsMap=new Map()
        targetMap.set(target,depsMap)
    }
    let dep=depsMap.get(key)
    if(!dep){
        dep=new Set()
        depsMap.set(key,dep)
    }
    
    if(dep.has(activeEffect))return
    //dep 收集 fn
    dep.add(activeEffect)
    //fn 反向收集dep
    activeEffect.deps.push(dep)
}

function isTracking(){
    return shouldTrack && activeEffect !==undefined
}

export function Trigger(target,key){
     let depsMap=targetMap.get(target)
     let  dep=depsMap.get(key)
     
     for (const effect of dep) {
        if(effect.scheduler){
            effect.scheduler()
        }else{
            effect.run()
        }
     }

}