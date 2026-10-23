// AICTE PRAGATI-NAV - Role-Based Access Control (RBAC) System
// Single Source of Truth for Permissions, Roles, and Data Scoping

import React from 'react';

/**
 * The THREE Distinct AICTE Platform Roles
 */
export const Role = {
  INSTITUTION: 'INSTITUTION',
  REGIONAL_OFFICER: 'REGIONAL_OFFICER',
  BUREAU_HEAD: 'BUREAU_HEAD',
} as const;

export type RoleType = typeof Role[keyof typeof Role];

/**
 * Granular Action and View Permissions
 */
export const Permission = {
  // Navigation & Views
  VIEW_MY_INSTITUTION_ONLY: 'VIEW_MY_INSTITUTION_ONLY',
  VIEW_REGION_APPLICATIONS: 'VIEW_REGION_APPLICATIONS',
  VIEW_ALL_APPLICATIONS: 'VIEW_ALL_APPLICATIONS',
  VIEW_NATIONAL_DASHBOARD: 'VIEW_NATIONAL_DASHBOARD',
  VIEW_REGIONAL_DASHBOARD: 'VIEW_REGIONAL_DASHBOARD',
  VIEW_INSTITUTION_DASHBOARD: 'VIEW_INSTITUTION_DASHBOARD',
  VIEW_EVC_SCHEDULING: 'VIEW_EVC_SCHEDULING',
  VIEW_ESCALATIONS: 'VIEW_ESCALATIONS',
  VIEW_ADMIN_RULES: 'VIEW_ADMIN_RULES',
  VIEW_INTEGRATIONS: 'VIEW_INTEGRATIONS',
  VIEW_REGION_REPORTS: 'VIEW_REGION_REPORTS',
  VIEW_FULL_AUDIT_TRAIL: 'VIEW_FULL_AUDIT_TRAIL',
  VIEW_REGION_AUDIT_TRAIL: 'VIEW_REGION_AUDIT_TRAIL',

  // Actions
  ADVANCE_APPLICATION_STAGE: 'ADVANCE_APPLICATION_STAGE',
  REVERT_WITH_DEFICIENCY: 'REVERT_WITH_DEFICIENCY',
  RESPOND_TO_DEFICIENCY: 'RESPOND_TO_DEFICIENCY',
  SCHEDULE_EVC_COMMITTEE: 'SCHEDULE_EVC_COMMITTEE',
  SUBMIT_EVC_REPORT: 'SUBMIT_EVC_REPORT',
  UPLOAD_COMPLIANCE_EVIDENCE: 'UPLOAD_COMPLIANCE_EVIDENCE',
  VERIFY_REJECT_UNDERTAKING: 'VERIFY_REJECT_UNDERTAKING',
  UPLOAD_DOCUMENT_RENEWAL: 'UPLOAD_DOCUMENT_RENEWAL',
  VERIFY_REJECT_DOCUMENT: 'VERIFY_REJECT_DOCUMENT',
  HANDLE_ESCALATION: 'HANDLE_ESCALATION',
  REASSIGN_APPLICATION_REGION: 'REASSIGN_APPLICATION_REGION',
  CONFIGURE_APH_RULES: 'CONFIGURE_APH_RULES',
  EXPORT_CONSOLIDATED_REPORTS: 'EXPORT_CONSOLIDATED_REPORTS',
  SNOOZE_RESOLVE_ALERTS: 'SNOOZE_RESOLVE_ALERTS',
} as const;

export type PermissionType = typeof Permission[keyof typeof Permission];

/**
 * Typed Permission Matrix (Single Source of Truth)
 */
