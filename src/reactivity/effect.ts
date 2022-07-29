let activeEffect //存放当前活跃副作用
class ReactiveEffect {
    private _fn: any
    constructor(fn){
        this._fn=fn
    }
    run(){
        activeEffect=this
        
       return this._fn()
    }
}

let effectMap=new Map() //存放所有的依赖
//Map:[target:Map:[key,dep]]
//dep:Set[effect]
export function effect(fn){
    let _effect= new ReactiveEffect(fn)
    _effect.run()
    return _effect.run.bind(_effect)
}
export function track(target,key){
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
    dep.add(activeEffect)
}

export function trigger(target,key){
    let depsMap=effectMap.get(target)
    let dep=depsMap.get(key)
    for (const effect of dep) {
        effect.run()
    }
}