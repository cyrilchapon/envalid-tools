import * as envalid from 'envalid'

// #### `in0x` (`true` | `false` | `'optional'`)
// Determine wether a leading `0x` is required (`true`), forbidden (`false`) or optional (`'optional'`)

// #### `out0x` (`true` | `false` | `'auto'`)
// Determine wether a leading `0x` is added to the response always (`true`), never (`false`) or respecting input (`'auto'`)

// #### `inCase` (`'upper'` | `'lower'` | `'any'`)
// Determine wether input case must be uppercase (`'upper'`), lowercase (`'lower'`) or doesn't matter (`'any'`)

// #### `outCase` (`'upper'` | `'lower'` | `'auto'`)
// Determine wether output case is transformed to uppercase (`'upper'`), lowercase (`'lower'`) or left as-is (`'auto'`)

export type HexStringValidatorOptions = {
  in0x: boolean | 'optional'
  out0x: boolean | 'in'
  inCase: 'upper' | 'lower' | 'any'
  outCase: 'upper' | 'lower' | 'in'
}

const defaultOptions: HexStringValidatorOptions = {
  in0x: 'optional',
  out0x: true,
  inCase: 'any',
  outCase: 'lower',
}

type InOxCaseCombination =
  `${HexStringValidatorOptions['in0x']}_${HexStringValidatorOptions['inCase']}`

const IN_REGEXES: Record<InOxCaseCombination, RegExp> = {
  false_any: /^(?<hex>[a-fA-F\d]+)$/,
  false_lower: /^(?<hex>[a-f\d]+)$/,
  false_upper: /^(?<hex>[A-F\d]+)$/,
  true_any: /^(?<zeroX>0[xX])(?<hex>[a-fA-F\d]+)$/,
  true_lower: /^(?<zeroX>0[x])(?<hex>[a-f\d]+)$/,
  true_upper: /^(?<zeroX>0[X])(?<hex>[A-F\d]+)$/,
  optional_any: /^(?<zeroX>0[xX])?(?<hex>[a-fA-F\d]+)$/,
  optional_lower: /^(?<zeroX>0[x])?(?<hex>[a-f\d]+)$/,
  optional_upper: /^(?<zeroX>0[X])?(?<hex>[A-F\d]+)$/,
}

const getRegex = (options: HexStringValidatorOptions) =>
  IN_REGEXES[`${options.in0x}_${options.inCase}`]

const ERROR_MESSAGES: Record<InOxCaseCombination, string> = {
  false_any: 'Should be an hex string, without leading 0x',
  false_lower: 'Should be a lowercase hex string, without leading 0x',
  false_upper: 'Should be an uppercase hex string, without leading 0x',
  true_any: 'Should be an hex string, with a leading 0x',
  true_lower: 'Should be a lowercase hex string, with a lowercase leading 0x',
  true_upper: 'Should be an uppercase hex string, with an uppercase leading 0X',
  optional_any: 'Should be an hex string, optionally with a leading 0x',
  optional_lower:
    'Should be a lowercase hex string, optionally with a lowercase leading 0x',
  optional_upper:
    'Should be an uppercase hex string, optionally with an uppercase leading 0X',
}

const getErrorMessage = (options: HexStringValidatorOptions) =>
  ERROR_MESSAGES[`${options.in0x}_${options.inCase}`]

type OutOxCaseCombination =
  `${HexStringValidatorOptions['out0x']}_${HexStringValidatorOptions['outCase']}`

/* eslint-disable @typescript-eslint/no-non-null-assertion*/
const OUTPUT_PARSERS: Record<
  OutOxCaseCombination,
  (input: RegExpMatchArray) => string
> = {
  false_in: (input: RegExpMatchArray) => `${input.groups!.hex!}`,
  false_lower: (input: RegExpMatchArray) =>
    `${input.groups!.hex!.toLowerCase()}`,
  false_upper: (input: RegExpMatchArray) =>
    `${input.groups!.hex!.toUpperCase()}`,
  in_in: (input: RegExpMatchArray) =>
    `${input.groups!.zeroX ?? ''}${input.groups!.hex!}`,
  in_lower: (input: RegExpMatchArray) =>
    `${
      input.groups!.zeroX?.toLowerCase() ?? ''
    }${input.groups!.hex!.toLowerCase()}`,
  in_upper: (input: RegExpMatchArray) =>
    `${
      input.groups!.zeroX?.toUpperCase() ?? ''
    }${input.groups!.hex!.toUpperCase()}`,
  true_in: (input: RegExpMatchArray) =>
    `${input.groups!.zeroX ?? '0x'}${input.groups!.hex!}`,
  true_lower: (input: RegExpMatchArray) =>
    `0x${input.groups!.hex!.toLowerCase()}`,
  true_upper: (input: RegExpMatchArray) =>
    `0X${input.groups!.hex!.toUpperCase()}`,
}
/* eslint-enable @typescript-eslint/no-non-null-assertion*/

const getOutputParser = (options: HexStringValidatorOptions) =>
  OUTPUT_PARSERS[`${options.out0x}_${options.outCase}`]

export const hexStringValidator = (
  _options?: Partial<HexStringValidatorOptions>,
) =>
  envalid.makeValidator((input) => {
    const options: HexStringValidatorOptions = {
      ...defaultOptions,
      ...(_options ?? {}),
    }

    const regex = getRegex(options)
    const result = input.match(regex)

    if (result == null) {
      throw new envalid.EnvError(getErrorMessage(options))
    }

    const parser = getOutputParser(options)

    const output = parser(result)

    return output
  })

export default hexStringValidator
