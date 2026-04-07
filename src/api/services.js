/**
 * ============================================================
 * PLACEMENT MANAGEMENT SYSTEM — REST API SERVICES
 * Base URL: http://localhost:8080/api
 * All endpoints match the Spring Boot backend exactly.
 * ============================================================
 */

import api from './axios'

// ============================================================
// AUTH SERVICE
// ============================================================
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  verifyEmail: (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', null, {
    headers: { 'Refresh-Token': refreshToken }
  }),
}

// ============================================================
// PROFILE SERVICE
// ============================================================
export const profileService = {
  getMe: () => api.get('/profile/me'),
  updateMe: (data) => api.put('/profile/me', data),

  // Student
  getStudentProfile: () => api.get('/profile/student'),
  updateStudentProfile: (data) => api.put('/profile/student', data),

  // Employer
  getEmployerProfile: () => api.get('/profile/employer'),
  updateEmployerProfile: (data) => api.put('/profile/employer', data),
}

// ============================================================
// JOB SERVICE
// ============================================================
export const jobService = {
  // Public - all authenticated users
  getAllActiveJobs: () => api.get('/jobs'),
  getJobById: (id) => api.get(`/jobs/${id}`),

  // Employer / Admin
  createJob: (data) => api.post('/jobs', data),
  updateJob: (id, data) => api.put(`/jobs/${id}`, data),
  deleteJob: (id) => api.delete(`/jobs/${id}`),
  getMyPostings: () => api.get('/jobs/my-postings'),

  // Admin / Officer
  getAllJobs: () => api.get('/jobs/all'),
  approveJob: (id, approve) => api.patch(`/jobs/${id}/approve?approve=${approve}`),
}

// ============================================================
// APPLICATION SERVICE
// ============================================================
export const applicationService = {
  // Student
  applyForJob: (data) => api.post('/applications', data),
  getMyApplications: () => api.get('/applications/my-applications'),
  withdrawApplication: (id) => api.patch(`/applications/${id}/withdraw`),

  // Employer
  getApplicationsForJob: (jobId) => api.get(`/applications/job/${jobId}`),

  // Employer / Officer / Admin
  updateApplicationStatus: (id, data) => api.patch(`/applications/${id}/status`, data),

  // Officer / Admin
  getAllApplications: () => api.get('/applications/all'),
}

// ============================================================
// PLACEMENT OFFICER SERVICE
// ============================================================
export const officerService = {
  getDashboard: () => api.get('/officer/dashboard'),
  getPlacementRecords: (year) => api.get(`/officer/placement-records${year ? `?academicYear=${year}` : ''}`),
  getBatchStats: () => api.get('/officer/reports/batch-wise'),
  getDepartmentStats: () => api.get('/officer/reports/department-wise'),
  updateEligibility: (studentId, eligible) =>
    api.patch(`/officer/students/${studentId}/eligibility?eligible=${eligible}`),
  getAllApplications: () => api.get('/officer/applications'),
}

// ============================================================
// ADMIN SERVICE
// ============================================================
export const adminService = {
  getAllUsers: () => api.get('/admin/users'),
  getAllStudents: () => api.get('/admin/students'),
  getStudentById: (id) => api.get(`/admin/students/${id}`),
  toggleUserStatus: (id, enabled) => api.patch(`/admin/users/${id}/status?enabled=${enabled}`),
  toggleEligibility: (id, eligible) =>
    api.patch(`/admin/students/${id}/eligibility?eligible=${eligible}`),
}

// ============================================================
// NOTIFICATION SERVICE
// ============================================================
export const notificationService = {
  getNotifications: () => api.get('/notifications'),
  getUnreadCount: () => api.get('/notifications/unread-count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/mark-all-read'),
}
