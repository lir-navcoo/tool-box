import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { Sidebar } from '@/components/layout/Sidebar'
import HomePage from '@/pages/HomePage'
import JsonPage from '@/pages/JsonPage'
import EncryptPage from '@/pages/EncryptPage'
import QrcodePage from '@/pages/QrcodePage'
import ImagePage from '@/pages/ImagePage'
import ColorPage from '@/pages/ColorPage'
import TaxPersonalPage from '@/pages/TaxPersonalPage'
import TaxInvoicePage from '@/pages/TaxInvoicePage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/json" element={<JsonPage />} />
          <Route path="/encrypt" element={<EncryptPage />} />
          <Route path="/qrcode" element={<QrcodePage />} />
          <Route path="/image" element={<ImagePage />} />
          <Route path="/color" element={<ColorPage />} />
          <Route path="/tax-personal" element={<TaxPersonalPage />} />
          <Route path="/tax-invoice" element={<TaxInvoicePage />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
