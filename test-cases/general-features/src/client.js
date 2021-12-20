import { foo } from './libs/a-lib.js'

console.log('This only runs on the root page')
console.log(foo)

export default 'root page client.js'
