import { extend } from "../share"

let activeEffect //存放当前活跃副作用
let shouldTrack=false
let effectMap=new Map() //存放所有的依赖
class ReactiveEffect {
    private _fn: any
    deps=[]
    active=true
    onStop?:()=>void
    constructor(fn,public scheduler?){
        this._fn=fn
    }
    run(){
        if(!this.active){ //stop状态
            return this._fn()
        } 

        shouldTrack=true
        activeEffect=this
        const result=this._fn()
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

export function effect(fn,options:any = {}){
    let _effect= new ReactiveEffect(fn,options.scheduler)
    extend(_effect,options)
    _effect.run()
    const runner:any=_effect.run.bind(_effect)
    runner.effect=_effect
    return runner
}

export function stop(runner){
    runner.effect.stop()
}

export function track(target,key){
    
    if(!isTracking())return

    let depsMap=effectMap.get(target)
    if(!depsMap){
        depsMap=new Map()
        effectMap.set(target,depsMap)
    }
    let dep=depsMap.get(key)
    if(!dep){
        dep=new Set()
        depsMap.set(key,dep)
    }

 
    if(dep.has(activeEffect))return
    dep.add(activeEffect)

    activeEffect.deps.push(dep)
}

function isTracking(){
    return shouldTrack &&  activeEffect !==undefined
}




export function trigger(target,key){
    let depsMap=effectMap.get(target)
    let dep=depsMap.get(key)
    for (const effect of dep) {
        if(effect.scheduler){
            effect.scheduler()
        }else{
            effect.run()
        }
            
    }
}