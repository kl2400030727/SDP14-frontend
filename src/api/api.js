// ===========================================
// REST API CONFIGURATION
// Placement Management System — Backend Connector
// Base URL: http://localhost:8080/api
// ===========================================

import axios from 'axios'
import api from './axios'
// ---- Base Axios Instance ----
//const api = axios.create({
  //baseURL: 'http://localhost:8080/api',
  //headers: { 'Content-Type': 'application/json' },
  //timeout: 15000,
//})

// ---- Request Interceptor: attach JWT token ----
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ---- Response Interceptor: handle 401 auto-logout ----
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ===========================================
// AUTH APIs
// ===========================================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  verifyEmail:     (token) => api.get(`/auth/verify-email?token=${token}`),
  forgotPassword:  (email) => api.post('/auth/forgot-password', { email }),
  resetPassword:   (data)  => api.post('/auth/reset-password', data),
  changePassword:  (data)  => api.post('/auth/change-password', data),
  refreshToken:    (refreshToken) => api.post('/auth/refresh-token', null, {
    headers: { 'Refresh-Token': refreshToken }
  }),
}

// ===========================================
// PROFILE APIs
// ===========================================
export const profileAPI = {
  getMe:                 ()     => api.get('/profile/me'),
  updateMe:              (data) => api.put('/profile/me', data),
  getStudentProfile:     ()     => api.get('/profile/student'),
  updateStudentProfile:  (data) => api.put('/profile/student', data),
  getEmployerProfile:    ()     => api.get('/profile/employer'),
  updateEmployerProfile: (data) => api.put('/profile/employer', data),
}

// ===========================================
// JOB POSTING APIs
// ===========================================
export const jobAPI = {
  // All authenticated users
  getActiveJobs: ()       => api.get('/jobs'),
  getJobById:    (id)     => api.get(`/jobs/${id}`),

  // EMPLOYER / ADMIN
  createJob:    (data)    => api.post('/jobs', data),
  updateJob:    (id, data)=> api.put(`/jobs/${id}`, data),
  deleteJob:    (id)      => api.delete(`/jobs/${id}`),
  getMyPostings:()        => api.get('/jobs/my-postings'),

  // ADMIN / PLACEMENT OFFICER
  getAllJobs:   ()         => api.get('/jobs/all'),
  approveJob:  (id, approve) => api.patch(`/jobs/${id}/approve?approve=${approve}`),
}

// ===========================================
// APPLICATION APIs
// ===========================================
export const applicationAPI = {
  // STUDENT
  apply:              (data)  => api.post('/applications', data),
  getMyApplications:  ()      => api.get('/applications/my-applications'),
  withdrawApplication:(id)    => api.patch(`/applications/${id}/withdraw`),

  // EMPLOYER / ADMIN / OFFICER
  getApplicationsForJob: (jobId) => api.get(`/applications/job/${jobId}`),
  updateStatus: (id, data)       => api.patch(`/applications/${id}/status`, data),
  getAllApplications: ()          => api.get('/applications/all'),
}

// ===========================================
// PLACEMENT OFFICER APIs
// ===========================================
export const officerAPI = {
  getDashboard:       ()           => api.get('/officer/dashboard'),
  getPlacementRecords:(year)       => api.get(`/officer/placement-records${year ? `?academicYear=${year}` : ''}`),
  getBatchStats:      ()           => api.get('/officer/reports/batch-wise'),
  getDeptStats:       ()           => api.get('/officer/reports/department-wise'),
  getAllApplications:  ()           => api.get('/officer/applications'),
  updateEligibility:  (id, eligible) => api.patch(`/officer/students/${id}/eligibility?eligible=${eligible}`),
  approveJob:         (id, approve)  => api.patch(`/jobs/${id}/approve?approve=${approve}`),
}

// ===========================================
// ADMIN APIs
// ===========================================
export const adminAPI = {
  getAllUsers:        ()              => api.get('/admin/users'),
  getAllStudents:     ()              => api.get('/admin/students'),
  getStudentById:    (id)            => api.get(`/admin/students/${id}`),
  toggleUserStatus:  (id, enabled)   => api.patch(`/admin/users/${id}/status?enabled=${enabled}`),
  toggleEligibility: (id, eligible)  => api.patch(`/admin/students/${id}/eligibility?eligible=${eligible}`),
}

// ===========================================
// NOTIFICATION APIs
// ===========================================
export const notificationAPI = {
  getNotifications: ()   => api.get('/notifications'),
  getUnreadCount:   ()   => api.get('/notifications/unread-count'),
  markAsRead:       (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead:    ()   => api.patch('/notifications/mark-all-read'),
}

// ===========================================
// HELPERS
// ===========================================
export const getStatusBadgeClass = (status) => {
  const map = {
    APPLIED: 'badge-info', SHORTLISTED: 'badge-warning',
    SELECTED: 'badge-success', REJECTED: 'badge-danger',
    WITHDRAWN: 'badge-neutral', OFFER_ACCEPTED: 'badge-success',
    ACTIVE: 'badge-success', PENDING_APPROVAL: 'badge-warning',
    CANCELLED: 'badge-danger', CLOSED: 'badge-neutral',
    PLACED: 'badge-success', NOT_PLACED: 'badge-neutral',
    TECHNICAL_ROUND: 'badge-warning', HR_ROUND: 'badge-warning',
    GD_ROUND: 'badge-warning', APTITUDE_TEST: 'badge-warning',
  }
  return map[status] || 'badge-neutral'
}
