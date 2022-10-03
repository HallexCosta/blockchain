import { BinaryLike, createHash } from 'crypto'

export function hash(data: BinaryLike): string {
  return createHash('sha256').update(data).digest('hex')
}

export function isHashProofed({
  hash,
  difficulty = 4,
  prefix = '0'
}: {
  hash: string
  difficulty: number
  prefix: string
}) {
  const check = prefix.repeat(difficulty)
  return hash.startsWith(check)
}

export function getProcessArg(argName: string) {
  const args = process.argv.slice(2)
  const validArgs = args.find((arg) => arg.startsWith(`--${argName}`)) as string
  const [name, value] = validArgs.split('=')
  return value
}