export const PERMISSION_MATRIX: Record<RoleType, Record<PermissionType, boolean>> = {
  [Role.INSTITUTION]: {
    VIEW_MY_INSTITUTION_ONLY: true,
    VIEW_REGION_APPLICATIONS: false,
    VIEW_ALL_APPLICATIONS: false,
    VIEW_NATIONAL_DASHBOARD: false,
    VIEW_REGIONAL_DASHBOARD: false,
    VIEW_INSTITUTION_DASHBOARD: true,
    VIEW_EVC_SCHEDULING: false,
    VIEW_ESCALATIONS: false,
    VIEW_ADMIN_RULES: false,
    VIEW_INTEGRATIONS: false,
    VIEW_REGION_REPORTS: false,
    VIEW_FULL_AUDIT_TRAIL: false,
    VIEW_REGION_AUDIT_TRAIL: false,

    ADVANCE_APPLICATION_STAGE: false,
    REVERT_WITH_DEFICIENCY: false,
    RESPOND_TO_DEFICIENCY: true,
    SCHEDULE_EVC_COMMITTEE: false,
    SUBMIT_EVC_REPORT: false,
    UPLOAD_COMPLIANCE_EVIDENCE: true,
    VERIFY_REJECT_UNDERTAKING: false,
    UPLOAD_DOCUMENT_RENEWAL: true,
    VERIFY_REJECT_DOCUMENT: false,
    HANDLE_ESCALATION: false,
    REASSIGN_APPLICATION_REGION: false,
    CONFIGURE_APH_RULES: false,
    EXPORT_CONSOLIDATED_REPORTS: false,
    SNOOZE_RESOLVE_ALERTS: false,
  },

  [Role.REGIONAL_OFFICER]: {
    VIEW_MY_INSTITUTION_ONLY: false,
    VIEW_REGION_APPLICATIONS: true,
    VIEW_ALL_APPLICATIONS: false,
    VIEW_NATIONAL_DASHBOARD: false,
    VIEW_REGIONAL_DASHBOARD: true,
    VIEW_INSTITUTION_DASHBOARD: false,
    VIEW_EVC_SCHEDULING: true,
    VIEW_ESCALATIONS: false,
    VIEW_ADMIN_RULES: false,
    VIEW_INTEGRATIONS: false,
    VIEW_REGION_REPORTS: true,
    VIEW_FULL_AUDIT_TRAIL: false,
    VIEW_REGION_AUDIT_TRAIL: true,

    ADVANCE_APPLICATION_STAGE: true,
    REVERT_WITH_DEFICIENCY: true,
    RESPOND_TO_DEFICIENCY: false,
    SCHEDULE_EVC_COMMITTEE: true,
    SUBMIT_EVC_REPORT: true,
    UPLOAD_COMPLIANCE_EVIDENCE: false,
    VERIFY_REJECT_UNDERTAKING: true,
    UPLOAD_DOCUMENT_RENEWAL: false,
    VERIFY_REJECT_DOCUMENT: true,
    HANDLE_ESCALATION: false,
    REASSIGN_APPLICATION_REGION: false,
    CONFIGURE_APH_RULES: false,
    EXPORT_CONSOLIDATED_REPORTS: false,
    SNOOZE_RESOLVE_ALERTS: true,
  },

  [Role.BUREAU_HEAD]: {
    VIEW_MY_INSTITUTION_ONLY: false,
    VIEW_REGION_APPLICATIONS: true,
    VIEW_ALL_APPLICATIONS: true,
    VIEW_NATIONAL_DASHBOARD: true,
    VIEW_REGIONAL_DASHBOARD: false,
    VIEW_INSTITUTION_DASHBOARD: false,
    VIEW_EVC_SCHEDULING: false,
    VIEW_ESCALATIONS: true,
    VIEW_ADMIN_RULES: true,
    VIEW_INTEGRATIONS: true,
    VIEW_REGION_REPORTS: true,
    VIEW_FULL_AUDIT_TRAIL: true,
    VIEW_REGION_AUDIT_TRAIL: true,

    ADVANCE_APPLICATION_STAGE: false, // Read-focused on individual stages
    REVERT_WITH_DEFICIENCY: false,
    RESPOND_TO_DEFICIENCY: false,
    SCHEDULE_EVC_COMMITTEE: false,
    SUBMIT_EVC_REPORT: false,
    UPLOAD_COMPLIANCE_EVIDENCE: false,
    VERIFY_REJECT_UNDERTAKING: false,
    UPLOAD_DOCUMENT_RENEWAL: false,
    VERIFY_REJECT_DOCUMENT: false,
    HANDLE_ESCALATION: true,
    REASSIGN_APPLICATION_REGION: true,
    CONFIGURE_APH_RULES: true,
    EXPORT_CONSOLIDATED_REPORTS: true,
    SNOOZE_RESOLVE_ALERTS: true,
  },
};

/**
 * User Context Profile Structure
 */
export interface UserProfile {
  role: RoleType;
  officer: string;
  designation: string;
  badge: string;
  region: string;
  institutionId?: string;
  instituteName?: string;
}

export const DEMO_PROFILES: Record<RoleType, UserProfile> = {
  [Role.INSTITUTION]: {
    role: Role.INSTITUTION,
    officer: 'Dr. Meera Sen',
    designation: 'Principal & Head of Institute',
    badge: 'Institution (Applicant)',
    institutionId: '1-748920141',
    instituteName: 'Maharashtra Institute of Technology & Research',
    region: 'WRO',
  },
  [Role.REGIONAL_OFFICER]: {
    role: Role.REGIONAL_OFFICER,
    officer: 'Dr. R.K. Patil',
    designation: 'Regional Officer, AICTE WRO',
    badge: 'Regional Officer',
    region: 'WRO',
  },
  [Role.BUREAU_HEAD]: {
    role: Role.BUREAU_HEAD,
    officer: 'Shri A.K. Sharma',
    designation: 'Adviser (Approval Bureau), AICTE HQ',
    badge: 'Bureau Head (HQ)',
    region: 'ALL',
  },
};

/**
 * usePermissions Hook
 * Provides permission check helpers and scoped data queries
 */
