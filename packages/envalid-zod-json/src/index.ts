import * as envalid from 'envalid'
import { ZodError, ZodSchema } from 'zod'
import { prettifyZodError } from './pretty-zod-error.js'

const zodJSONValidator = <U, T extends ZodSchema<U>>(schema: T) =>
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
