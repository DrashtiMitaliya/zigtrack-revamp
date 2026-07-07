import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppWrapperProps {
  children: React.ReactNode
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-[#F5F7FA] text-[#141414] font-body overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <Header />
        {children}
      </main>
    </div>
  )
}
export default AppWrapper
