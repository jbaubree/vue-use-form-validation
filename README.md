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
- **⚙️ Customizable Validation Modes**: Offers eager, lazy, agressive and onBlur validation modes to fit different user experience needs.
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
import type { FieldErrors, Form, GetErrorsFn, InputSchema, ReturnType } from './types'
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
  errorPaths,
  focusFirstErroredInput,
  cleanup,
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
  mode: 'eager', // or 'lazy' or 'agressive' or 'onBlur'
  transformFn: (schema: InputSchema, form: Form) => {
    // Custom validation logic
    return {} // Return errors if any
  },
  errorStrategy: 'flatten' // or 'deep'
}

const { validate } = useFormValidation(schema, form, options)
```

## Methods

- validate(): Triggers the validation process.
- clearErrors(): Resets the validation errors.
- getErrorMessage(path: keyof F | string): Retrieves the error message for a specific field. Supports nested paths like "user.name".
- errorPaths: Computed property that returns an array of all error paths, including nested ones (e.g., ["email", "user.name"]).
- focusFirstErroredInput(): Focuses the first input with an error.
- focusInput(inputName: keyof F | string): Focuses a specific input by its name. Supports nested paths like "user.name".
- cleanup(): Manually cleans up watchers, event listeners, and caches. Automatically called on component unmount when used inside a component context.

## API Reference

```ts
declare function useFormValidation<S extends InputSchema<F>, F extends Form>(
  schema: S,
  form: MaybeRefOrGetter<F>,
  options?: {
    mode?: 'eager' | 'lazy' | 'agressive' | 'onBlur' // lazy by default
    transformFn?: GetErrorsFn<S, F>
    errorStrategy?: 'flatten' | 'deep'
  }
): ReturnType<F>
```

#### Parameters

- **schema**: The validation schema.
- **form**: The reactive form object.
- **options**: Optional configuration object.
  - **mode**: (optional) Validation mode (`'eager'` for immediate validation,`'agressive'` for validation on load, `'lazy'` for validation on form changes or `'onBlur'` for validation on input blur).
  - **transformFn**: (optional) A transformation function that can be used when integrating a different validation library. It allows you to transform data before it is validated. Use this option only if you are integrating another validation library that requires specific data handling.
  - **errorStrategy**: (optional) Error format mode (`'flatten'` user.name has an error, `'deep'` for { user: { name: 'name has an error' } }).

#### Return Value

Returns an object containing the following properties:

- `validate`: Function to validate the form.
- `errors`: Reactive reference to the current validation errors.
- `isValid`: Reactive reference indicating whether the form is valid.
- `isLoading`: Reactive reference indicating if the form validation is in progress.
- `errorCount`: Reactive reference to the number of errors.
- `clearErrors`: Function to clear validation errors.
- `getErrorMessage`: Function to get the error message for a specific field. Supports nested paths like "user.name".
- `errorPaths`: Computed property that returns an array of all error paths, including nested ones (e.g., ["email", "user.name"]).
- `focusFirstErroredInput`: Function to focus the first input with an error.
- `focusInput`: Function to focus a specific input. Supports nested paths like "user.name".
- `cleanup`: Function to manually clean up watchers, event listeners, and caches. This is automatically called when the component unmounts if used within a component context, but can be called manually when needed (e.g., when using the composable outside of a component or for manual cleanup).

## Deep Strategy Example

When using the `errorStrategy: 'deep'` option, you can work with nested form structures and automatically get all error paths:

```vue
<script setup>
import { ref } from 'vue'
import { useFormValidation } from 'vue-use-form-validation'
import * as z from 'zod'

const schema = z.object({
  user: z.object({
    name: z.string().min(1, 'Name is required'),
  }),
  email: z.string().email('Invalid email'),
})

const form = ref({
  user: { name: '' },
  email: '',
})

const {
  validate,
  hasError,
  errorPaths,
  getErrorMessage,
  focusInput,
} = useFormValidation(schema, form, { errorStrategy: 'deep' })

async function onSubmit() {
  await validate()
  if (!isValid.value) {
    // errorPaths.value will contain ["user.name", "email"] when there are errors
    console.log('Error paths:', errorPaths.value)
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.user.name" name="user.name" placeholder="Name">
    <input v-model="form.email" name="email" placeholder="Email">

    <!-- Display all errors with automatic deep path handling -->
    <div v-if="hasError">
      <div v-for="errorPath in errorPaths" :key="errorPath">
        <button @click="focusInput({ inputName: errorPath })">
          {{ getErrorMessage(errorPath) }}
        </button>
      </div>
    </div>
  </form>
</template>
```

## Example

Refer to the `playground` folder for comprehensive use cases that demonstrate the functionality and usage of the composable.

## License

[MIT License](https://github.com/jbaubree/vue-use-form-validation/blob/main/LICENSE.md)
