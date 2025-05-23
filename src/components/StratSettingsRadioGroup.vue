<script setup lang="ts">
import { Label } from '@/components/shadcn-vue/label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-vue/radio-group'

interface SettingOption {
  id: string
  name: string
  description: string
}

interface Props {
  name: string
  defaultValue: string
  disabled?: boolean
  options: SettingOption[]
  onValueChange: (value: string) => void
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <Label class="text-lg font-medium">{{ name }}</Label>
    <RadioGroup
      :default-value="defaultValue"
      class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
      :disabled="disabled"
      @update:model-value="onValueChange"
    >
      <Label
        v-for="option in options"
        :key="option.id"
        class="hover:bg-accent/50 flex items-start gap-2 rounded-lg border p-3 hover:shadow-sm has-[[data-state=checked]]:border-green-600 has-[[data-state=checked]]:bg-green-50 dark:has-[[data-state=checked]]:border-green-900 dark:has-[[data-state=checked]]:bg-green-950"
      >
        <RadioGroupItem
          :id="option.id"
          :value="option.id"
          class="mt-0.5 shadow-none data-[state=checked]:border-green-600 data-[state=checked]:bg-green-600 *:data-[slot=radio-group-indicator]:[&>svg]:fill-white *:data-[slot=radio-group-indicator]:[&>svg]:stroke-white"
        />
        <div class="grid gap-1 font-normal">
          <div class="text-base font-medium">{{ option.name }}</div>
          <div class="text-muted-foreground text-sm leading-snug">{{ option.description }}</div>
        </div>
      </Label>
    </RadioGroup>
  </div>
</template>
