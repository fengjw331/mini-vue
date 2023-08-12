import { isReactive, isReadOnly, reactive, readOnly, shallow } from "../reactive"

describe('reactive',()=>{
    it('happy path',()=>{
        let obj={
            age:10,
        }
        let reactiveObj=reactive(obj)
        expect(reactiveObj).not.toBe(obj)
        expect(reactiveObj.age).toBe(10)
        obj.age++
        expect(isReactive(reactiveObj)).toBe(true)
        expect(isReactive(obj)).toBe(false)
    })

    it("嵌套",()=>{
        let obj={
            a:1,
            b:{
                c:1
            }
        }
        let reactiveObj=reactive(obj)
        expect(isReactive(reactiveObj)).toBe(true)
        expect(isReactive(reactiveObj.b)).toBe(true)
    })
})
describe('readOnly',()=>{
    it('happy path readOnly',()=>{
        let obj={
            age:10,
        }
        console.warn=jest.fn()
        let reactiveObj=readOnly(obj)
        expect(reactiveObj).not.toBe(obj)
        expect(reactiveObj.age).toBe(10)
        expect(isReadOnly(reactiveObj)).toBe(true)
        expect(isReadOnly(obj)).toBe(false)
        reactiveObj.age++
        expect(reactiveObj.age).toBe(10)
        expect(console.warn).toBeCalled()
    })
    it('happy path readOnly',()=>{
        let obj={
            age:10,
            b:{
                c:1
            }
        }
        let reactiveObj=readOnly(obj)
        expect(isReadOnly(reactiveObj)).toBe(true)
        expect(isReadOnly(reactiveObj.b)).toBe(true)
    })
})
describe('shallow',()=>{
    it('happy path shallow',()=>{
        let obj={
            age:10,
            b:{
                c:1
            }
        }
        let reactiveObj=shallow(obj)
        expect(isReadOnly(reactiveObj)).toBe(true)
        expect(isReadOnly(reactiveObj.b)).toBe(false)
    })
})