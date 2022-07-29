
import { effect } from "../effect";
import { reactive } from "../reactive"

// it('init',()=>{
//     expect(add(1,1)).toBe(2)
//     expect(true).toBe(true)
// })

describe('effect',()=>{
    it('happy end',()=>{
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

  //runner -> function runner() ->fn ->fn返回值
    it('happy path ',()=>{
        let foo=10
        const fn=()=>{
            foo++;
            return 'aoo'
        }
        const runner=effect(fn)
        expect(foo).toBe(11)
        const r=runner()
        expect(foo).toBe(12)
        expect(r).toBe('aoo')
    })

})