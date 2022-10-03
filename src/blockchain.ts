import { hash, isHashProofed } from './helpers'

export declare interface Block {
  header: {
    nonce: number
    blockHash: string
  }
  payload: {
    sequence: number
    timestamp: number
    datas: any
    previousHash: string
  }
}

export default class Blockchain {
  #chain: Block[] = []
  // Pow = Process of Worker
  private proofOfWorkPrefix = '0'

  public constructor(private readonly difficulty: number = 4) {
    this.#chain.push(this.createGenesisBlock())
  }

  private createGenesisBlock(): Block {
    const payload: Block['payload'] = {
      sequence: 0,
      timestamp: +new Date(),
      datas: 'Genesis Block',
      previousHash: ''
    }

    return {
      header: {
        nonce: 0,
        blockHash: hash(JSON.stringify(payload))
      },
      payload
    }
  }

  public get chain(): Block[] {
    return this.#chain
  }

  private get lastBlock(): Block {
    return this.#chain.at(-1) as Block
  }

  private getPreviousBlockHash() {
    return this.lastBlock.header.blockHash
  }

  public createBlock(datas: any): Block['payload'] {
    const newBlock = {
      sequence: this.lastBlock.payload.sequence + 1,
      timestamp: +new Date(),
      datas,
      previousHash: this.getPreviousBlockHash()
    }

    console.log(
      `Block #${newBlock.sequence} created: ${JSON.stringify(newBlock)}`
    )
    return newBlock
  }

  public mineBlock(block: Block['payload']) {
    let nonce: number = 0
    let startTime: number = +new Date()

    while (true) {
      // creating block hash id
      const blockHash: string = hash(JSON.stringify(block))
      const proofingHash = hash(blockHash + nonce)

      if (
        isHashProofed({
          hash: proofingHash,
          difficulty: this.difficulty,
          prefix: this.proofOfWorkPrefix
        })
      ) {
        const milliseconds = 1000
        const endTime = +new Date()
        const shortHash = blockHash.slice(0, 12)
        const miningTimeInSeconds = (endTime - startTime) / milliseconds

        console.log(
          `Block #${block.sequence} mined in ${miningTimeInSeconds}s. Hash ${shortHash} (${nonce} attempts)`
        )

        return {
          minedBlock: {
            payload: { ...block },
            header: { nonce, blockHash }
          }
        }
      }
      nonce++
    }
  }

  private verifyBlock(block: Block) {
    if (block.payload.previousHash !== this.getPreviousBlockHash()) {
      console.error(
        `Block #${
          block.payload.sequence
        } invalid: The previous hash ${this.getPreviousBlockHash().slice(
          0,
          12
        )} isn't ${block.payload.previousHash.slice(0, 12)}`
      )
      return
    }

    const hashTest = hash(
      hash(JSON.stringify(block.payload)) + block.header.nonce
    )
    if (
      !isHashProofed({
        hash: hashTest,
        difficulty: this.difficulty,
        prefix: this.proofOfWorkPrefix
      })
    ) {
      console.error(
        `Block #${block.payload.sequence} invalid: Nonce ${block.header.nonce} is invalid and cannot be verified`
      )
      return
    }

    return true
  }

  public sendBlock(block: Block): Block[] {
    if (this.verifyBlock(block)) this.#chain.push(block)
    console.log(
      `Block #${
        block.payload.sequence
      } was added to blockchain: ${JSON.stringify(block, null, 2)}`
    )
    return this.#chain
  }
}
