import * as envalid from 'envalid'
import { ZodError, ZodSchema, ZodTypeDef } from 'zod'
import { prettifyZodError } from './pretty-zod-error.js'

const zodJSONValidator = <
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
      const jsonParsed = JSON.parse(x)
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

export default zodJSONValidator
