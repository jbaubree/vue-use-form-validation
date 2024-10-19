<script setup lang="ts">
import { ref } from 'vue'
import { useFormValidation } from 'vue-use-form-validation'
import * as z from 'zod'

const schema = z.object({
  field1: z.string().min(1, 'field1 is required'),
  field2: z.string().email('Invalid field2'),
})

const form = ref({
  field1: '',
  field2: '',
})

const { validate } = useFormValidation(schema, form)

await validate()
</script>

<template>
  Hi
</template>
