export interface Range {
  start: Date
  end: Date
}

export interface ColumnLike {
  id: string
  getCanHide: () => boolean
  getIsVisible: () => boolean
}

export interface TableApiLike {
  getAllColumns: () => ColumnLike[]
  getColumn: (id: string) => { toggleVisibility: (visible: boolean) => void } | undefined
}

export interface AdminRow {
    id: string | number
    name: string
    phone: string
    password?: string
    email?: string
    role: string
    book: string
    qty: number
    discount: number
    price: number
    paymentMethod: string
    created: string
    date?: string
    items?: unknown[]
}
