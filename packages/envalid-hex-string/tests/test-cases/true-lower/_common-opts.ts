import { HexStringValidatorOptions } from '../../index.js'

const commonOpts: Pick<HexStringValidatorOptions, 'in0x' | 'inCase'> = {
  in0x: true,
  inCase: 'lower',
}

export default commonOpts
