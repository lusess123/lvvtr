require("./.lvvtr");
require("@lvvtr/vue-web/boot");
import * as  ggg from "lodash"
import _ from "lodash"

ggg.add(1,2);
import aa from 'jquery';

const aaa1 = [1,2,3];
const sss = typeof(aaa1);
type SS = typeof aaa1;

interface fff {
    [name:string]:string ;
}

type FFF<T> = {
    [P in keyof T]?: T[P];
}

function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    return names.map(n => o[n]);
  }
  function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
    return o[name]; // o[name] is of type T[K]
}


  
  interface Person {
      name: string;
      age: number;
  }


  interface Chinese {
      contory: string ;
      name: string;
      age: number;
  }


  type fff55 = Exclude<Chinese ,Person>;

  //Extract
  type fff556 = Extract<Chinese ,Person>;

  let person: Person = {
      name: 'Jarid',
      age: 35
  };

   //const ddd2 = "name";
   type fff3 =  Pick<Person, "name"|"age"> ;
   type vvv = Record<"name"|"age"|typeof person.name ,string>



  let strings1 = pluck(person, ['name','age']);
  let strings2 = pluck(person, ['name']);
  getProperty(person,"age");

  const aaa = [1,2,4];

   const fff =  aaa.map((a,i,)=> {
       return a
    });

type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type vvv333 = string[];
type  fffrrrr123 =  vvv333[number] ;

type T201 = Boxed<string>;   //BoxedValue<string>;
type T21 = Boxed<string[]>;  // BoxedArray<number>;
type sssrrrr = object[];

const ddd :number[] = [1,2,4];

type Flatten<T> = T extends Array<infer U> ? U : T;

  type qqq1 = ReturnType<()=>number>;

  
interface ClockConstructor {
   // new (hour: number, minute: number):ClockInterface;
    new (hour: number, minute: number,x:string):ClockInterface;
}


type qq1 = InstanceType<ClockConstructor>;


interface ClockInterface {
    tick();
}

class Clock implements ClockInterface {
    tick(){

    }
    constructor(h: number, m: number) { }
}

class A {
    constructor(){
        return this ;
    }
    m1(name?:string | number){
         
          if( typeof(name) == "number" ){
            //  name. 
              return 123;
          }
          else{

            return "123";
          } 
    }
   
}









