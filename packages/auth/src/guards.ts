import type { ClinicalRole, AdminRole, AppRole } from './types'

// Check if user has any of the specified roles
export function hasRole(userRole: AppRole, allowedRoles: AppRole[]): boolean {
  return allowedRoles.includes(userRole)
}

// Check if user is a clinical staff member
export function isClinicalStaff(role: AppRole): role is ClinicalRole {
  const clinicalRoles: ClinicalRole[] = [
    'doctor',
    'nurse',
    'dietician',
    'physiotherapist',
    'psychologist',
    'lab_technician',
  ]
  return clinicalRoles.includes(role as ClinicalRole)
}

// Check if user is an admin staff member
export function isAdminStaff(role: AppRole): role is AdminRole {
  const adminRoles: AdminRole[] = ['staff_manager', 'business_dev', 'clinic_director']
  return adminRoles.includes(role as AdminRole)
}

// Check if user is a patient
export function isPatient(role: AppRole): boolean {
  return role === 'patient'
}

// Permission checks for specific actions
export const permissions = {
  // Clinical permissions
  canViewPatients: (role: AppRole) => isClinicalStaff(role),
  canWriteNotes: (role: AppRole) => hasRole(role, ['doctor', 'nurse', 'psychologist']),
  canReviewResults: (role: AppRole) => isClinicalStaff(role),
  canApproveInsights: (role: AppRole) => hasRole(role, ['doctor']),
  canConfigureLabTests: (role: AppRole) => hasRole(role, ['doctor', 'lab_technician']),

  // Admin permissions
  canManageProducts: (role: AppRole) => hasRole(role, ['business_dev', 'clinic_director']),
  canManageStaff: (role: AppRole) => hasRole(role, ['staff_manager', 'clinic_director']),
  canManageSchedules: (role: AppRole) => isAdminStaff(role),
  canViewReports: (role: AppRole) => isAdminStaff(role),
}
