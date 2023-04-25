import { HexStringValidatorOptions } from '../../index'

const commonOpts: Pick<HexStringValidatorOptions, 'in0x' | 'inCase'> = {
  in0x: true,
  inCase: 'upper',
}

export default commonOpts
