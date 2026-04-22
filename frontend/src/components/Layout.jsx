// frontend/src/components/Layout.jsx

import Sidebar from './Sidebar'
import TopBar  from './TopBar'

const Layout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-background">

      {/* Fixed left sidebar */}
      <Sidebar />

      {/* Everything to the right of the sidebar */}
      <div className="ml-72 flex flex-col min-h-screen">

        {/* Sticky top bar */}
        <TopBar title={title} />

        {/* Scrollable page content */}
        <main className="flex-1 p-8 max-w-[1400px] w-full">
          {children}
        </main>

      </div>
    </div>
  )
}

export default Layout