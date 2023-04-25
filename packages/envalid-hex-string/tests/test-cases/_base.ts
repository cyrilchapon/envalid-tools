import { HexStringValidatorOptions } from '../index'

export type PassingTestCase = {
  options: HexStringValidatorOptions
  input: string
  output: string
}

export type ThrowingTestCase = {
  options: HexStringValidatorOptions
  input: string
}

export type TestCase = PassingTestCase | ThrowingTestCase

export const shouldPass = (testCase: TestCase): testCase is PassingTestCase => {
  return 'output' in (testCase as PassingTestCase)
}
