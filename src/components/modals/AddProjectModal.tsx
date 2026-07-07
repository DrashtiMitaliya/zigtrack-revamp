import React from 'react'
import { X, ChevronDown } from 'lucide-react'
import { useAppContext } from '../../context/AppContext'

export const AddProjectModal: React.FC = () => {
  const {
    showAddProjectModal,
    setShowAddProjectModal,
    selectedProjectToAdd,
    setSelectedProjectToAdd,
    availableProjects,
    handleAddProject
  } = useAppContext()

  if (!showAddProjectModal) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm border border-slate-100 shadow-2xl">
        <div className="p-4 border-b border-slate-50 flex justify-between items-center">
          <h3 className="text-sm font-display font-bold text-[#1490FE]">Add to Watchlist</h3>
          <button onClick={() => setShowAddProjectModal(false)} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleAddProject} className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              Project <span className="text-[#FF6347]">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedProjectToAdd}
                onChange={e => setSelectedProjectToAdd(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-100 focus:border-[#1490FE]/40 rounded-xl text-xs text-slate-800 outline-none cursor-pointer appearance-none"
              >
                {availableProjects.map((p, i) => (
                  <option key={i} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="bg-[#1490FE] hover:bg-[#0070DF] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddProjectModal(false)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-100 text-xs font-bold px-4 py-2 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
export default AddProjectModal
