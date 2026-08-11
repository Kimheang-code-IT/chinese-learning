<template>
  <div class="invoice-container px-4 sm:px-10 py-4 bg-elevated overflow-y-auto max-h-[85vh]" :class="{ 'hidden lg:block': !show }">
    <div class="flex items-start justify-between mb-4">
      <slot name="logo">
        <AppLogo class="h-8! sm:h-10! w-auto" />
      </slot>
      <h1 class="text-lg sm:text-2xl font-bold text-highlighted uppercase tracking-widest">វិក្កយបត្រ</h1>
    </div>
    <div class="grid grid-cols-2 gap-4 sm:gap-8 mb-4">
      <div>
        <h3 class="text-sm sm:text-md font-bold text-toned uppercase tracking-wider mb-2">ព័ត៌មានវិក្កយបត្រ</h3>
        <div class="space-y-1 text-xs sm:text-sm">
          <div class="flex">
            <span class="w-20 sm:w-24 text-toned">លេខវិក្កយបត្រ:</span>
            <span class="font-medium text-highlighted">{{ invoiceNo }}</span>
          </div>
          <div class="flex">
            <span class="w-20 sm:w-24 text-toned">កាលបរិច្ឆេទ:</span>
            <span class="font-medium text-highlighted">{{ todayDate }}</span>
          </div>
          <div class="flex">
            <span class="w-20 sm:w-24 text-toned">ការទូទាត់:</span>
            <span class="font-medium text-highlighted">{{ paymentMethod || '-' }}</span>
          </div>
        </div>
      </div>
      <div>
        <h3 class="text-sm sm:text-md font-bold text-toned uppercase tracking-wider mb-2">ព័ត៌មានអតិថិជន</h3>
        <div class="space-y-1 text-xs sm:text-sm">
          <div class="flex">
            <span class="w-16 sm:w-24 text-toned">ឈ្មោះ:</span>
            <span class="font-medium text-highlighted truncate">{{ name || 'N/A' }}</span>
          </div>
          <div class="flex">
            <span class="w-16 sm:w-24 text-toned">លេខទូរស័ព្ទ:</span>
            <span class="font-medium text-highlighted">{{ phone || 'N/A' }}</span>
          </div>
          <div class="flex">
            <span class="w-16 sm:w-24 text-toned">អាសយដ្ឋាន:</span>
            <span class="font-medium text-highlighted">{{ address || 'N/A' }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-6">
      <div class="bg-primary px-3 sm:px-4 py-3 text-white font-bold text-[10px] sm:text-xs uppercase grid grid-cols-12 gap-1 sm:gap-2 rounded-t-xs">
        <div class="col-span-1">ល.រ</div>
        <div class="col-span-4">ការពិពណ៌នា</div>
        <div class="col-span-3 text-right">តម្លៃ</div>
        <div class="col-span-2 text-center">ចំនួន</div>
        <div class="col-span-2 text-right">សរុប</div>
      </div>
      <div class="border border-default border-t-0 rounded-b-lg">
        <template v-if="selectedCards?.length">
          <div v-for="(cardValue, index) in selectedCards" :key="cardValue" class="px-3 sm:px-4 py-3 sm:py-4 text-[11px] sm:text-sm grid grid-cols-12 gap-1 sm:gap-2 border-b border-default last:border-0">
            <div class="col-span-1 text-toned">{{ (index + 1).toString().padStart(2, '0') }}</div>
            <div class="col-span-4 font-medium text-highlighted truncate">{{ cards.find(c => c.value === cardValue)?.label || cardValue }}</div>
            <div class="col-span-3 text-right">${{ cardData[cardValue]?.price?.toFixed(2) || '0.00' }}</div>
            <div class="col-span-2 text-center">{{ cardData[cardValue]?.qty || 0 }}</div>
            <div class="col-span-2 text-right font-bold text-primary">${{ (cardData[cardValue] ? cardData[cardValue].price * cardData[cardValue].qty : 0).toFixed(2) }}</div>
          </div>
        </template>
        <div v-else class="py-12 text-center text-toned italic text-[11px] sm:text-sm">
          មិនទាន់មានការជ្រើសរើសផលិតផល
        </div>
      </div>
    </div>
    <div class="space-y-4 sm:space-y-6">
      <div class="flex justify-between items-start">
        <div class="space-y-2 hidden sm:block">
          <h3 class="text-xs font-bold text-toned uppercase tracking-wider">លក្ខខណ្ឌផ្សេងៗ</h3>
          <p class="text-sm text-toned italic">សូមអរគុណសម្រាប់ការគាំទ្រ!</p>
        </div>
        <div class="w-full sm:w-48 space-y-2 sm:space-y-3">
          <div class="flex justify-between text-xs sm:text-sm">
            <span class="text-toned">សរុប</span>
            <span class="font-bold text-highlighted">${{ subtotal.toFixed(2) }}</span>
          </div>
          <div v-if="discount" class="flex justify-between text-xs sm:text-sm">
            <span>បញ្ចុះតម្លៃ ({{ discount }}%)</span>
            <span>-${{ discountAmount.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-base sm:text-lg pt-2 sm:pt-4 border-t-2 border-primary">
            <span class="font-black text-highlighted uppercase">សរុបទាំងអស់</span>
            <span class="font-black text-highlighted">${{ grandTotal.toFixed(2) }}</span>
          </div>
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-default text-[10px] sm:text-[14px] text-toned">
        <div class="flex items-center gap-1.5 justify-center sm:justify-start">
          <UIcon name="i-lucide-map-pin" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>59 Street 261, Phnom Penh</span>
        </div>
        <div class="flex items-center gap-1.5 justify-center">
          <UIcon name="i-lucide-phone" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>(+855) 010828301</span>
        </div>
        <div class="flex items-center gap-1.5 justify-center sm:justify-end">
          <UIcon name="i-lucide-mail" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Phonndina73@gmail.com</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppLogo from './AppLogo.vue'
import type { PropType } from 'vue'

defineProps({
  show: { type: Boolean, default: false },
  invoiceNo: { type: String, default: '' },
  todayDate: { type: String, default: '' },
  paymentMethod: { type: String, default: '' },
  name: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  selectedCards: { type: Array as PropType<string[]>, default: () => [] },
  cards: { type: Array as PropType<Array<{ value: string; label: string }>>, default: () => [] },
  cardData: { type: Object as PropType<Record<string, { price: number; qty: number }>>, default: () => ({}) },
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
})
</script>

<style scoped>
.invoice-container {
  background: var(--color-elevated, #f9fafb);
}
</style>
