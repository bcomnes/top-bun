import * as lib from '../libs/a-lib.js'

console.log(lib)

const thisShouldBeConst = true

console.log(thisShouldBeConst)

class Foo {
  cosntructor () {
    console.log('hello world')
  }

  foo () {

  }

  bar () {

  }
}

export const myFoo = new Foo()
