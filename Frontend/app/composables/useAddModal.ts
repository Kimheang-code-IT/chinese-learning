import * as z from 'zod'
import { reactive, computed, watch, ref } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui'

export const invoiceSchema = z.object({
  name: z.string().min(2, 'សូមបញ្ចូលឈ្មោះឱ្យបានត្រឹមត្រូវ'),
  phone: z.string().min(8, 'សូមបញ្ចូលលេខទូរស័ព្ទឱ្យបានត្រឹមត្រូវ'),
  password: z.string().min(6, 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងហោចណាស់ ៦ ខ្ទង់'),
  role: z.string().min(1, 'សូមជ្រើសរើសតួនាទី'),
  discount: z.preprocess((val) => Number(val), z.number().min(0, 'មិនអាចតូចជាង ០').max(100, 'មិនអាចលើសពី ១០០')),
  selectedCards: z.array(z.string()).min(1, 'សូមជ្រើសរើសយ៉ាងហោចណាស់ផលិតផល ១'),
  paymentMethod: z.string().min(1, 'សូមជ្រើសរើសវិធីសាស្ត្រទូទាត់'),
  address: z.string().min(5, 'សូមបញ្ចូលអាសយដ្ឋានឱ្យបានត្រឹមត្រូវ')
})

export type NewUserForm = z.output<typeof invoiceSchema>

type UserWithPhoneLike = { phone?: string | null | undefined }
type EmitsLike =
  & ((evt: 'add', data: unknown) => void)
  & ((evt: 'edit', data: unknown) => void)
  & ((evt: 'update:modelValue', val: boolean) => void)

type ItemToEditLike = {
  id?: string | number
  date?: string
}

type PendingInvoiceData = {
  name: string
  phone: string
  password: string
  role: string
  book: string
  qty: number
  discount: number
  total: number
  payment: string
  address: string
  id?: string | number
  date: string
}

function asItemToEdit(value: unknown): ItemToEditLike | null {
  if (!value || typeof value !== 'object') return null
  const v = value as Record<string, unknown>
  const id = v.id
  const date = v.date
  return {
    id: (typeof id === 'string' || typeof id === 'number') ? id : undefined,
    date: typeof date === 'string' ? date : undefined
  }
}

function getErrorMessage(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'message' in error) {
    const msg = (error as { message?: unknown }).message
    return typeof msg === 'string' ? msg : undefined
  }
  return undefined
}

