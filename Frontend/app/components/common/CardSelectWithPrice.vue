<script setup lang="ts">
type CardOption = {
  label: string
  value: string
}

const props = defineProps<{
  modelValue: string[]
  cards: CardOption[]
  cardData: Record<string, { price: number; qty: number }>
}>()
const emit = defineEmits<{
  'update:modelValue': [value: string[]]
  'update:cardData': [value: Record<string, { price: number; qty: number }>]
}>()

function toggleCard(cardValue: string) {
  const selected = props.modelValue.includes(cardValue)
  let newSelected = [...props.modelValue]
  if (selected) {
    newSelected = newSelected.filter(v => v !== cardValue)
  } else {
    newSelected.push(cardValue)
  }
  emit('update:modelValue', newSelected)
}

function updateCardData(cardValue: string, key: 'price' | 'qty', value: number) {
  const newCardData = { ...props.cardData }
  if (!newCardData[cardValue]) {
    newCardData[cardValue] = { price: 0, qty: 0 }
  }
  const item = newCardData[cardValue]
  if (item) {
    item[key] = value
  }
  emit('update:cardData', newCardData)
}
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-highlighted uppercase tracking-wider">ជ្រើសរើសសៀវភៅ និងតម្លៃ</label>
      <span class="text-[10px] text-toned font-bold uppercase">{{ modelValue.length }} មុខបានជ្រើសរើស</span>
    </div>
    <div class="grid grid-cols-1 gap-3">
      <div
v-for="card in cards" :key="card.value"
        class="group relative flex flex-col gap-4 p-4 border rounded-xl transition-all duration-300 overflow-hidden"
        :class="modelValue.includes(card.value) 
          ? 'bg-primary/5 border-primary ring-1 ring-primary/10 shadow-sm' 
          : 'bg-surface border-default hover:border-primary/40 hover:bg-primary/2'"
        @click="toggleCard(card.value)">
        
        <!-- Selection Header -->
        <div class="flex items-center gap-4">
          <UCheckbox 
            :model-value="modelValue.includes(card.value)" 
            size="lg"
            color="primary"
            @update:model-value="() => toggleCard(card.value)"
            @click.stop
          />
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-bold text-highlighted flex items-center gap-2">
              <span class="khmer-text">{{ card.label }}</span>
              <UKbd v-if="card.value.includes('1')" size="sm">1</UKbd>
              <UKbd v-else-if="card.value.includes('2')" size="sm">2</UKbd>
              <UKbd v-else-if="card.value.includes('3')" size="sm">3</UKbd>
            </h4>
            <p v-if="!modelValue.includes(card.value)" class="text-[11px] text-muted khmer-text mt-0.5">
              ចុចដើម្បីជ្រើសរើស និងកំណត់តម្លៃ
            </p>
          </div>
          
          <!-- Selected Status Badge -->
          <div v-if="modelValue.includes(card.value)" class="hidden sm:block">
            <UBadge color="primary" variant="subtle" size="sm" class="font-bold">ជ្រើសរើសរួច</UBadge>
          </div>
        </div>

        <!-- Expanded Controls (Visible when selected) -->
        <div 
          v-if="modelValue.includes(card.value)"
          class="flex flex-wrap items-center gap-4 sm:gap-6 p-3 bg-white dark:bg-neutral-800/50 rounded-lg border border-primary/20 animate-in fade-in slide-in-from-top-2 duration-300"
          @click.stop
        >
          <div class="flex flex-col gap-1.5 flex-1 min-w-20">
            <span class="text-[10px] text-muted uppercase font-black px-1 khmer-text">តម្លៃ ($)</span>
            <UInput 
              :model-value="cardData[card.value]?.price" 
              type="number" 
              size="md" 
              class="w-full"
              @update:model-value="val => updateCardData(card.value, 'price', Number(val))" 
            />
          </div>
          
          <div class="flex flex-col gap-1.5 flex-1 min-w-15">
            <span class="text-[10px] text-muted uppercase font-black px-1 khmer-text">ចំនួន</span>
            <UInput 
              :model-value="cardData[card.value]?.qty" 
              type="number" 
              size="md" 
              class="w-full"
              @update:model-value="val => updateCardData(card.value, 'qty', Number(val))" 
            />
          </div>

          <div class="flex flex-col gap-1 px-2 border-l border-default min-w-17.5">
            <span class="text-[10px] text-primary uppercase font-black khmer-text">សរុប</span>
            <div class="text-lg font-black text-primary">
              ${{ ((cardData[card.value]?.price || 0) * (cardData[card.value]?.qty || 0)).toFixed(2) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
