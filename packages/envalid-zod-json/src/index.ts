import * as envalid from 'envalid'
import { ZodError, ZodSchema, ZodTypeDef } from 'zod'
import { prettifyZodError } from './pretty-zod-error.js'
import JSON5 from 'json5'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JSONParser = (input: string) => any

const _zodJSONValidator =
  (parser: JSONParser) =>
  <
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Output = any,
    Def extends ZodTypeDef = ZodTypeDef,
    Input = Output,
    T extends ZodSchema<Output, Def, Input> = ZodSchema<Output, Def, Input>,
  >(
    schema: T,
  ) =>
    envalid.makeValidator((x) => {
      try {
        const jsonParsed = parser(x)
        const schemaParsed = schema.parse(jsonParsed)
        return schemaParsed
      } catch (error: unknown) {
        if (error instanceof ZodError) {
          const formattedError = prettifyZodError(error)
          throw new envalid.EnvError(
            formattedError !== '' ? `\n${formattedError}` : '',
          )
        }
        throw error
      }
    })

const zodJSONValidator = _zodJSONValidator(JSON.parse)
const zodJSON5Validator = _zodJSONValidator(JSON5.parse)

export { zodJSONValidator, zodJSON5Validator }
