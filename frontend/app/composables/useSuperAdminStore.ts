import { ref, computed } from 'vue'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tenant {
  id: number
  name: string
  owner: string
  email: string
  phone: string
  plan: 'starter' | 'business' | 'enterprise'
  status: 'active' | 'suspended' | 'trial'
  revenue: number
  orders: number
  products: number
  admins: number
  joinDate: string
  lastActive: string
  storeLogo: string
}

export interface AdminUser {
  id: number
  name: string
  email: string
  tenantId: number
  tenantName: string
  role: 'admin' | 'superadmin'
  status: 'active' | 'suspended'
  lastLogin: string
  createdAt: string
}

export interface SystemLog {
  id: number
  action: string
  user: string
  tenant: string
  timestamp: string
  type: 'info' | 'warning' | 'error' | 'success'
}

export interface TenantForm {
  name: string
  owner: string
  email: string
  phone: string
  plan: Tenant['plan']
}

// ─── Helpers (exported) ───────────────────────────────────────────────────────

export const formatCurrency = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n)

export const PLAN_CONFIG: Record<Tenant['plan'], { label: string; color: string }> = {
  starter:    { label: 'Starter',    color: 'bg-gray-100 text-gray-600 border-gray-200' },
  business:   { label: 'Business',   color: 'bg-blue-50 text-blue-600 border-blue-200' },
  enterprise: { label: 'Enterprise', color: 'bg-violet-50 text-violet-600 border-violet-200' },
}

export const TENANT_STATUS: Record<Tenant['status'], { label: string; color: string }> = {
  active:    { label: 'Aktif',     color: 'bg-emerald-50 text-emerald-700' },
  suspended: { label: 'Suspended', color: 'bg-red-50 text-red-700' },
  trial:     { label: 'Trial',     color: 'bg-amber-50 text-amber-700' },
}

export const LOG_TYPE: Record<SystemLog['type'], { dot: string }> = {
  info:    { dot: 'bg-blue-400' },
  warning: { dot: 'bg-amber-400' },
  error:   { dot: 'bg-red-500' },
  success: { dot: 'bg-emerald-500' },
}

// ─── Singleton State ──────────────────────────────────────────────────────────

const _tenants = ref<Tenant[]>([
  { id: 1, name: 'Berkah Keramik',    owner: 'Budi Hartono',    email: 'admin@berkahkeramik.com',    phone: '0812-3456-7890', plan: 'enterprise', status: 'active',    revenue: 145_000_000, orders: 342, products: 128, admins: 5, joinDate: '2025-01-15', lastActive: '2026-03-04', storeLogo: 'BK' },
  { id: 2, name: 'Maju Keramik Jaya', owner: 'Siti Nurhaliza',  email: 'admin@majukeramik.com',      phone: '0813-4567-8901', plan: 'business',   status: 'active',    revenue: 87_500_000,  orders: 198, products: 64,  admins: 3, joinDate: '2025-03-20', lastActive: '2026-03-03', storeLogo: 'MK' },
  { id: 3, name: 'Prima Tile Store',  owner: 'Ahmad Wahyudi',   email: 'admin@primatile.com',        phone: '0814-5678-9012', plan: 'starter',    status: 'trial',     revenue: 12_300_000,  orders: 45,  products: 22,  admins: 1, joinDate: '2026-02-01', lastActive: '2026-03-04', storeLogo: 'PT' },
  { id: 4, name: 'Indah Keramik',     owner: 'Dewi Kusuma',     email: 'admin@indahkeramik.com',     phone: '0815-6789-0123', plan: 'business',   status: 'suspended', revenue: 54_200_000,  orders: 156, products: 89,  admins: 2, joinDate: '2024-08-10', lastActive: '2026-01-15', storeLogo: 'IK' },
  { id: 5, name: 'Sejahtera Tiles',   owner: 'Eko Santoso',     email: 'admin@sejahteratiles.com',   phone: '0816-7890-1234', plan: 'enterprise', status: 'active',    revenue: 198_000_000, orders: 512, products: 215, admins: 8, joinDate: '2024-05-01', lastActive: '2026-03-04', storeLogo: 'ST' },
])

