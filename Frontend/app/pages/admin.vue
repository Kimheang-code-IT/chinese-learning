<script setup lang="ts">
import { h } from 'vue'
import { UButton, UBadge, UTooltip, UKbd } from '#components'
import type { AdminRow } from '~/types'
import type { CreateUserPayload, UpdateUserPayload } from '~/types/user'

definePageMeta({
    middleware: ['auth', 'role'],
    roles: ['admin', 'employee']
})

useSeoMeta({
    title: 'គ្រប់គ្រង',
    description: 'ទំព័រគ្រប់គ្រងទិន្នន័យ (Admin Page)'
})

const {
    search,
    status,
    dateRange,
    isUpdateDialogOpen,
    isDeleteDialogOpen,
    selectedRow,
    loading,
    data,
    filteredData,
    onAddUser,
    onUpdateUser,
    onDeleteUser
} = useAdminData()

const table = useTemplateRef('table')

// Columns Configuration
const columns = [
    { accessorKey: 'id', header: 'ID', class: 'w-[80px]' },
    { accessorKey: 'name', header: 'Name',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          return h('div', { class: 'font-bold text-highlighted truncate max-w-[120px]' }, row.original.name)
      }
    },
    { accessorKey: 'phone', header: 'Phone', class: 'hidden sm:table-cell' },
    { accessorKey: 'role', header: 'Role', class: 'hidden md:table-cell',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          const isAdmin = row.original.role.toLowerCase() === 'admin'
          return h(UBadge, {
              color: isAdmin ? 'primary' : 'neutral',
              variant: 'subtle',
              class: 'capitalize text-[10px] font-semibold px-2'
          }, () => row.original.role)
      }
    },
    { accessorKey: 'book', header: 'Book', class: 'hidden sm:table-cell',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          const books = row.original.book.split(', ')
          return h('div', { class: 'flex gap-1' }, books.map(b => {
              const num = b.includes('1') || b.includes('១') ? '1' : b.includes('2') || b.includes('២') ? '2' : '3'
              return h(UKbd, {
                  size: 'sm',
                  variant: 'subtle',
                  class: 'rounded-md w-5 h-5 flex items-center justify-center p-0 font-black'
              }, () => num)
          }))
      }
    },
    { accessorKey: 'qty', header: 'Qty', class: 'hidden md:table-cell',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          return h('span', { class: 'text-error font-medium' }, row.original.qty)
      }
    },
    { accessorKey: 'discount', header: 'Discount', class: 'hidden xl:table-cell',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          return h('span', { class: 'text-emerald-600 font-medium' }, `${row.original.discount}%`)
      }
    },
    { accessorKey: 'price', header: 'Total',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          return h('span', { class: 'text-amber-600 font-black' }, `$${row.original.price.toFixed(2)}`)
      }
    },
    { accessorKey: 'paymentMethod', header: 'Payment', class: 'hidden sm:table-cell',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          const method = row.original.paymentMethod || 'Cash'
          const color = method === 'ABA' ? 'primary' : method === 'Cash' ? 'neutral' : 'info'
          return h(UBadge, { color, variant: 'subtle', class: 'text-[10px] font-bold uppercase' }, () => method)
      }
    },
    { 
      accessorKey: 'created', 
      header: 'Date', 
      class: 'hidden lg:table-cell',
      cell: ({ row }: { row: { original: AdminRow } }) => {
          const date = new Date(row.original.created)
          return h('span', { class: 'text-muted text-[11px]' }, 
              new Intl.DateTimeFormat('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false
              }).format(date).replace(',', '')
          )
      }
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: { original: AdminRow } }) => {
            return h('div', { class: 'flex justify-end items-center gap-1' }, [
                h(UTooltip, { text: 'Update Record', content: { side: 'top' } }, () =>
                    h(UButton, {
                        icon: 'i-lucide-square-pen',
                        color: 'neutral',
                        variant: 'ghost',
                        'aria-label': 'Update',
                        onClick: () => {
                            selectedRow.value = { ...row.original }
                            isUpdateDialogOpen.value = true
                        }
                    })
                ),
                h(UTooltip, { text: 'Delete Record', content: { side: 'top' } }, () =>
                    h(UButton, {
                        icon: 'i-lucide-trash',
                        color: 'error',
                        variant: 'ghost',
                        'aria-label': 'Delete',
                        onClick: () => {
                            selectedRow.value = row.original
                            isDeleteDialogOpen.value = true
                        }
                    })
                )
            ])
        }
    }
]
</script>

<template>
    <div class="h-[calc(100vh-var(--ui-header-height))] flex flex-col overflow-hidden p-2 sm:p-4 gap-4">
        <div class="flex flex-col gap-4 shrink-0 bg-surface p-2 sm:p-0 rounded-lg sm:bg-transparent">
            <CommonToolbar 
                v-model:search="search" 
                v-model:status="status" 
                v-model:date-range="dateRange"
            >
                <template #actions>
                    <!-- Consolidated Add/Edit Modal -->
                    <CommonAddModal 
                        :model-value="isUpdateDialogOpen" 
                        :item-to-edit="selectedRow"
                        :current-count="data.length"
                        class="w-auto"
                        @update:model-value="(val: boolean) => { isUpdateDialogOpen = val; if(!val) selectedRow = null }"
                        @add="(data: unknown) => onAddUser(data as CreateUserPayload)"
                        @edit="(data: unknown) => onUpdateUser(data as UpdateUserPayload)"
                    />
                </template>
            </CommonToolbar>
        </div>

        <div class="min-h-0 flex-1 rounded-lg border border-default flex flex-col overflow-hidden">
            <CommonDataTable ref="table" :data="filteredData" :columns="columns" :loading="loading" class="flex-1" />
        </div>

        <CommonDeleteModal 
            :is-open="isDeleteDialogOpen" 
            :user="selectedRow" 
            @delete="onDeleteUser"
            @close="isDeleteDialogOpen = false" 
        />
    </div>
</template>