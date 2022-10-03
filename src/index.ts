import Blockchain from './blockchain'
import { getProcessArg } from './helpers'

const difficulty = Number(getProcessArg('difficulty')) || 4
const numberBlocks = Number(getProcessArg('blocks')) || 10

const blockchain = new Blockchain(difficulty)

let chain = blockchain.chain

for (let i = 1; i <= numberBlocks; i++) {
  const block = blockchain.createBlock(`Block ${i}`)
  const mineInfo = blockchain.mineBlock(block)
  chain = blockchain.sendBlock(mineInfo.minedBlock)
}

console.log('--- BLOCKCHAIN ---')
console.log(chain)
