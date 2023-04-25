import { HexStringValidatorOptions } from '../../index'
import { TestCase } from '../_base'
import commonOpts from './_common-opts'

const options: HexStringValidatorOptions = {
  ...commonOpts,
  out0x: true,
  outCase: 'lower',
}

const _testCases: TestCase[] = [
  {
    options,
    input: '0X123ABCW',
  },
  {
    options,
    input: '0x123abcw',
  },
  {
    options,
    input: '123ABCW',
  },
  {
    options,
    input: '123abcw',
  },
  {
    options,
    input: '0x123abc',
  },
  {
    options,
    input: '0X123ABC',
    output: '0x123abc',
  },
  {
    options,
    input: '123abc',
  },
  {
    options,
    input: '123ABC',
  },
]

export const testCases = {
  options,
  _testCases,
}
