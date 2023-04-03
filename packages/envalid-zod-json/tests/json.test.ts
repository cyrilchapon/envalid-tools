import { describe, it } from 'mocha'
import { assert } from 'chai'
import { zodJSONValidator } from '../src/index.js'
import { z } from 'zod'
import * as envalid from 'envalid'
import { envalidErrorFormatter, ReporterOptions } from 'envalid'

type PassingTestCase<T> = {
  input: string
  schema: z.ZodSchema<T>
  output: T
}

type ThrowingTestCase<T> = {
  input: string
  schema: z.ZodSchema<T>
}

type TestCase<T> = PassingTestCase<T> | ThrowingTestCase<T>

const shouldPass = <T>(
  testCase: TestCase<T>,
): testCase is PassingTestCase<T> => {
  return 'output' in (testCase as PassingTestCase<T>)
}

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

/* eslint-disable @typescript-eslint/no-explicit-any */
describe('zodJSONValidator', () => {
  const testCases: TestCase<any>[] = [
    { input: '3', schema: z.number(), output: 3 },
    { input: '"3"', schema: z.string(), output: '3' },
    { input: '[]', schema: z.array(z.any()), output: [] },
    { input: '{}', schema: z.object({}), output: {} },
    { input: '"pouet"', schema: z.null() },
    { input: '{eqdsq}', schema: z.object({}) },
    { input: '{"foo": "bar"}', schema: z.object({ foo: z.literal('baz') }) },
    {
      input: '{"foo": "bar"}',
      schema: z.object({ foo: z.literal('bar'), qux: z.string() }),
    },
  ]

  testCases.forEach((testCase) => {
    if (shouldPass(testCase)) {
      it(`should parse with shape ${testCase.schema} and input ${testCase.input}`, async () => {
        const validator = zodJSONValidator(testCase.schema)
        const actual = envalid.customCleanEnv(
          { someEnv: testCase.input },
          { someEnv: validator() },
          identifyFormatter,
          { reporter: throwingReporter },
        )
        assert.deepEqual(actual, { someEnv: testCase.output })
      })
    } else {
      it(`should throw with shape ${testCase.schema} and input ${testCase.input}`, async () => {
        const validator = zodJSONValidator(testCase.schema)
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
/* eslint-enable @typescript-eslint/no-explicit-any */