const _adminUsers = ref<AdminUser[]>([
  { id: 1, name: 'Admin Berkah',       email: 'admin@berkahkeramik.com',  tenantId: 1, tenantName: 'Berkah Keramik',    role: 'admin',      status: 'active',    lastLogin: '2026-03-04 10:23', createdAt: '2025-01-15' },
  { id: 2, name: 'Admin Maju',         email: 'admin@majukeramik.com',    tenantId: 2, tenantName: 'Maju Keramik Jaya', role: 'admin',      status: 'active',    lastLogin: '2026-03-03 15:41', createdAt: '2025-03-20' },
  { id: 3, name: 'Admin Prima',        email: 'admin@primatile.com',      tenantId: 3, tenantName: 'Prima Tile Store',  role: 'admin',      status: 'active',    lastLogin: '2026-03-04 09:05', createdAt: '2026-02-01' },
  { id: 4, name: 'Admin Indah',        email: 'admin@indahkeramik.com',   tenantId: 4, tenantName: 'Indah Keramik',     role: 'admin',      status: 'suspended', lastLogin: '2026-01-15 12:00', createdAt: '2024-08-10' },
  { id: 5, name: 'Rizky Manager',      email: 'rizky@sejahteratiles.com', tenantId: 5, tenantName: 'Sejahtera Tiles',   role: 'admin',      status: 'active',    lastLogin: '2026-03-04 11:30', createdAt: '2024-05-01' },
  { id: 6, name: 'Super Administrator',email: 'superadmin@system.com',    tenantId: 0, tenantName: 'System',            role: 'superadmin', status: 'active',    lastLogin: '2026-03-04 08:00', createdAt: '2024-01-01' },
])

const _logs = ref<SystemLog[]>([
  { id: 1, action: 'Tenant baru didaftarkan: Prima Tile Store',    user: 'superadmin@system.com',   tenant: 'System',           timestamp: '2026-03-04 08:30', type: 'success' },
  { id: 2, action: 'Admin Indah Keramik di-suspend',               user: 'superadmin@system.com',   tenant: 'Indah Keramik',    timestamp: '2026-03-04 08:25', type: 'warning' },
  { id: 3, action: 'Login gagal 3x berturut-turut',                user: 'unknown@email.com',       tenant: 'Berkah Keramik',   timestamp: '2026-03-04 07:55', type: 'error'   },
  { id: 4, action: 'Upgrade plan: Berkah Keramik → Enterprise',    user: 'superadmin@system.com',   tenant: 'Berkah Keramik',   timestamp: '2026-03-03 16:10', type: 'success' },
  { id: 5, action: 'Backup database selesai',                      user: 'System Auto',             tenant: 'System',           timestamp: '2026-03-03 02:00', type: 'info'    },
  { id: 6, action: 'Sejahtera Tiles menambah 12 produk baru',      user: 'admin@sejahteratiles.com',tenant: 'Sejahtera Tiles',  timestamp: '2026-03-02 14:22', type: 'info'    },
])

const _maintenanceMode = ref(false)
const _autoBackup      = ref(true)
const _emailNotif      = ref(true)

// ─── Composable ───────────────────────────────────────────────────────────────

export function useSuperAdminStore() {
  // Stats
  const totalRevenue  = computed(() => _tenants.value.reduce((s, t) => s + t.revenue, 0))
  const activeTenants = computed(() => _tenants.value.filter(t => t.status === 'active').length)
  const totalOrders   = computed(() => _tenants.value.reduce((s, t) => s + t.orders, 0))
  const totalProducts = computed(() => _tenants.value.reduce((s, t) => s + t.products, 0))
  const trialCount    = computed(() => _tenants.value.filter(t => t.status === 'trial').length)

  // Tenant actions
  function toggleTenantStatus(id: number) {
    const t = _tenants.value.find(t => t.id === id)
    if (t) t.status = t.status === 'active' ? 'suspended' : 'active'
  }

  function deleteTenant(id: number) {
    _tenants.value = _tenants.value.filter(t => t.id !== id)
  }

  function saveTenant(form: TenantForm, editingId: number | null) {
    if (!form.name || !form.email) return
    if (editingId !== null) {
      const idx = _tenants.value.findIndex(t => t.id === editingId)
      if (idx !== -1) _tenants.value[idx] = { ..._tenants.value[idx], ...form }
    } else {
      const newId = Math.max(..._tenants.value.map(t => t.id)) + 1
      _tenants.value.push({
        id: newId,
        ...form,
        status: 'trial',
        revenue: 0, orders: 0, products: 0, admins: 1,
        joinDate: new Date().toISOString().split('T')[0],
        lastActive: new Date().toISOString().split('T')[0],
        storeLogo: form.name.slice(0, 2).toUpperCase(),
      })
    }
  }

  function upgradePlan(tenantId: number, plan: Tenant['plan']) {
    const t = _tenants.value.find(t => t.id === tenantId)
    if (t) t.plan = plan
  }

  // User actions
  function toggleUserStatus(id: number) {
    const u = _adminUsers.value.find(u => u.id === id)
    if (u) u.status = u.status === 'active' ? 'suspended' : 'active'
  }

  return {
    tenants: _tenants,
    adminUsers: _adminUsers,
    logs: _logs,
    maintenanceMode: _maintenanceMode,
    autoBackup: _autoBackup,
    emailNotif: _emailNotif,
    totalRevenue,
    activeTenants,
    totalOrders,
    totalProducts,
    trialCount,
    toggleTenantStatus,
    deleteTenant,
    saveTenant,
    upgradePlan,
    toggleUserStatus,
  }
}
