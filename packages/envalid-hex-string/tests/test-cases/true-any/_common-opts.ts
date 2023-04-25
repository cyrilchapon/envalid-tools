import { HexStringValidatorOptions } from '../../index'

const commonOpts: Pick<HexStringValidatorOptions, 'in0x' | 'inCase'> = {
  in0x: true,
  inCase: 'any',
}

export default commonOpts
