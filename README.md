# Vue 3 Form Validation Composable

[![NPM Version](https://badgen.net/npm/v/vue-use-form-validation)](https://www.npmjs.com/package/vue-use-form-validation)
[![Monthly Downloads](https://badgen.net/npm/dm/vue-use-form-validation)](https://www.npmjs.com/package/vue-use-form-validation)
[![Types](https://badgen.net/npm/types/vue-use-form-validation)](https://github.com/jbaubree/vue-use-form-validation/blob/main/src/types.ts)
[![Licence](https://badgen.net/npm/license/vue-use-form-validation)](https://github.com/jbaubree/vue-use-form-validation/blob/main/LICENSE.md)
[![CI](https://github.com/jbaubree/vue-use-form-validation/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/jbaubree/vue-use-form-validation/actions/workflows/ci.yml)
[![Coverage](https://github.com/jbaubree/vue-use-form-validation/blob/main/badge.svg)](https://github.com/jbaubree/vue-use-form-validation/tree/main/test)

A Vue 3 composable library for form validation, compatible with Zod, Yup, Joi, Valibot, and Superstruct. This library allows for seamless validation of forms and supports custom validation through a transformation function.

## Features

- **⚡️ Compatibility**: Natively supports Zod, Yup, Joi, Valibot, and Superstruct.
- **🧩 Type Safety**: Strongly typed with TypeScript, ensuring compile-time validation and reducing runtime errors.
- **💨 Bundle Size**: Small bundle size (<3kb).
- **📦 Zero Dependencies**: No dependencies.
- **✅ Custom Validation**: Compatible with any other validation libraries using `transformFn`.
- **⚙️ Customizable Validation Modes**: Offers 'eager' and 'lazy' validation modes to fit different user experience needs.
- **🔗 Reactive Integration**: Fully integrates with Vue’s reactivity system, providing a seamless experience when working with reactive form states.
- **📈 Performance Optimized**: Efficiently handles validation with minimal performance overhead, making it suitable for large forms.
- **📅 Easy Integration**: Simple to integrate with existing Vue 3 projects, requiring minimal setup to start validating forms.

## Installation

To install the library, run:

```bash
npm install vue-use-form-validation
```

## Usage

Importing the Composable

```ts
import { useFormValidation } from 'vue-use-form-validation'
```

## Types

```ts
// Import types for better TypeScript support
import type { FieldErrors, Form, GetErrorsFn, ReturnType, Schema } from './types'
```

## Basic Example

This example shows how to use `vue-use-form-validation` with Zod for validation. However, you can use other validation libraries like Yup, Joi, Valibot, or Superstruct by adjusting the validation logic accordingly.

```ts
import { ref } from 'vue'
import { useFormValidation } from 'vue-use-form-validation'
import * as z from 'zod'

// Define your schema
const schema = z.object({
  field1: z.string().min(1, 'field1 is required'),
  field2: z.string().email('Invalid field2'),
})

// Create a reactive form
const form = ref({
  field1: '',
  field2: '',
})

// Initialize the form validation
const {
  validate,
  errors,
  isValid,
  errorCount,
  clearErrors,
  getErrorMessage,
  focusFirstErroredInput,
} = useFormValidation(schema, form)

// Submit your form
async function onSubmit() {
  await validate()
  if (!isValid.value) {
    console.log(errors.value)
    focusFirstErroredInput()
  }
}
```

## Options

```ts
const options = {
  mode: 'eager', // or 'lazy'
  transformFn: (schema: Schema, form: Form) => {
    // Custom validation logic
    return {} // Return errors if any
  },
}

const { validate } = useFormValidation(schema, form, options)
```

## Methods

- validate(): Triggers the validation process.
- clearErrors(): Resets the validation errors.
- getErrorMessage(path: keyof F): Retrieves the error message for a specific field.
- focusFirstErroredInput(): Focuses the first input with an error.
- focusInput(inputName: keyof F): Focuses a specific input by its name.

## API Reference

```ts
declare function useFormValidation<S extends Schema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: {
    mode?: 'eager' | 'lazy' // lazy by default
    transformFn?: GetErrorsFn<S, F>
  }
): ReturnType<F>
```

#### Parameters

- **schema**: The validation schema.
- **form**: The reactive form object.
- **options**: Optional configuration object.
  - **mode**: (optional) Validation mode (`'eager'` for immediate validation or `'lazy'` for validation on form changes).
  - **transformFn**: (optional) A transformation function that can be used when integrating a different validation library. It allows you to transform data before it is validated. Use this option only if you are integrating another validation library that requires specific data handling.

#### Return Value

Returns an object containing the following properties:

- `validate`: Function to validate the form.
- `errors`: Reactive reference to the current validation errors.
- `isValid`: Reactive reference indicating whether the form is valid.
- `errorCount`: Reactive reference to the number of errors.
- `clearErrors`: Function to clear validation errors.
- `getErrorMessage`: Function to get the error message for a specific field.
- `focusFirstErroredInput`: Function to focus the first input with an error.
- `focusInput`: Function to focus a specific input.

## Example Tests

Refer to the `useFormValidation.test.ts` file for comprehensive test cases that demonstrate the functionality and usage of the composable.

## License

[MIT License](https://github.com/jbaubree/vue-use-form-validation/blob/main/LICENSE.md)