export function useAddModal(props: { modelValue?: boolean, itemToEdit?: unknown, currentCount?: number }, emits: EmitsLike) {
  const toast = useToast()
  
  const open = computed({
    get: () => props.modelValue ?? false,
    set: (val) => emits('update:modelValue', val)
  })

  const isEditing = computed(() => !!props.itemToEdit)
  const isConfirmOpen = ref(false)
  const pendingData = ref<PendingInvoiceData | null>(null)
  const showPassword = ref(false)

  const initialCardData = {
    '1': { price: 10, qty: 1 },
    '2': { price: 10, qty: 1 },
    '3': { price: 10, qty: 1 }
  }

  const state = reactive({
    name: '',
    phone: '',
    password: '',
    role: 'user',
    discount: 0,
    selectedCards: ['1'] as string[],
    cardData: JSON.parse(JSON.stringify(initialCardData)) as Record<string, { price: number, qty: number }>,
    paymentMethod: '',
    address: ''
  })

  const resetForm = () => {
    state.name = ''
    state.phone = ''
    state.password = ''
    state.role = 'user'
    state.discount = 0
    state.selectedCards = ['1']
    state.cardData = JSON.parse(JSON.stringify(initialCardData))
    state.paymentMethod = ''
    state.address = ''
    emits('update:modelValue', false)
  }

  watch(() => props.itemToEdit, (newItem) => {
    if (newItem && typeof newItem === 'object' && newItem !== null) {
      const item = newItem as Record<string, unknown>;
      state.name = typeof item.name === 'string' ? item.name : '';
      state.phone = typeof item.phone === 'string' ? item.phone : '';
      state.password = typeof item.password === 'string' ? item.password : '';
      state.role = typeof item.role === 'string' ? item.role : 'user';
      state.discount = typeof item.discount === 'number' ? item.discount : 0;
      state.paymentMethod = typeof item.paymentMethod === 'string' ? item.paymentMethod : '';
      state.address = typeof item.address === 'string' ? item.address : '';
      if (typeof item.book === 'string') {
        state.selectedCards = item.book.split(',').map((s: string) => s.trim());
        state.selectedCards.forEach((cardKey: string) => {
          if (state.cardData[cardKey]) {
            state.cardData[cardKey] = {
              price: typeof item.total === 'number' && typeof item.qty === 'number' && item.qty !== 0
                ? item.total / item.qty
                : 10,
              qty: typeof item.qty === 'number' && state.selectedCards.length !== 0
                ? item.qty / state.selectedCards.length
                : 1
            };
          }
        });
      }
    } else {
      resetForm();
    }
  }, { immediate: true });

  const invoiceNo = computed(() => {
    const item = asItemToEdit(props.itemToEdit)
    if (isEditing.value && item?.id != null) return String(item.id)
    const nextNum = (props.currentCount || 0) + 1
    return `INV-${nextNum.toString().padStart(3, '0')}`
  })

  const todayDate = computed(() => new Date().toLocaleDateString('en-GB'))

  const subtotal = computed(() => {
    return state.selectedCards.reduce((acc, val) => {
      const item = state.cardData[val]
      return acc + (item ? (item.price * item.qty) : 0)
    }, 0)
  })

  const discountAmount = computed(() => (subtotal.value * (state.discount || 0)) / 100)
  const grandTotal = computed(() => subtotal.value - discountAmount.value)

  const generatePassword = () => {
    state.password = Math.random().toString(36).slice(-8)
  }

  const onSubmit = async (_event: FormSubmitEvent<NewUserForm>) => {
    const totalQty = state.selectedCards.reduce((acc, val) => acc + (state.cardData[val]?.qty || 0), 0)

    const item = asItemToEdit(props.itemToEdit)
    const finalData = {
      name: state.name,
      phone: state.phone,
      password: state.password,
      role: state.role.toLowerCase(),
      book: state.selectedCards.join(', '),
      qty: totalQty,
      discount: state.discount,
      total: grandTotal.value,
      payment: state.paymentMethod,
      address: state.address,
      id: isEditing.value ? item?.id : undefined,
      date: (isEditing.value ? item?.date : undefined) || new Date().toISOString()
    }

    // Check for duplicate phone number before showing confirm dialog
    const usersApi = typeof useUsers === 'function' ? useUsers() : null
    let duplicate = false
    if (usersApi && !isEditing.value) {
      const users = await usersApi.getUsers()
      duplicate = users.some((u: unknown) => (u as UserWithPhoneLike | null)?.phone === finalData.phone)
    }
    if (duplicate) {
      toast.add({
        title: 'កំហុស',
        description: 'លេខទូរស័ព្ទនេះមានរួចហើយ។',
        color: 'error'
      })
      return
    }

    pendingData.value = finalData
    isConfirmOpen.value = true
  }

  const handleConfirm = async () => {
    if (!pendingData.value) return

    let success = false
    try {
      if (isEditing.value) {
        emits('edit', pendingData.value)
      } else {
        emits('add', pendingData.value)
      }
      success = true
    } catch (error: unknown) {
      toast.add({
        title: 'កំហុស',
        description: getErrorMessage(error) || 'មានបញ្ហាក្នុងការបញ្ចូល ឬ កែប្រែទិន្នន័យ',
        color: 'error'
      })
      success = false
    }

    if (success) {
      // Close both dialogs and reset
      isConfirmOpen.value = false
      open.value = false
      resetForm()
      pendingData.value = null
      // Ensure we are on the admin page to see the updated table
      await navigateTo('/admin')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const cards = [
    { label: 'សៀវភៅគំនូសអក្សរចិន ភាគ០១', value: '1' },
    { label: 'សៀវភៅគំនូសអក្សរចិន ភាគ០២', value: '2' },
    { label: 'សៀវភៅគំនូសអក្សរចិន ភាគ០៣', value: '3' }
  ]

  // Determine available roles based on current user and action
  // Assume you have a composable or store to get current user role
  let currentUserRole = ''
  try {
    // Try to get from useAuth composable if available
    const auth = typeof useAuth === 'function' ? useAuth() : null
    currentUserRole = auth?.user?.value?.role || ''
  } catch {
    currentUserRole = ''
  }

  const roles = computed(() => {
    // If employee and adding (not editing), only allow 'User'
    if (currentUserRole === 'employee' && !isEditing.value) {
      return [ { label: 'User', value: 'user' } ]
    }
    return [
      { label: 'User', value: 'user' },
      { label: 'Employee', value: 'employee' },
      { label: 'Admin', value: 'admin' }
    ]
  })

  const paymentMethods = [
    { label: 'ABA Bank', value: 'ABA' },
    { label: 'ACELDA', value: 'ACELDA' },
    { label: 'Wing', value: 'Wing' },
    { label: 'Cash', value: 'Cash' }
  ]

  // Example: Normalize name and phone on input
  // (If you need input normalization, call normalizeText at the input layer.)

  return {
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
    resetForm,
    onSubmit,
    handleConfirm,
    handlePrint
  }
}
