/**
 * @param  {Interface} rl
 * @param  {string} question
 * @return {Promise<boolean>}          [description]
 */
export function askYesNo (rl, question) {
  return new Promise((resolve) => {
    const query = () => {
      rl.question(`${question} (Y/n) `, (answer) => {
        const lowercaseAnswer = answer.toLowerCase()
        if (['yes', 'ye', 'y', ''].includes(lowercaseAnswer)) {
          resolve(true)
        } else if (['no', 'n'].includes(lowercaseAnswer)) {
          resolve(false)
        } else {
          console.log('Invalid response. Please answer with yes (Y) or no (n).')
          query() // Re-prompt if invalid input
        }
      })
    }

    query()
  })
}

/**
 * @import {Interface} from 'node:readline'
 */
