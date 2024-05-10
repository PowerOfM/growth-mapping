import { useState } from 'react'
import { PageTab } from './AppTypes'
import { ThemeProvider } from './components/ThemeProvider'
import { ImporterDialog } from './components/importer/ImporterDialog'
import { Map } from './components/map/Map'
import { Sidebar } from './components/sidebar/Sidebar'
import { Toaster } from './components/ui/sonner'

function App() {
  const [selectedTab, setSelectedTab] = useState<PageTab>(PageTab.Map)
  const [importerOpen, setImporterOpen] = useState(false)

  return (
    <ThemeProvider>
      <div className="flex h-screen w-screen">
        <Sidebar
          selectedTab={selectedTab}
          onTabSelect={setSelectedTab}
          onImportClick={() => setImporterOpen(true)}
        />
        <div className="relative flex flex-1">
          <Map />
          {/* <TableOverlay show={selectedTab === PageTab.Table}>
            <Table />
          </TableOverlay> */}
        </div>
      </div>
      <Toaster />
      <ImporterDialog
        open={importerOpen}
        onClose={() => setImporterOpen(false)}
      />
    </ThemeProvider>
  )
}

export default App
