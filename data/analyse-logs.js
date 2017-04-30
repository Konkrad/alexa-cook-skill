var fs = require('fs');
let filter = 'searchIntent query'

if(process.argv[3] === 'error') {
    filter = 'outSourcedHanlder error'
}

const content = fs.readFileSync(`./person${process.argv[2]}.logs`, 'utf8').split('\n')
    .filter((line) => {
        return line.includes(filter)
    })
console.log(content.join('\n'));