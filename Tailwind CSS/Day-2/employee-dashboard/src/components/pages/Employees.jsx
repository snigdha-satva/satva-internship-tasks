import { useState } from 'react'
import Modal from '../Modal'
import {
  employees as seed,
  departments,
  employmentTypes,
  employmentStatuses,
  grades,
  roles,
  locations,
} from '../data/employeeData'

const statusClass = s => ({
  Active: 'badge-green', 'On Leave': 'badge-yellow',
  Terminated: 'badge-red', Probation: 'badge-blue',
}[s] || 'badge-gray')

const typeClass = t => ({
  'Full-time': 'badge-green', Contract: 'badge-blue', Intern: 'badge-purple',
}[t] || 'badge-gray')

const blank = {
  id: '', firstName: '', lastName: '', email: '', phone: '',
  department: '', jobTitle: '', employmentType: 'Full-time',
  reportingManager: '', workLocation: '', employmentStatus: 'Active',
  dateOfJoining: '', contractStartDate: '', contractEndDate: '',
  probationEndDate: '', salary: '', grade: 'L1', role: '',
}

function FormField({ label, required, children }) {
  return (
    <div>
      <label className="label">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  )
}

export default function Employees() {
  const [list, setList] = useState(seed)
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blank)

  const filtered = list.filter(e => {
    const q = search.toLowerCase()
    const match = `${e.firstName} ${e.lastName} ${e.email} ${e.id}`.toLowerCase().includes(q)
    return match &&
      (deptFilter ? e.department === deptFilter : true) &&
      (statusFilter ? e.employmentStatus === statusFilter : true)
  })

  const openAdd = () => {
    setEditing(null)
    setForm({ ...blank, id: `EMP${String(list.length + 1).padStart(3, '0')}` })
    setModalOpen(true)
  }

  const openEdit = emp => {
    setEditing(emp)
    setForm({ ...emp })
    setModalOpen(true)
  }

  const save = () => {
    if (!form.firstName || !form.lastName || !form.email) return
    setList(prev => editing
      ? prev.map(e => e.id === form.id ? form : e)
      : [...prev, form]
    )
    setModalOpen(false)
  }

  const del = id => {
    setList(prev => prev.filter(e => e.id !== id))
    setDeleteId(null)
  }

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-4">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div className="page-header mb-0">
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">{filtered.length} of {list.length} employees</p>
        </div>
        <button onClick={openAdd} className="btn-primary self-start xs:self-auto whitespace-nowrap">
          + Add Employee
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Search name, email, ID…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field flex-1"
        />
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="input-field sm:w-44">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field sm:w-44">
          <option value="">All Statuses</option>
          {employmentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="hidden md:block card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header">ID</th>
                <th className="table-header">Employee</th>
                <th className="table-header">Department</th>
                <th className="table-header">Job Title</th>
                <th className="table-header">Type</th>
                <th className="table-header">Location</th>
                <th className="table-header">Grade</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
                <tr key={emp.id} className="table-row">
                  <td className="table-cell font-mono text-xs text-slate-400">{emp.id}</td>
                  <td className="table-cell">
                    <div className="flex items-center gap-3">
                      <div className="avatar w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 text-xs">
                        {emp.firstName[0]}{emp.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">
                          {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-400">{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">{emp.department}</td>
                  <td className="table-cell">{emp.jobTitle}</td>
                  <td className="table-cell"><span className={typeClass(emp.employmentType)}>{emp.employmentType}</span></td>
                  <td className="table-cell">{emp.workLocation}</td>
                  <td className="table-cell"><span className="badge-gray">{emp.grade}</span></td>
                  <td className="table-cell"><span className={statusClass(emp.employmentStatus)}>{emp.employmentStatus}</span></td>
                  <td className="table-cell">
                    <div className="flex gap-4">
                      <button onClick={() => openEdit(emp)} className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold">Edit</button>
                      <button onClick={() => setDeleteId(emp.id)} className="text-xs text-red-500 hover:underline font-semibold">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-400">
              <p className="font-semibold">No employees found</p>
            </div>
          )}
        </div>
      </div>

      <div className="md:hidden space-y-3">
        {filtered.map(emp => (
          <div key={emp.id} className="mobile-emp-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="avatar w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 text-sm">
                  {emp.firstName[0]}{emp.lastName[0]}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">
                    {emp.firstName} {emp.lastName}
                  </p>
                  <p className="text-xs text-slate-400">{emp.email}</p>
                  <p className="text-xs text-slate-400 font-mono">{emp.id}</p>
                </div>
              </div>
              <span className={statusClass(emp.employmentStatus)}>{emp.employmentStatus}</span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              {[
                ['Department', emp.department],
                ['Job Title', emp.jobTitle],
                ['Location', emp.workLocation],
                ['Grade', emp.grade],
                ['Salary', emp.salary],
                ['Manager', emp.reportingManager],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <p className="text-xs text-slate-400">{lbl}</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{val || '—'}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
              <span className={typeClass(emp.employmentType)}>{emp.employmentType}</span>
              <div className="flex gap-2">
                <button onClick={() => openEdit(emp)} className="btn-primary text-xs py-1.5 px-3">Edit</button>
                <button onClick={() => setDeleteId(emp.id)} className="btn-danger text-xs py-1.5 px-3">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            <p className="font-semibold">No employees found</p>
          </div>
        )}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Employee' : 'Add Employee'}>
        <div className="space-y-7">
          <div>
            <p className="section-heading"> Core Identity</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Employee ID">
                <input className="input-field bg-slate-50 dark:bg-slate-900/40" value={form.id} disabled />
              </FormField>
              <FormField label="First Name" required>
                <input className="input-field" value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="First name" />
              </FormField>
              <FormField label="Last Name" required>
                <input className="input-field" value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Last name" />
              </FormField>
              <FormField label="Email" required>
                <input className="input-field" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="email@company.com" />
              </FormField>
              <FormField label="Phone Number">
                <input className="input-field" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1-555-0000" />
              </FormField>
            </div>
          </div>

          <div>
            <p className="section-heading">Employment Details</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Department">
                <select className="input-field" value={form.department} onChange={e => set('department', e.target.value)}>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </FormField>
              <FormField label="Job Title">
                <input className="input-field" value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} placeholder="e.g. Senior Developer" />
              </FormField>
              <FormField label="Employment Type">
                <select className="input-field" value={form.employmentType} onChange={e => set('employmentType', e.target.value)}>
                  {employmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormField>
              <FormField label="Reporting Manager">
                <input className="input-field" value={form.reportingManager} onChange={e => set('reportingManager', e.target.value)} placeholder="Manager's name" />
              </FormField>
              <FormField label="Work Location / Branch">
                <select className="input-field" value={form.workLocation} onChange={e => set('workLocation', e.target.value)}>
                  <option value="">Select location</option>
                  {locations.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </FormField>
              <FormField label="Employment Status">
                <select className="input-field" value={form.employmentStatus} onChange={e => set('employmentStatus', e.target.value)}>
                  {employmentStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>
            </div>
          </div>

          <div>
            <p className="section-heading"> HR Data</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Date of Joining">
                <input className="input-field" type="date" value={form.dateOfJoining} onChange={e => set('dateOfJoining', e.target.value)} />
              </FormField>
              <FormField label="Contract Start Date">
                <input className="input-field" type="date" value={form.contractStartDate} onChange={e => set('contractStartDate', e.target.value)} />
              </FormField>
              <FormField label="Contract End Date">
                <input className="input-field" type="date" value={form.contractEndDate} onChange={e => set('contractEndDate', e.target.value)} />
              </FormField>
              <FormField label="Probation End Date">
                <input className="input-field" type="date" value={form.probationEndDate} onChange={e => set('probationEndDate', e.target.value)} />
              </FormField>
              <FormField label="Salary / CTC Band">
                <input className="input-field" value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="e.g. $100,000" />
              </FormField>
              <FormField label="Grade / Level">
                <select className="input-field" value={form.grade} onChange={e => set('grade', e.target.value)}>
                  {grades.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FormField>
              <FormField label="Role / System Role">
                <select className="input-field" value={form.role} onChange={e => set('role', e.target.value)}>
                  <option value="">Select role</option>
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </FormField>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2 border-t border-slate-100 dark:border-slate-700">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={save} className="btn-primary">{editing ? 'Save Changes' : 'Add Employee'}</button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirm Delete">
        <div className="text-center py-4">
          <p className="font-bold text-slate-800 dark:text-white text-lg mb-2">Delete this employee?</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">This action cannot be undone.</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setDeleteId(null)} className="btn-secondary">Cancel</button>
            <button onClick={() => del(deleteId)} className="btn-danger">Delete</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}