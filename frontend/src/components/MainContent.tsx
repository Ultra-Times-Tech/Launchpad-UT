import React from 'react'

interface MainContentProps {
  children: React.ReactNode
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  return (
    <main className="pt-16 min-h-screen">
      {children}
    </main>
  )
}

export default MainContent 