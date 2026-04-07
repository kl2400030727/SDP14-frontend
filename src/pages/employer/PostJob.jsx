import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { jobService } from '../../api/services'
import toast from 'react-hot-toast'
import { Send, Briefcase } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const JOB_TYPES = ['FULL_TIME','PART_TIME','INTERNSHIP','CONTRACT']

// ✅ MOVED OUTSIDE (FIX)
const F = ({ label, name, type='text', placeholder='', required=false, as='input', options=[], value, onChange }) => (
  <div className="form-group">
    <label className="form-label">{label}{required && ' *'}</label>

    {as === 'textarea'
      ? <textarea className="form-input" placeholder={placeholder} rows={4}
          value={value} onChange={onChange} required={required} />

      : as === 'select'
      ? <select className="form-input" value={value} onChange={onChange}>
          {options.map(o => <option key={o} value={o}>{o.replace(/_/g,' ')}</option>)}
        </select>

      : <input type={type} className="form-input" placeholder={placeholder}
          value={value} onChange={onChange} required={required} />}
  </div>
)

export default function PostJob() {
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title:'', description:'', requirements:'', location:'',
    jobType:'FULL_TIME', minCTC:'', maxCTC:'', openings:'',
    skills:'', minCGPA:'', maxBacklogs:'', eligibleBranches:'',
    applicationDeadline:'', driveDate:''
  })

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await jobService.createJob({
        ...form,
        minCTC: form.minCTC ? parseFloat(form.minCTC) : null,
        maxCTC: form.maxCTC ? parseFloat(form.maxCTC) : null,
        openings: form.openings ? parseInt(form.openings) : null,
        minCGPA: form.minCGPA ? parseFloat(form.minCGPA) : null,
        maxBacklogs: form.maxBacklogs ? parseInt(form.maxBacklogs) : null,
      })
      toast.success('Job posted! Awaiting admin approval.')
      navigate('/employer/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job')
    } finally { setSaving(false) }
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Post a New Job</h1>
        <p className="page-subtitle">Fill in the details. Job will be reviewed before going live.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid-2" style={{ gap:24, marginBottom:24 }}>
          
          {/* Left */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card">
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18, display:'flex', alignItems:'center', gap:8 }}>
                <Briefcase size={16} /> Basic Information
              </h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <F label="Job Title" name="title" value={form.title} onChange={set('title')} placeholder="Software Engineer" required />
                <F label="Job Type" name="jobType" as="select" options={JOB_TYPES} value={form.jobType} onChange={set('jobType')} />
                <F label="Location" name="location" value={form.location} onChange={set('location')} placeholder="Bangalore, India" />
                <F label="Number of Openings" name="openings" type="number" value={form.openings} onChange={set('openings')} placeholder="5" required />
                <F label="Application Deadline" name="applicationDeadline" type="date" value={form.applicationDeadline} onChange={set('applicationDeadline')} required />
                <F label="Drive / Interview Date" name="driveDate" type="date" value={form.driveDate} onChange={set('driveDate')} />
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Compensation</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <F label="Min CTC (LPA)" name="minCTC" type="number" value={form.minCTC} onChange={set('minCTC')} placeholder="3.0" />
                <F label="Max CTC (LPA)" name="maxCTC" type="number" value={form.maxCTC} onChange={set('maxCTC')} placeholder="6.0" />
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
            <div className="card">
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Job Details</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <F label="Job Description" name="description" as="textarea" value={form.description} onChange={set('description')} placeholder="Describe the role..." required />
                <F label="Requirements" name="requirements" as="textarea" value={form.requirements} onChange={set('requirements')} placeholder="List key requirements..." />
                <F label="Required Skills" name="skills" value={form.skills} onChange={set('skills')} placeholder="Java, Spring Boot, MySQL (comma separated)" />
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize:15, fontWeight:700, marginBottom:18 }}>Eligibility Criteria</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <F label="Minimum CGPA" name="minCGPA" type="number" value={form.minCGPA} onChange={set('minCGPA')} placeholder="6.0" />
                <F label="Max Backlogs Allowed" name="maxBacklogs" type="number" value={form.maxBacklogs} onChange={set('maxBacklogs')} placeholder="0" />
                <F label="Eligible Branches" name="eligibleBranches" value={form.eligibleBranches} onChange={set('eligibleBranches')} placeholder="CSE, ECE, IT (comma separated)" />
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'flex', gap:12 }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={saving}>
            <Send size={16} /> {saving ? 'Posting...' : 'Post Job'}
          </button>
          <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/employer/jobs')}>
            Cancel
          </button>
        </div>
      </form>
    </DashboardLayout>
  )
}