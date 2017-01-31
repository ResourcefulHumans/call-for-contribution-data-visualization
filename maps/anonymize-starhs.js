import {readFile} from 'fs'
import Promise from 'bluebird'
import Chance from 'chance'
const readFileAsync = Promise.promisify(readFile)
const chance = new Chance()

readFileAsync(process.argv[process.argv.length - 1], 'utf8')
  .then(data => JSON.parse(data))
  .then(data => {
    process.stdout.write(JSON.stringify(
      {
        nodes: data.nodes.map(node => {
          return {
            id: node.id,
            label: chance.name()
          }
        }),
        edges: data.edges
      },
      null,
      '\t'
    ))
  })
