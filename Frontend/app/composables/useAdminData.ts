import { ref, computed, onMounted } from 'vue'
import type { AdminRow, Range } from '~/types'
import { useUsers } from './useUsers'
import type { CreateUserPayload, UpdateUserPayload } from '~/types/user'

type BackendUserLike = Record<string, unknown> & {
    id?: string | number
    name?: unknown
    phone?: unknown
    role?: unknown
    book?: unknown
    qty?: unknown
    discount?: unknown
    total?: unknown
    payment?: unknown
    address?: unknown
    date?: unknown
    created_at?: unknown
}

function asString(value: unknown, fallback = ''): string {
    return typeof value === 'string' ? value : fallback
}

export function useAdminData() {
    // Shared State
    const search = ref('')
    const status = ref('all')
    const startDefault = new Date()
    startDefault.setDate(startDefault.getDate() - 30)
    const dateRange = ref<Range>({ start: startDefault, end: new Date() })
    const isUpdateDialogOpen = ref(false)
    const isDeleteDialogOpen = ref(false)
    const selectedRow = ref<AdminRow | null>(null)
    const loading = ref(false)

    const usersApi = useUsers()
    const data = ref<AdminRow[]>([])

    // Filter Logic
    const filteredData = computed(() => {
        return data.value.filter((row) => {
            // 1. Search Filter (by Name, ID, or Phone)
            const matchesSearch = !search.value || 
                row.name.toLowerCase().includes(search.value.toLowerCase()) ||
                row.id.toString().toLowerCase().includes(search.value.toLowerCase()) ||
                row.phone.toLowerCase().includes(search.value.toLowerCase())
                
            // 2. Status/Role Filter
            const matchesStatus = status.value === 'all' || row.role.toLowerCase() === status.value.toLowerCase()

            // 3. Date Range Filter
            let matchesDate = true
            if (dateRange.value?.start && dateRange.value?.end) {
                const rowDate = new Date(row.created || row.date || '')
                const start = new Date(dateRange.value.start)
                const end = new Date(dateRange.value.end)
                
                start.setHours(0, 0, 0, 0)
                end.setHours(23, 59, 59, 999)
                
                matchesDate = rowDate >= start && rowDate <= end
            }

            return matchesSearch && matchesStatus && (matchesDate || !dateRange.value)
        })
    })

    // Actions
    async function fetchData() {
        loading.value = true
        try {
            const response = await usersApi.getUsers()
            // Map backend fields to frontend expected fields with safe defaults
            data.value = response.map((u: unknown) => {
                const user = (u ?? {}) as BackendUserLike
                return {
                    ...user,
                    id: user.id ?? '',
                    name: asString(user.name, 'No Name') || 'No Name',
                    phone: asString(user.phone, ''),
                    role: asString(user.role, 'user') || 'user',
                    book: asString(user.book, ''),
                    qty: Number(user.qty) || 0,
                    discount: Number(user.discount) || 0,
                    price: Number(user.total) || 0,
                    paymentMethod: asString(user.payment, 'Cash') || 'Cash',
                    address: asString(user.address, ''),
                    created: asString(user.date, '') || asString(user.created_at, '') || new Date().toISOString()
                } as AdminRow
            })
        } catch (error) {
            console.error('Failed to fetch admin data:', error)
        } finally {
            loading.value = false
        }
    }

    async function onAddUser(newUser: CreateUserPayload) {
        const toast = useToast()
        loading.value = true
        try {
            await usersApi.createUser(newUser)
            toast.add({ title: 'ជោគជ័យ', description: 'បានបញ្ចូលទិន្នន័យដោយជោគជ័យ', color: 'success' })
            await fetchData()
            isUpdateDialogOpen.value = false
        } catch (error: unknown) {
            const detail = (error && typeof error === 'object' && 'data' in error)
                ? (error as { data?: { detail?: unknown } }).data?.detail
                : undefined
            toast.add({ 
                title: 'កំហុស', 
                description: (typeof detail === 'string' && detail) ? detail : 'មិនអាចបញ្ចូលទិន្នន័យបានទេ', 
                color: 'error' 
            })
        } finally {
            loading.value = false
        }
    }

    async function onUpdateUser(updatedUser: UpdateUserPayload) {
        const toast = useToast()
        if (!selectedRow.value) return
        
        loading.value = true
        try {
            await usersApi.updateUser(Number(selectedRow.value.id), updatedUser)
            toast.add({ title: 'ជោគជ័យ', description: 'បានកែប្រែទិន្នន័យដោយជោគជ័យ', color: 'success' })
            isUpdateDialogOpen.value = false
            selectedRow.value = null
            await fetchData()
        } catch (error: unknown) {
            const detail = (error && typeof error === 'object' && 'data' in error)
                ? (error as { data?: { detail?: unknown } }).data?.detail
                : undefined
            toast.add({ 
                title: 'កំហុស', 
                description: (typeof detail === 'string' && detail) ? detail : 'មិនអាចកែប្រែទិន្នន័យបានទេ', 
                color: 'error' 
            })
        } finally {
            loading.value = false
        }
    }

    async function onDeleteUser() {
        if (!selectedRow.value) return
        const toast = useToast()
        
        loading.value = true
        try {
            await usersApi.deleteUser(Number(selectedRow.value.id))
            toast.add({ title: 'ជោគជ័យ', description: 'បានលុបទិន្នន័យដោយជោគជ័យ', color: 'success' })
            isDeleteDialogOpen.value = false
            selectedRow.value = null
            await fetchData()
        } catch (error: unknown) {
            const detail = (error && typeof error === 'object' && 'data' in error)
                ? (error as { data?: { detail?: unknown } }).data?.detail
                : undefined
            toast.add({ 
                title: 'កំហុស', 
                description: (typeof detail === 'string' && detail) ? detail : 'មិនអាចលុបទិន្នន័យបានទេ', 
                color: 'error' 
            })
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        fetchData()
    })

    return {
        // States
        search,
        status,
        dateRange,
        isUpdateDialogOpen,
        isDeleteDialogOpen,
        selectedRow,
        loading,
        data,
        filteredData,

        // Actions
        fetchData,
        onAddUser,
        onUpdateUser,
        onDeleteUser
    }
}
