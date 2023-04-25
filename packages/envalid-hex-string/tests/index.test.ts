import { describe, it } from 'mocha'
import { assert } from 'chai'
import { HexStringValidatorOptions, hexStringValidator } from '../src/index'
import * as envalid from 'envalid'
import { envalidErrorFormatter, ReporterOptions } from 'envalid'
import { testCaseGroups } from './test-cases/index'
import { shouldPass } from './test-cases/_base'

type EnvalidErrors<T> = ReporterOptions<T>['errors']
type EnvalidLogger = (data: string) => void
const formatErrors = <T>(errors: EnvalidErrors<T>) => {
  let output = ''
  const logger: EnvalidLogger = (data) => {
    output = data
  }
  envalidErrorFormatter(errors, logger)

  return output as string
}

const throwingReporter = <T>({ errors }: ReporterOptions<T>) => {
  if (Object.keys(errors).length > 0) {
    throw new Error(formatErrors<T>(errors))
  }
  return
}
const identifyFormatter = <T>(t: T) => t

const printOptions = (options: HexStringValidatorOptions) =>
  `${options.in0x} | ${options.inCase} | ${options.out0x} | ${options.outCase}`

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('hexStringValidator', () => {
  Object.entries(testCaseGroups).forEach(([k, testCaseGroup]) => {
    const { _testCases: testCases, options } = testCaseGroup
    describe(printOptions(options), () => {
      testCases.forEach((testCase) => {
        if (shouldPass(testCase)) {
          it(`should parse with input ${testCase.input}`, async () => {
            const validator = hexStringValidator(testCase.options)
            const actual = envalid.customCleanEnv(
              { someEnv: testCase.input },
              { someEnv: validator() },
              identifyFormatter,
              { reporter: throwingReporter },
            )
            assert.deepEqual(actual, { someEnv: testCase.output })
          })
        } else {
          it(`should throw with input ${testCase.input}`, async () => {
            const validator = hexStringValidator(testCase.options)
            assert.throws(() => {
              envalid.customCleanEnv(
                { someEnv: testCase.input },
                { someEnv: validator() },
                identifyFormatter,
                { reporter: throwingReporter },
              )
            })
          })
        }
      })
    })
  })
})
/* eslint-enable @typescript-eslint/no-explicit-any */
