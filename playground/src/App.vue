<script setup lang="ts">
import { UButton, UCard, UContainer, UFormGroup, UIcon, UInput, UNotifications, useToast, UText } from 'unuse-ui'
import { ref } from 'vue'
import { useFormValidation } from 'vue-use-form-validation'
import * as z from 'zod'

const toast = useToast()

const schema = z.object({
  user: z.object({
    name: z.string().min(1),
  }),
  email: z.string().email(),
  password: z.string().min(8),
})

const form = ref({
  user: {
    name: '',
  },
  email: '',
  password: '',
})

const {
  errorCount,
  hasError,
  isLoading,
  isValid,
  focusFirstErroredInput,
  focusInput,
  getErrorMessage,
  errorPaths,
  validate,
} = useFormValidation(schema, form, { errorStrategy: 'deep' })

async function onSubmit() {
  await validate()
  if (!isValid.value) {
    focusFirstErroredInput()
    return
  }
  toast.add({ title: 'Form is valid !', icon: 'icon-ph-check-circle', color: 'success' })
}
</script>

<template>
  <UContainer class="py-5">
    <UText as="h1" label="Form example" class="mb-5" :ui="{ font: 'font-bold', size: 'text-2xl' }" />
    <form class="flex flex-col gap-3 mb-5">
      <UFormGroup label="User Name" :error="getErrorMessage('user.name')" is-required>
        <UInput v-model="form.user.name" name="user.name" type="text" placeholder="Enter your name" size="md" />
      </UFormGroup>
      <UFormGroup label="Email" :error="getErrorMessage('email')" is-required>
        <UInput v-model="form.email" name="email" type="email" placeholder="email@email.com" autofocus size="md" />
      </UFormGroup>
      <UFormGroup label="Password" :error="getErrorMessage('password')" is-required>
        <UInput v-model="form.password" name="password" type="password" placeholder="**********" size="md" />
      </UFormGroup>
      <UButton label="Submit" color="pilot" is-block :is-loading="isLoading" @click="onSubmit" />
    </form>
    <UCard v-if="hasError" :ui="{ background: 'bg-red-200 dark:bg-red-600', body: { base: 'flex flex-col items-start gap-2' } }">
      <UText :label="`Form has ${errorCount} ${errorCount > 1 ? 'errors' : 'error'}:`" :ui="{ font: 'font-bold', size: 'text-lg' }" class="mb-1" />
      <div
        v-for="errorPath, i in errorPaths"
        :key="i"
        class="flex items-center"
      >
        <UIcon name="icon-ph-dot-bold" color="dark" />
        <UButton
          class="ml-3" color="dark" :is-padded="false" variant="link"
          :label="getErrorMessage(errorPath)"
          @click="focusInput({ inputName: errorPath })"
        />
      </div>
    </UCard>
  </UContainer>
  <Teleport to="body">
    <UNotifications />
  </Teleport>
</template>
