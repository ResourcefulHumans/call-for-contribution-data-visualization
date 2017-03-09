import {readFile} from 'fs'
import Promise from 'bluebird'
import Chance from 'chance'
import crypto from 'crypto'

const readFileAsync = Promise.promisify(readFile)
const chance = new Chance()

readFileAsync(process.argv[process.argv.length - 1], 'utf8')
  .then(data => JSON.parse(data))
  .then(data => {
    process.stdout.write(JSON.stringify(
      {
        users: data.users.map(user => {
          const hash = crypto.createHash('sha256')
          return {
            email: hash.update(user.email).digest('hex'),
            name: chance.name(),
            avatar: chance.avatar({protocol: 'https'}) + '?s=256&d=wavatar'
          }
        }),
        customers: data.customers.map(customer => {
          return {
            id: customer.id,
            label: `${chance.last()} ${chance.city()} Inc.`,
            description: chance.paragraph({sentences: 1}),
            avatar: chance.avatar({protocol: 'https'}) + '?s=256&d=retro'
          }
        }),
        contributions: data.contributions.map(contribution => Object.assign(contribution, {
          title: chance.sentence({words: 5}),
          description: chance.paragraph({sentences: 2}),
          commitments: contribution.commitments.filter(commitment => commitment.user).map(commitment => {
            const hash = crypto.createHash('sha256')
            return Object.assign(commitment, {
              user: hash.update(commitment.user).digest('hex')
            })
          })
        })).filter(contribution => contribution.commitments.length)
      },
      null,
      '\t'
    ))
  })
