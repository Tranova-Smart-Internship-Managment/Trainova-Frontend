import React, { useState } from 'react'
import Dashboard from './pages/Dashboard.jsx'
import Register from './pages/Register.jsx'
import { LanguageProvider, useLanguage } from './i18n/LanguageContext.jsx'

function AppShell() {
  const { t, dir, toggleLang } = useLanguage()
  const [active, setActive] = useState('dashboard')

  const pages = {
    dashboard: { label: t('navDashboard'), component: Dashboard },
    register: { label: t('navRegister'), component: Register },
  }

  const ActivePage = pages[active].component

  return (
    <div dir={dir} className="min-h-screen bg-gray-100 font-sans">
      {/* Top nav for switching between pages of the project */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-4 sticky top-0 z-50">
        <div className="text-lg font-medium tracking-wide" style={{ color: '#1E3A5F' }}>
          {t('brandName')}
        </div>
        <div className="flex gap-2 mx-auto">
          {Object.entries(pages).map(([key, p]) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`text-sm px-3 py-1.5 rounded-md transition-colors ${
                active === key
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <button
          onClick={toggleLang}
          className="text-sm px-3 py-1.5 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 flex items-center gap-1.5"
        >
          🌐 {t('langToggle')}
        </button>
      </nav>

      <main className="p-4">
        <ActivePage />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppShell />
    </LanguageProvider>
  )
}
