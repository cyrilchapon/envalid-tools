import { HexStringValidatorOptions } from '../../index.js'

const commonOpts: Pick<HexStringValidatorOptions, 'in0x' | 'inCase'> = {
  in0x: 'optional',
  inCase: 'upper',
}

export default commonOpts
