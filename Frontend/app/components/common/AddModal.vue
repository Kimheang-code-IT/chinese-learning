// ...existing code...
<script setup lang="ts">
import { invoiceSchema, useAddModal } from '~/composables/useAddModal'

import InfoDialogTable from '../InfoDialogTable.vue'
import ConfirmDialog from '../ConfirmDialog.vue'
import InvoicePreview from '../InvoicePreview.vue'

const props = defineProps<{
  modelValue?: boolean
  itemToEdit?: unknown
  currentCount?: number
}>()

const emits = defineEmits<{
  add: [data: unknown]
  edit: [data: unknown]
  'update:modelValue': [val: boolean]
}>()

const {
  open,
  isEditing,
  isConfirmOpen,
  pendingData,
  showPassword,
  state,
  invoiceNo,
  todayDate,
  subtotal,
  discountAmount,
  grandTotal,
  cards,
  roles,
  paymentMethods,
  generatePassword,
  onSubmit,
  handleConfirm,
} = useAddModal(props, emits)
const activeTab = ref<'form' | 'preview'>('form')
// Dialog for showing phone and password
const showInfoDialog = ref(false)
function openInfoDialog() {
  showInfoDialog.value = true
}
</script>

<template>
  <div>
    <UButton v-if="!itemToEdit" label="ចុះឈ្មោះ" color="primary" icon="i-lucide-user-plus" @click="open = true" />

    <UModal v-model:open="open" fullscreen :title="isEditing ? 'កែប្រែទិន្នន័យ' : 'ការចុះឈ្មោះ'">
      <template #body>
        <!-- Tab Switcher (Mobile Only) -->
        <!-- Premium Segmented Tab Switcher (Mobile Only) -->
        <div class="lg:hidden flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-6 -mt-3 shadow-sm border border-default/50">
          <button
            class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg"
            :class="activeTab === 'form' 
              ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm ring-1 ring-black/5' 
              : 'text-muted hover:text-highlighted'"
            @click="activeTab = 'form'"
          >
            <UIcon name="i-lucide-file-text" class="size-4" />
            ទម្រង់ចុះឈ្មោះ
          </button>
          
          <button
            class="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold transition-all duration-300 rounded-lg"
            :class="activeTab === 'preview' 
              ? 'bg-white dark:bg-neutral-700 text-primary shadow-sm ring-1 ring-black/5' 
              : 'text-muted hover:text-highlighted'"
            @click="activeTab = 'preview'"
          >
            <UIcon name="i-lucide-invoice" class="size-4" />
            វិក្កយបត្រ (Preview)
          </button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 divide-x divide-default min-h-150 -m-4">
          <!-- Left: Registration Form -->
          <div class="px-4 sm:px-6 py-1 overflow-y-auto max-h-[85vh]" :class="{ 'hidden lg:block': activeTab !== 'form' }">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div class="text-lg sm:text-2xl font-bold text-highlighted flex items-center">
                <div class="bg-blue-700 rounded-lg p-1.5 mr-2 sm:mr-3 flex items-center justify-center text-white">
                  <UIcon :name="isEditing ? 'i-lucide-square-pen' : 'i-lucide-user-plus'" class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                {{ isEditing ? 'កែប្រែទិន្នន័យ' : 'ការចុះឈ្មោះ' }}
              </div>
            </div>
            <UForm :schema="invoiceSchema" :state="state" class="space-y-4 mb-16 lg:mb-4" @submit="onSubmit">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormField label="ឈ្មោះ" name="name" required>
                  <UInput v-model="state.name" placeholder="ឈ្មោះ" class="w-full" />
                </UFormField>
                <UFormField label="លេខទូរស័ព្ទ" name="phone" required>
                  <UInput v-model="state.phone" placeholder="លេខទូរស័ព្ទ" class="w-full" />
                </UFormField>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormField label="តួនាទី" name="role" required>
                  <USelect v-model="state.role" :items="roles" class="w-full" />
                </UFormField>
                <UFormField label="ពាក្យសម្ងាត់" name="password" required>
                  <UInput
v-model="state.password" :type="showPassword ? 'text' : 'password'" placeholder="ពាក្យសម្ងាត់"
                    class="w-full">
                    <template #trailing>
                      <div class="flex items-center gap-1">
                        <UButton
icon="i-lucide-refresh-cw" color="primary" variant="link" :padded="false"
                          @click="generatePassword" />
                        <UButton
