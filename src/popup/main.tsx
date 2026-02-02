import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Settings, BarChart3, Globe } from 'lucide-react'
import { storage } from '@/lib/storage'
import { AppSettings, AppStats } from '@/lib/types'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import '@/assets/global.css'

const Popup = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null)
  const [stats, setStats] = useState<AppStats | null>(null)

  useEffect(() => {
    const loadData = async () => {
      const s = await storage.getSettings()
      const t = await storage.getStats()
      setSettings(s)
      setStats(t)
    }
    loadData()
  }, [])

  const toggleEnabled = async (val: boolean) => {
    if (!settings) return
    const newSettings = { ...settings, isEnabled: val }
    setSettings(newSettings)
    await storage.saveSettings({ isEnabled: val })
  }

  const openOptions = () => {
    chrome.runtime.openOptionsPage()
  }

  if (!settings || !stats) return <div className="p-4">Loading...</div>

  const needsSetup = !settings.apiKey

  return (
    <div className="w-[320px] bg-gray-50 min-h-[400px] flex flex-col font-sans text-gray-800">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <h1 className="font-bold text-lg">Translator</h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">{settings.isEnabled ? 'ON' : 'OFF'}</span>
          <Switch checked={settings.isEnabled} onChange={toggleEnabled} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 flex flex-col gap-4">

        {needsSetup ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-sm text-yellow-800 mb-3">API Key missing.</p>
            <Button onClick={openOptions} className="w-full text-sm">
              Setup API Key
            </Button>
          </div>
        ) : (
          <>
            {/* Language Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Reading</label>
                  <div className="mt-1 font-medium text-gray-900">{settings.targetLang}</div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Writing</label>
                  <div className="mt-1 font-medium text-gray-900">{settings.outgoingLang || 'English'}</div>
                </div>
              </div>
              <div className="my-3 border-t border-gray-50"></div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Source</label>
                <div className="mt-1 font-medium text-gray-900">{settings.sourceLang}</div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-gray-400" />
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Statistics (Month)</span>
              </div>

              <div>
                <div className="text-2xl font-bold text-indigo-600">
                  {stats.totalTranslatedCount.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Messages</div>
              </div>
            </div>

          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-100 border-t flex justify-center">
        <button
          onClick={openOptions}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition-colors"
        >
          <Settings className="w-4 h-4" />
          More Settings
        </button>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
)
