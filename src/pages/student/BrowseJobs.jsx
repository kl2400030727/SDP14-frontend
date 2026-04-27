import { useEffect, useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService, applicationService } from '../../api/services'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Modal from '../../components/common/Modal'
import EmptyState from '../../components/common/EmptyState'
import toast from 'react-hot-toast'
import { MapPin, DollarSign, Users, Calendar, Briefcase, Search, Send } from 'lucide-react'

export default function BrowseJobs() {
  const [jobs, setJobs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState(null)
  const [applying, setApplying] = useState(false)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    jobService.getAllActiveJobs()
      .then(r => {
        // Backend returns { success, message, data: [...] }
        const list = r?.data?.data ?? []
        setJobs(list)
        setFiltered(list)
      })
      .catch(err => {
        console.error('BrowseJobs fetch error:', err)
        toast.error('Could not load jobs.')
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(jobs)
      return
    }
    const q = search.toLowerCase()
    setFiltered(
      jobs.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.companyName?.toLowerCase().includes(q) ||
        j.location?.toLowerCase().includes(q) ||
        j.skills?.toLowerCase().includes(q)
      )
    )
  }, [search, jobs])

  const handleApply = async () => {
    if (!selectedJob) return
    setApplying(true)
    try {
      await applicationService.applyForJob({
        jobPostingId: selectedJob.id,
        coverLetter
      })
      toast.success('Application submitted!')
      setJobs(prev =>
        prev.map(j => j.id === selectedJob.id ? { ...j, alreadyApplied: true } : j)
      )
      setSelectedJob(null)
      setCoverLetter('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Browse Jobs</h1>
        <p className="page-subtitle">{filtered.length} opportunities available</p>
      </div>

      {/* Search bar */}
      <div className="search-box" style={{ marginBottom: 28, maxWidth: '100%' }}>
        <Search size={16} color="var(--text-muted)" />
        <input
          placeholder="Search by title, company, skills, location..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Job cards */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          desc={search ? 'Try a different search term' : 'No active jobs available right now'}
        />
      ) : (
        <div className="grid-3">
          {filtered.map(job => (
            <div
              key={job.id}
              className={`job-card ${job.alreadyApplied ? 'applied' : ''}`}
              onClick={() => setSelectedJob(job)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div className="company-logo">
                  {job.companyName?.[0]?.toUpperCase() || '?'}
                </div>
                {job.alreadyApplied
                  ? <span className="badge badge-green">Applied ✓</span>
                  : <span className="badge badge-purple">New</span>}
              </div>

              <div className="job-title">{job.title}</div>
              <div className="job-company">{job.companyName || 'Company'}</div>

              <div className="job-meta">
                {job.location && (
                  <span className="job-tag"><MapPin size={12} />{job.location}</span>
                )}
                {job.jobType && (
                  <span className="job-tag">{job.jobType.replace('_', ' ')}</span>
                )}
                {job.maxCTC && (
                  <span className="job-tag"><DollarSign size={12} />₹{job.maxCTC} LPA</span>
                )}
                {job.openings && (
                  <span className="job-tag"><Users size={12} />{job.openings} openings</span>
                )}
              </div>

              {job.skills && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10 }}>
                  {job.skills.split(',').slice(0, 3).join(' · ')}
                </p>
              )}

              <div className="job-footer">
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  <Calendar size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {job.applicationDeadline || 'Open'}
                </span>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={e => { e.stopPropagation(); setSelectedJob(job) }}
                >
                  View & Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job detail + Apply modal */}
      {selectedJob && (
        <Modal
          title={selectedJob.title}
          onClose={() => { setSelectedJob(null); setCoverLetter('') }}
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Company + meta */}
            <div style={{
              padding: 16,
              background: 'var(--bg-secondary)',
              borderRadius: 10
            }}>
              <p style={{ fontWeight: 600, fontSize: 15 }}>
                {selectedJob.companyName || 'Company'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                {selectedJob.location && (
                  <span className="job-tag"><MapPin size={12} />{selectedJob.location}</span>
                )}
                {selectedJob.maxCTC && (
                  <span className="job-tag">
                    ₹{selectedJob.minCTC || 0}–{selectedJob.maxCTC} LPA
                  </span>
                )}
                {selectedJob.openings && (
                  <span className="job-tag">{selectedJob.openings} openings</span>
                )}
                {selectedJob.minCGPA && (
                  <span className="job-tag">Min CGPA: {selectedJob.minCGPA}</span>
                )}
                {selectedJob.applicationDeadline && (
                  <span className="job-tag">Deadline: {selectedJob.applicationDeadline}</span>
                )}
                {selectedJob.jobType && (
                  <span className="job-tag">{selectedJob.jobType.replace('_', ' ')}</span>
                )}
              </div>
            </div>

            {selectedJob.description && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Description
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {selectedJob.description}
                </p>
              </div>
            )}

            {selectedJob.requirements && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Requirements
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {selectedJob.requirements}
                </p>
              </div>
            )}

            {selectedJob.skills && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Required Skills
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {selectedJob.skills}
                </p>
              </div>
            )}

            {selectedJob.eligibleBranches && (
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
                  Eligible Branches
                </p>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
                  {selectedJob.eligibleBranches}
                </p>
              </div>
            )}

            {/* Cover letter — only if not already applied */}
            {!selectedJob.alreadyApplied && (
              <div className="form-group">
                <label className="form-label">Cover Letter (optional)</label>
                <textarea
                  className="form-input"
                  rows={4}
                  placeholder="Why are you a great fit for this role?"
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button
                className="btn btn-outline"
                onClick={() => { setSelectedJob(null); setCoverLetter('') }}
              >
                Cancel
              </button>
              {selectedJob.alreadyApplied ? (
                <span className="badge badge-green" style={{ padding: '10px 16px', fontSize: 14 }}>
                  Already Applied ✓
                </span>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={handleApply}
                  disabled={applying}
                >
                  <Send size={15} />
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </DashboardLayout>
  )
}