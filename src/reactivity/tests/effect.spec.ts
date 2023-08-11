
import { effect,stop } from "../effect";
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

    it('happy path scheduler',()=>{
        let dummy;
        let run:any;
        const scheduler =jest.fn(()=>{
            run=runner
        })
        const obj=reactive({foo:1})
        const runner=effect(()=>{
            dummy=obj.foo
        },{
            scheduler
        })

        expect(scheduler).not.toHaveBeenCalled()
        expect(dummy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1)
        expect(dummy).toBe(1)
        run()
        expect(dummy).toBe(2)
    })

    it("happy path stop",()=>{
        let dummy
        const obj=reactive({prop:1})
        const runner=effect(()=>{
            dummy=obj.prop
        })
        obj.prop=2
        expect(dummy).toBe(2)
        stop(runner)
        // obj.prop=3
        obj.prop++
        expect(dummy).toBe(2)
        runner()
        expect(dummy).toBe(3)
    })

    it("happy path onstop",()=>{
        const obj=reactive({
            foo:1
        })
        const onStop=jest.fn()
        let dummy
        const runner=effect(
            ()=>{
                dummy=obj.foo
            },
            {
                onStop
            }
        )
        stop(runner)
        expect(onStop).toBeCalledTimes(1)

    })

})