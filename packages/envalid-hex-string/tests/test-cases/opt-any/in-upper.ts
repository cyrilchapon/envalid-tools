import { HexStringValidatorOptions } from '../../index.js'
import { TestCase } from '../_base.js'
import commonOpts from './_common-opts.js'

const options: HexStringValidatorOptions = {
  ...commonOpts,
  out0x: 'in',
  outCase: 'upper',
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
    output: '0X123ABC',
  },
  {
    options,
    input: '0X123ABC',
    output: '0X123ABC',
  },
  {
    options,
    input: '123abc',
    output: '123ABC',
  },
  {
    options,
    input: '123ABC',
    output: '123ABC',
  },
]

export const testCases = {
  options,
  _testCases,
}