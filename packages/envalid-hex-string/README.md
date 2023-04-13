# @chimanos/envalid-hex-string

[Envalid](https://github.com/af/envalid) hex string validator.

## Installation

```shell
yarn add @chimanos/envalid-hex-string
# or
npm install @chimanos/envalid-hex-string
```

## Usage

```ts
import * as envalid from 'envalid'
import hexStringValidator from '@chimanos/envalid-hex-string'

type MyEnv = {
  MY_HEX_STR: string
}

const myEnvValidators = {
  MY_HEX_STR: hexStringValidator({
    // Options
  })()
}

// With MY_HEX_STR=0xF09
const myEnv = envalid.cleanEnv<MyEnv>(process.env, myEnvValidators)
```

## Options

#### `in0x` (`true` | `false` | `'optional'`)
Determine wether a leading `0x` is required (`true`), forbidden (`false`) or optional (`'optional'`)

#### `out0x` (`true` | `false` | `'in'`)
Determine wether a leading `0x` is added to the response always (`true`), never (`false`) or respecting input (`'in'`)

#### `inCase` (`'upper'` | `'lower'` | `'any'`)
Determine wether input case must be uppercase (`'upper'`), lowercase (`'lower'`) or doesn't matter (`'any'`)

#### `outCase` (`'upper'` | `'lower'` | `'in'`)
Determine wether output case is transformed to uppercase (`'upper'`), lowercase (`'lower'`) or left as-is (`'in'`)
