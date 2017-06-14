#!/usr/bin/env node

'use strict'

const { each } = require('async')
const { lstat, rename} = require('fs')
const { resolve, join } = require('path')

const repl = { 'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u' }
const ommitChars = [ 769 ]
const args = Array.from(process.argv).slice(2)

if( !args.length ){
  process.exit(1)
}

each(args, ( f, callback ) => {

  let resolved = resolve(f)
  lstat(resolved, ( err, stat ) => {

    if( !stat ){
      return callback( null )
    }

    let splitten = resolved.split('/')
    let file = splitten.pop()
    
    let renamed = ''
    for(let i = 0; i < file.length; i++){
      let letter = file[i]
      if( repl.hasOwnProperty(letter) ){
        renamed += repl[ letter ]
      }else if( ommitChars.indexOf(letter) === -1 ){
        renamed += letter
      }
    }
    if( renamed !== file ){
      rename(resolved, join(splitten.join('/'), renamed), callback)
    }else{
      callback( null )
    }

  })
}, ( err ) => {
    if( err ){
      console.log('Error', err)
    }
})
