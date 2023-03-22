# @chimanos/envalid-zod-json

[Envalid](https://github.com/af/envalid) JSON parser powered by [Zod](https://github.com/colinhacks/zod).

## Installation

```shell
yarn add @chimanos/envalid-zod-json
# or
npm install @chimanos/envalid-zod-json
```

## Usage

```ts
import { z } from 'zod'
import * as envalid from 'envalid'
import zodJSONValidator from '@chimanos/envalid-zod-json'

const myObjectSchema = z.object({ foo: z.literal('bar') })
type MyObject = z.infer<typeof myObjectSchema>

type MyEnv = {
  MY_OBJECT: MyObject
}

const myEnvValidators = {
  MY_OBJECT: zodJSONValidator(myObjectSchema)()
}

// With MY_OBJECT={"foo": "bar"}
const myEnv = envalid.cleanEnv<MyEnv>(process.env, myEnvValidators)
```
