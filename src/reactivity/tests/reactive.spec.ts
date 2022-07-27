import { reactive } from "../reactive"

describe('reactive',()=>{
    it('happy path',()=>{
        let obj={
            age:10,
        }
        let reactiveObj=reactive(obj)
        expect(reactiveObj).not.toBe(obj)
        expect(reactiveObj.age).toBe(10)
    })
})