import { ZodError } from 'zod'

export const prettifyZodError = (error: ZodError) => {
  return [
    ...Object.entries(error.issues).map(
      ([, issue]) =>
        `- [${
          issue.path != null && issue.path.length > 0
            ? issue.path.join('.')
            : 'root'
        }]: ${issue.message}`,
    ),
  ].join('\n')
}