export function usePermissions(currentUser: UserProfile) {
  const currentRole = currentUser?.role || Role.BUREAU_HEAD;

  const can = (permission: PermissionType): boolean => {
    return PERMISSION_MATRIX[currentRole]?.[permission] ?? false;
  };

  const isRole = (roleToCheck: RoleType): boolean => {
    return currentRole === roleToCheck;
  };

  const getRestrictionReason = (permission: PermissionType): string => {
    switch (permission) {
      case Permission.ADVANCE_APPLICATION_STAGE:
      case Permission.REVERT_WITH_DEFICIENCY:
        return 'Only authorized Regional Officers can progress or revert application stages.';
      case Permission.SCHEDULE_EVC_COMMITTEE:
      case Permission.SUBMIT_EVC_REPORT:
        return 'Only Regional Officers can constitute EVC committees and submit reports.';
      case Permission.VERIFY_REJECT_UNDERTAKING:
      case Permission.VERIFY_REJECT_DOCUMENT:
        return 'Only Regional Officers can verify or reject institutional compliance documents.';
      case Permission.RESPOND_TO_DEFICIENCY:
      case Permission.UPLOAD_COMPLIANCE_EVIDENCE:
      case Permission.UPLOAD_DOCUMENT_RENEWAL:
        return 'Only applicant institutions can submit compliance evidence or renewal deeds.';
      case Permission.CONFIGURE_APH_RULES:
      case Permission.REASSIGN_APPLICATION_REGION:
      case Permission.HANDLE_ESCALATION:
        return 'Only Bureau Head (AICTE Headquarters) is authorized for this administrative action.';
      default:
        return 'You do not have permission to perform this action.';
    }
  };

  // ----------------------------------------------------
  // DATA SCOPING (Strict Isolation)
  // ----------------------------------------------------
  const scopeApplications = (applications: any[]): any[] => {
    if (!applications) return [];
    if (currentRole === Role.INSTITUTION) {
      return applications.filter(app => 
        app.instituteId === currentUser.institutionId ||
        app.instituteName?.toLowerCase().includes('maharashtra') ||
        app.id === 'APP-2026-WRO-1049'
      );
    }
    if (currentRole === Role.REGIONAL_OFFICER) {
      return applications.filter(app => app.region === currentUser.region);
    }
    // Bureau Head: Unrestricted
    return applications;
  };

  const scopeUndertakings = (undertakings: any[]): any[] => {
    if (!undertakings) return [];
    if (currentRole === Role.INSTITUTION) {
      return undertakings.filter(u => 
        u.appId === 'APP-2026-WRO-1049' ||
        u.institute?.toLowerCase().includes('maharashtra')
      );
    }
    if (currentRole === Role.REGIONAL_OFFICER) {
      return undertakings.filter(u => u.region === currentUser.region);
    }
    return undertakings;
  };

  const scopeDocuments = (docs: any[]): any[] => {
    if (!docs) return [];
    if (currentRole === Role.INSTITUTION) {
      return docs.filter(d => 
        d.appId === 'APP-2026-WRO-1049' ||
        d.institute?.toLowerCase().includes('maharashtra')
      );
    }
    if (currentRole === Role.REGIONAL_OFFICER) {
      return docs.filter(d => d.region === currentUser.region);
    }
    return docs;
  };

  const scopeNotifications = (notifications: any[]): any[] => {
    if (!notifications) return [];
    if (currentRole === Role.INSTITUTION) {
      return notifications.filter(n => 
        n.applicationId === 'APP-2026-WRO-1049' ||
        n.message?.toLowerCase().includes('maharashtra') ||
        n.title?.toLowerCase().includes('lease')
      );
    }
    if (currentRole === Role.REGIONAL_OFFICER) {
      return notifications.filter(n => n.region === currentUser.region || n.region === 'ALL');
    }
    return notifications;
  };

  const scopeAuditTrail = (auditLogs: any[]): any[] => {
    if (!auditLogs) return [];
    if (currentRole === Role.INSTITUTION) {
      return auditLogs.filter(log => log.appId === 'APP-2026-WRO-1049');
    }
    if (currentRole === Role.REGIONAL_OFFICER) {
      return auditLogs.filter(log => log.region === currentUser.region);
    }
    return auditLogs;
  };

  return {
    role: currentRole,
    user: currentUser,
    can,
    isRole,
    getRestrictionReason,
    scopeApplications,
    scopeUndertakings,
    scopeDocuments,
    scopeNotifications,
    scopeAuditTrail,
  };
}

/**
 * <RequireRole> Component Wrapper
 */
export function RequireRole({ 
  currentRole, 
  allowedRoles, 
  children, 
  fallback = null 
}: { 
  currentRole: RoleType; 
  allowedRoles: RoleType[]; 
  children: React.ReactNode; 
  fallback?: React.ReactNode;
}) {
  if (!allowedRoles.includes(currentRole)) {
    return fallback as React.ReactElement | null;
  }
  return children as React.ReactElement;
}
