
import { reactive } from "../reactive"

// it('init',()=>{
//     expect(add(1,1)).toBe(2)
//     expect(true).toBe(true)
// })

describe('effect',()=>{
    it.skip('happy end',()=>{
        let person= reactive({
            age:10
        })
        let next;
        effect(()=>{
            next=person.age+1
        })
        expect(next).toBe(11)
        person.age++
        expect(next).toBe(12)

    })
})