import { HexStringValidatorOptions } from '../../index.js'

const commonOpts: Pick<HexStringValidatorOptions, 'in0x' | 'inCase'> = {
  in0x: false,
  inCase: 'any',
}

export default commonOpts
