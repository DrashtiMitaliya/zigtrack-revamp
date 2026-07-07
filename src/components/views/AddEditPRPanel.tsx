import React, { useState, useEffect } from 'react'
import { X, Calendar, Clock, Bold, Italic, Underline, Strikethrough, Link, List, ListOrdered } from 'lucide-react'
import type { PRRequest } from '../../constants'

interface AddEditPRPanelProps {
  isOpen: boolean
  onClose: () => void
  onSave: (prData: Omit<PRRequest, 'id'> & { id?: number }) => void
  editingPR: PRRequest | null
  projects: string[]
}

export const AddEditPRPanel: React.FC<AddEditPRPanelProps> = ({
  isOpen,
  onClose,
  onSave,
  editingPR,
  projects,
}) => {
  const [title, setTitle] = useState('')
  const [prLink, setPrLink] = useState('')
  const [project, setProject] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'Approved' | 'Open' | 'Rejected'>('Open')

  // Load editing PR data or set default values
  useEffect(() => {
    if (editingPR) {
      setTitle(editingPR.title)
      setPrLink(editingPR.prLink)
      setProject(editingPR.project)
      
      // Parse date and time if available (e.g. "16-06-2026 12:32")
      const dateTimeParts = editingPR.date.split(' ')
      if (dateTimeParts.length === 2) {
        setDate(dateTimeParts[0].replace(/-/g, '/'))
        setTime(dateTimeParts[1])
      } else {
        setDate(editingPR.date.replace(/-/g, '/'))
        setTime('')
      }
      setStatus(editingPR.status)
      setDescription('')
    } else {
      setTitle('')
      setPrLink('')
      setProject(projects[0] || 'ES AI Assessment')
      
      // Default to current date/time
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      setDate(`${yyyy}/${mm}/${dd}`)
      
      let hrs = today.getHours()
      const mins = String(today.getMinutes()).padStart(2, '0')
      const ampm = hrs >= 12 ? 'PM' : 'AM'
      hrs = hrs % 12
      if (hrs === 0) hrs = 12
      setTime(`${String(hrs).padStart(2, '0')}:${mins} ${ampm}`)
      
      setDescription('')
      setStatus('Open')
    }
  }, [editingPR, isOpen, projects])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !prLink.trim()) return

    // Convert date back to typical date format: "DD-MM-YYYY HH:MM"
    const formattedDatePart = date.replace(/\//g, '-')
    const finalDate = time ? `${formattedDatePart} ${time}` : formattedDatePart

    onSave({
      id: editingPR?.id,
      title,
      prLink,
      project,
      date: finalDate,
      reviewBy: editingPR?.reviewBy || 'Pruthvi Darji',
      prGeneratedBy: editingPR?.prGeneratedBy || 'Dhaval Patel',
      status,
    })
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 flex flex-col justify-between border-l border-slate-200 animate-in slide-in-from-right duration-250">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-black text-slate-800 tracking-tight">
              {editingPR ? 'Edit Request' : 'Add Request'}
            </h3>
            <div className="w-16 h-0.5 bg-[var(--accent)] mt-1.5" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-semibold"
            />
          </div>

          {/* PR Link Input */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              PR Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={prLink}
              onChange={(e) => setPrLink(e.target.value)}
              placeholder="Enter PR Link"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-semibold"
            />
          </div>

          {/* Project Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Project <span className="text-rose-500">*</span>
            </label>
            <select
              value={project}
              onChange={(e) => setProject(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-semibold cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="space-y-1.5 relative">
            <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Date <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="YYYY/MM/DD"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-semibold"
              />
              <Calendar className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Time Picker */}
          <div className="space-y-1.5 relative">
            <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Time <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="HH:MM AM/PM"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs text-slate-800 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-semibold"
              />
              <Clock className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Edit status dropdown (Only when editing) */}
          {editingPR && (
            <div className="space-y-1.5">
              <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                Status <span className="text-rose-500">*</span>
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-700 outline-none focus:bg-white focus:border-[var(--accent)] transition-all font-semibold cursor-pointer"
              >
                <option value="Open">Open</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          )}

          {/* Description with Format Editor Toolbar */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
              Description
            </label>
            
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs focus-within:border-[var(--accent)] transition-colors">
              {/* Toolbar */}
              <div className="bg-slate-50 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1.5">
                <select className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-500 cursor-pointer">
                  <option>Normal</option>
                  <option>Heading 1</option>
                  <option>Heading 2</option>
                </select>
                <select className="bg-white border border-slate-200 rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-500 cursor-pointer">
                  <option>Sans Serif</option>
                  <option>Serif</option>
                  <option>Monospace</option>
                </select>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><Italic className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><Underline className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><Strikethrough className="w-3.5 h-3.5" /></button>
                <span className="w-px h-4 bg-slate-200 mx-1" />
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><Link className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><ListOrdered className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1 rounded text-slate-500 hover:bg-white hover:shadow-xs transition-all"><List className="w-3.5 h-3.5" /></button>
              </div>

              {/* Text Area */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Type anything"
                rows={4}
                className="w-full bg-white px-4 py-3 text-xs text-slate-700 outline-none resize-none font-semibold leading-relaxed"
              />
            </div>
          </div>

        </form>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/50">
          <button
            type="submit"
            onClick={handleSubmit}
            className="flex-1 bg-[var(--accent)] hover:brightness-105 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-md transition-all hover:scale-101 active:scale-99"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white hover:bg-slate-55 border border-slate-200 text-slate-600 font-bold text-xs py-3 px-4 rounded-xl transition-all hover:scale-101 active:scale-99"
          >
            Cancel
          </button>
        </div>

      </div>
    </>
  )
}

export default AddEditPRPanel
