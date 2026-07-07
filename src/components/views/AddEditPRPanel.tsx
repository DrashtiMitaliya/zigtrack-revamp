import React, { useState, useEffect } from 'react'
import {
  X,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link as LinkIcon,
  List,
  ListOrdered,
  GitPullRequest
} from 'lucide-react'
import type { PRRequest } from '../../constants'
import { DropdownSelect, DatePickerWidget, TimePicker } from '../common'

interface AddEditPRPanelProps {
  isOpen: boolean
  onClose: () => void
  onSave: (prData: Omit<PRRequest, 'id'> & { id?: number }) => void
  editingPR: PRRequest | null
  projects: string[]
}

/**
 * AddEditPRPanel — Centered Modal layout for adding/editing PR requests.
 * Fully integrated with custom DatePickerWidget, custom TimePicker, and DropdownSelect components.
 */
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
      
      const dateTimeParts = editingPR.date.split(' ')
      if (dateTimeParts.length === 2) {
        const dParts = dateTimeParts[0].split('-')
        if (dParts.length === 3) {
          setDate(`${dParts[2]}-${dParts[1]}-${dParts[0]}`)
        } else {
          setDate(dateTimeParts[0])
        }
        setTime(dateTimeParts[1])
      } else {
        const dParts = editingPR.date.split('-')
        if (dParts.length === 3) {
          setDate(`${dParts[2]}-${dParts[1]}-${dParts[0]}`)
        } else {
          setDate(editingPR.date)
        }
        setTime('')
      }
      setStatus(editingPR.status)
      setDescription('')
    } else {
      setTitle('')
      setPrLink('')
      setProject(projects[0] || 'ES AI Assessment')
      
      const today = new Date()
      const yyyy = today.getFullYear()
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const dd = String(today.getDate()).padStart(2, '0')
      setDate(`${yyyy}-${mm}-${dd}`)
      
      const hrs = String(today.getHours()).padStart(2, '0')
      const mins = String(today.getMinutes()).padStart(2, '0')
      setTime(`${hrs}:${mins}`)
      
      setDescription('')
      setStatus('Open')
    }
  }, [editingPR, isOpen, projects])

  if (!isOpen) return null

  // Date object conversion helpers for the custom DatePickerWidget
  const getParsedDateObject = (dateStr: string): Date => {
    const parts = dateStr.split('-')
    if (parts.length === 3) {
      return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]))
    }
    return new Date()
  }

  const handleDateChange = (start: Date) => {
    const yyyy = start.getFullYear()
    const mm = String(start.getMonth() + 1).padStart(2, '0')
    const dd = String(start.getDate()).padStart(2, '0')
    setDate(`${yyyy}-${mm}-${dd}`)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !prLink.trim()) return

    let formattedDatePart = date
    const dParts = date.split('-')
    if (dParts.length === 3) {
      formattedDatePart = `${dParts[2]}-${dParts[1]}-${dParts[0]}`
    }

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
  }

  const projectOptions = projects.map(p => ({ value: p, label: p }))

  const statusOptions = [
    { value: 'Open', label: 'Open' },
    { value: 'Approved', label: 'Approved' },
    { value: 'Rejected', label: 'Rejected' },
  ]

  const wrapperClass = "relative flex items-center bg-slate-50/70 border border-slate-200 rounded-2xl focus-within:bg-white focus-within:border-[#1490FE] focus-within:ring-4 focus-within:ring-[#1490FE]/10 transition-all duration-200 shadow-xs"
  const iconClass = "absolute left-4 w-4 h-4 text-slate-400 pointer-events-none z-10"
  const inputClass = "w-full bg-transparent border-none outline-none py-3.5 pl-11 pr-4 text-xs text-slate-800 font-semibold placeholder-slate-400"

  return (
    <>
      {/* High-fidelity backdrop with blur */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Centered Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white rounded-3xl w-full max-w-lg border border-slate-200 shadow-2xl flex flex-col justify-between overflow-visible animate-in fade-in zoom-in-95 duration-200 max-h-[95vh] pointer-events-auto">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="text-base font-display font-black text-slate-800 tracking-tight">
                {editingPR ? 'Edit Request' : 'Add Request'}
              </h3>
              <div className="w-16 h-0.5 bg-[#1490FE] mt-1.5 rounded-full" />
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-650 p-2 rounded-xl hover:bg-slate-100 transition-all active:scale-95"
              aria-label="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-visible p-6 space-y-4">
            
            {/* Title */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                Title <span className="text-rose-500">*</span>
              </label>
              <div className={wrapperClass}>
                <GitPullRequest className={iconClass} />
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Title"
                  className={inputClass}
                />
              </div>
            </div>

            {/* PR Link */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                PR Link <span className="text-rose-500">*</span>
              </label>
              <div className={wrapperClass}>
                <LinkIcon className={iconClass} />
                <input
                  type="url"
                  required
                  value={prLink}
                  onChange={(e) => setPrLink(e.target.value)}
                  placeholder="Enter PR Link"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Project Selector */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                Project <span className="text-rose-500">*</span>
              </label>
              <DropdownSelect
                value={project}
                onChange={setProject}
                options={projectOptions}
                variant="input-field"
              />
            </div>

            {/* Date & Time Picker */}
            <div className="grid grid-cols-2 gap-4">
              {/* Date (Custom DatePickerWidget) */}
              <div className="space-y-1.5 relative">
                <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                  Date <span className="text-rose-500">*</span>
                </label>
                <DatePickerWidget
                  startDate={getParsedDateObject(date)}
                  endDate={getParsedDateObject(date)}
                  onRangeChange={(start) => handleDateChange(start)}
                  singleDateOnly={true}
                  variant="input-field"
                  className="w-full"
                />
              </div>

              {/* Time (Custom TimePicker) */}
              <div className="space-y-1.5 relative">
                <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                  Time <span className="text-rose-500">*</span>
                </label>
                <TimePicker
                  value={time}
                  onChange={setTime}
                  variant="input-field"
                  className="w-full"
                />
              </div>
            </div>

            {/* Edit status dropdown (Only when editing) */}
            {editingPR && (
              <div className="space-y-1.5">
                <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                  Status <span className="text-rose-500">*</span>
                </label>
                <DropdownSelect
                  value={status}
                  onChange={(val) => setStatus(val as any)}
                  options={statusOptions}
                  variant="input-field"
                />
              </div>
            )}

            {/* Description with Format Editor Toolbar */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-display font-extrabold uppercase tracking-widest text-slate-400">
                Description
              </label>
              
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs focus-within:border-[#1490FE] focus-within:ring-4 focus-within:ring-[#1490FE]/10 transition-all bg-white">
                {/* Toolbar */}
                <div className="bg-slate-50/80 border-b border-slate-200 px-3 py-2 flex flex-wrap items-center gap-1.5 select-none">
                  <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black text-slate-500 cursor-pointer outline-none hover:bg-slate-50 transition-colors">
                    <option>Normal</option>
                    <option>Heading 1</option>
                    <option>Heading 2</option>
                  </select>
                  <select className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-black text-slate-500 cursor-pointer outline-none hover:bg-slate-50 transition-colors">
                    <option>Sans Serif</option>
                    <option>Serif</option>
                    <option>Monospace</option>
                  </select>
                  <span className="w-px h-4 bg-slate-200 mx-1" />
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
                  <span className="w-px h-4 bg-slate-200 mx-1" />
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Link"><LinkIcon className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Ordered List"><ListOrdered className="w-3.5 h-3.5" /></button>
                  <button type="button" className="p-1 rounded-lg text-slate-500 hover:bg-slate-200/50 hover:text-slate-700 active:scale-95 transition-all" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                </div>

                {/* Text Area */}
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Type anything"
                  rows={4}
                  className="w-full bg-white px-4 py-3.5 text-xs text-slate-700 outline-none resize-none font-semibold leading-relaxed placeholder-slate-400"
                />
              </div>
            </div>

          </form>

          {/* Footer Buttons */}
          <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-3 bg-slate-50/30 flex-shrink-0">
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 bg-gradient-to-r from-[#1490FE] to-blue-600 hover:brightness-105 active:scale-98 text-white font-bold text-xs py-3.5 px-4 rounded-xl shadow-[0_4px_12px_rgba(20,144,254,0.25)] hover:shadow-[0_4px_20px_rgba(20,144,254,0.4)] transition-all"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white hover:bg-slate-100 border border-slate-200 active:scale-98 text-slate-600 font-bold text-xs py-3.5 px-4 rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

export default AddEditPRPanel