:icon="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" color="primary" variant="link" :padded="false"
                          @click="showPassword = !showPassword" />
                      </div>
                    </template>
                  </UInput>
                </UFormField>
              </div>
              <commonCardSelectWithPrice
                v-model="state.selectedCards"
                :cards="cards"
                :card-data="state.cardData"
                @update:card-data="val => state.cardData = val"
              />

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <UFormField label="បញ្ចុះតម្លៃ (%)" name="discount" required>
                  <UInput v-model.number="state.discount" type="number" class="w-full">
                    <template #trailing>
                      <span class="text-toned">%</span>
                    </template>
                  </UInput>
                </UFormField>
                <UFormField label="វិធីសាស្ត្រទូទាត់" name="paymentMethod" required>
                  <USelect
v-model="state.paymentMethod" :items="paymentMethods" placeholder="ជ្រើសរើសវិធីសាស្ត្រទូទាត់"
                    class="w-full" />
                </UFormField>
              </div>

              <UFormField label="អាសយដ្ឋាន" name="address" required>
                <UTextarea v-model="state.address" placeholder="អាសយដ្ឋាន" class="w-full" :rows="2" />
              </UFormField>



              <div class="grid grid-cols-2 gap-2 pt-4 border-t border-default">
                <UButton label="បង្ហាញព័ត៌មាន" icon="i-lucide-info" color="neutral" variant="subtle" size="xl" class="justify-center" @click="openInfoDialog" />
                <UButton
                  :label="isEditing ? 'រក្សាទុក' : 'បង្កើត'"
                  color="primary"
                  type="submit"
                  size="xl"
                  class="justify-center"
                />
              </div>
            </UForm>
          </div>

          <InvoicePreview
            :show="activeTab === 'preview'"
            :invoice-no="invoiceNo"
            :today-date="todayDate"
            :payment-method="state.paymentMethod"
            :name="state.name"
            :phone="state.phone"
            :address="state.address"
            :selected-cards="state.selectedCards"
            :cards="cards"
            :card-data="state.cardData"
            :subtotal="subtotal"
            :discount="state.discount"
            :discount-amount="discountAmount"
            :grand-total="grandTotal"
          />
        </div>
      </template>
    </UModal>

    <!-- Confirmation Dialog -->
    <ConfirmDialog
      v-model="isConfirmOpen"
      :title="isEditing ? 'បញ្ជាក់ការកែប្រែ' : 'បញ្ជាក់ការរក្សាទុក'"
      :description="pendingData ? `តើអ្នកពិតជាចង់${isEditing ? 'កែប្រែ' : 'បញ្ចូល'}ទិន្នន័យសម្រាប់ ${pendingData.name} មែនទេ?` : ''"
      :confirm-label="isEditing ? 'បន្ទាន់សម័យ' : 'យល់ព្រម'"
      cancel-label="បោះបង់"
      @confirm="handleConfirm"
      @cancel="isConfirmOpen = false"
    />
    <!-- Info Dialog for phone and password -->
    <UModal v-model:open="showInfoDialog" title="ព័ត៌មានសម្រាប់ប្រើប្រាស់ វេបសាយ" :ui="{ content: 'sm:max-w-md' }">
      <template #body>
        <InfoDialogTable
          :name="state.name"
          :phone="state.phone"
          :password="state.password"
        />
      </template>
    </UModal>
  </div>
</template>

<style scoped>
@media print {

  /* Hide every part of the web page */
  :deep(body),
  :deep(html),
  #__nuxt,
  :deep(.u-modal-overlay),
  :deep(.u-modal-container) {
    background: white !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* Hide the entire modal UI except the invoice */
  :deep(.u-modal-content) {
    box-shadow: none !important;
    border: none !important;
  }

  /* Hide the left form column and modal close button/header */
  .lg\:grid-cols-2>div:first-child,
  .flex.items-center.justify-between.mb-2,
  :deep(.u-modal-header) {
    display: none !important;
  }

  /* Force the invoice to take over the whole page */
  #printable-invoice {
    display: block !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 210mm !important;
    height: auto !important;
    padding: 20mm !important;
    margin: 0 !important;
    z-index: 999999 !important;
    background: white !important;
    overflow: visible !important;
  }

  /* Ensure colors and backgrounds print correctly */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Hide unnecessary borders and lines */
  .divide-x {
    border: none !important;
  }
}
</style>
