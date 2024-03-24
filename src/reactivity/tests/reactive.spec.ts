import {isProxy, isReactive, isReadonly, reactive, readonly, shallowReadonly} from '../reactive'
describe("reactive",()=>{
    it('happy path',()=>{
        const original={foo:1}
        const observed=reactive(original)
        expect(observed).not.toBe(original)
        expect(observed.foo).toBe(1)
        expect(isReactive(observed)).toBe(true)
        expect(isReactive(original)).toBe(false)
        expect(isProxy(observed)).toBe(true)
    })
})

describe('readonly',()=>{
    it('happy path',()=>{
        const obj={a:1,bar:{foo:3}}
        const observed=readonly(obj)
        expect(observed).not.toBe(obj)
        expect(observed.a).toBe(1)
        expect(isReadonly(observed)).toBe(true)
        expect(isReadonly(obj)).toBe(false)
        expect(isReadonly(observed.bar)).toBe(true)
        expect(isReadonly(obj.bar)).toBe(false)
        expect(isProxy(observed)).toBe(true)
    })
    it('warn', ()=>{
        console.warn=jest.fn()
        const user=readonly({
            age:10
        })
        user.age=11
        expect(console.warn).toHaveBeenCalled()

    })

    test('nested reactive',()=>{
        const original={
            nested:{
                foo:1
            },
            array:[{bar:2}]
        }
        const observed=reactive(original)
        expect(isReactive(observed.nested)).toBe(true)
        expect(isReactive(observed.array)).toBe(true)
        expect(isReactive(observed.array[0])).toBe(true)


    })

    it('shallowReadonly',()=>{
        const props=shallowReadonly({n:{foo:1}})
        expect(isReadonly(props)).toBe(true)
        expect(isReadonly(props.n)).toBe(false)
    })
    it('shallowReadonly warn', ()=>{
        console.warn=jest.fn()
        const user=shallowReadonly({
            age:10
        })
        user.age=11
        expect(console.warn).toHaveBeenCalled()

    })
})