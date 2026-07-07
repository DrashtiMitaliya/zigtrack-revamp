import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppWrapperProps {
  children: React.ReactNode
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#141414] font-body overflow-hidden">
      {/* Mobile overlay — tap to close sidebar */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[var(--z-overlay)] md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — fixed drawer on mobile, static on md+ */}
      <div
        className={`
          fixed inset-y-0 left-0 z-[var(--z-sidebar)] flex-shrink-0
          transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0 md:z-auto md:flex
          ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={() => setMobileSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        <Header onMenuClick={() => setMobileSidebarOpen(true)} />
        {children}
      </main>
    </div>
  )
}

export default AppWrapper
