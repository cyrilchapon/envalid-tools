import { HexStringValidatorOptions } from '../../index.js'

const commonOpts: Pick<HexStringValidatorOptions, 'in0x' | 'inCase'> = {
  in0x: 'optional',
  inCase: 'lower',
}

export default commonOpts
