import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { Save, Trash2, Key } from 'lucide-react'
import { storage } from '@/lib/storage'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import '@/assets/global.css'

const Options = () => {
  const [apiKey, setApiKey] = useState('')
  const [targetLang, setTargetLang] = useState('Japanese')
  const [outgoingLang, setOutgoingLang] = useState('English')
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    storage.getSettings().then(s => {
      setApiKey(s.apiKey)
      setTargetLang(s.targetLang)
      setOutgoingLang(s.outgoingLang || 'English')
    })
  }, [])

  const handleSave = async () => {
    await storage.saveSettings({ apiKey, targetLang, outgoingLang })
    setStatus('Settings saved!')
    setTimeout(() => setStatus(''), 2000)
  }

  const handleClearCache = async () => {
    if (confirm('Are you sure you want to clear all translation cache?')) {
      await storage.clearCache()
      setStatus('Cache cleared!')
      setTimeout(() => setStatus(''), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>

          <div className="space-y-6">
            {/* API Key Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cerebras API Key
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pl-10"
                  placeholder="sk-..."
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Stored locally on your device. Never shared.
              </p>
            </div>

            <div className="border-t border-gray-100 my-4"></div>

            {/* Target Language (Incoming) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Incoming Translations (Reading)
              </label>
              <Input
                type="text"
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                placeholder="Japanese"
              />
              <p className="mt-1 text-xs text-gray-500">
                Language to translate other users' messages into.
              </p>
            </div>

            {/* Outgoing Language (Outgoing) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Outgoing Translations (Writing)
              </label>
              <Input
                type="text"
                value={outgoingLang}
                onChange={(e) => setOutgoingLang(e.target.value)}
                placeholder="English"
              />
              <p className="mt-1 text-xs text-gray-500">
                Language to translate your input into when you click the translate button.
              </p>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col gap-3">
              <Button onClick={handleSave} className="flex justify-center items-center gap-2">
                <Save className="w-4 h-4" />
                Save Settings
              </Button>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium text-gray-900 mb-2">Data Management</h3>
                <Button variant="secondary" onClick={handleClearCache} className="w-full flex justify-center items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                  Clear Cache
                </Button>
              </div>
            </div>

            {status && (
              <div className="mt-4 p-2 bg-green-50 text-green-700 text-sm text-center rounded">
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>
)