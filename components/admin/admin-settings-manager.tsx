'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateAllSiteSettings, updateSiteSetting } from '@/lib/supabase/admin-actions'
import type { SiteSettingRow } from '@/lib/types'
import { CheckCircle2, AlertCircle, Save, Edit2 } from 'lucide-react'

export function AdminSettingsManager({ initialSettings }: { initialSettings: SiteSettingRow[] }) {
  const [settings, setSettings] = useState(initialSettings)
  const [pending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [modifiedKeys, setModifiedKeys] = useState<Set<string>>(new Set())

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => setStatusMsg(null), 5000)
  }

  const handleUpdate = (key: string, value: string) => {
    setSettings((current) =>
      current.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      )
    )
    setModifiedKeys((prev) => new Set([...prev, key]))
  }

  const saveSetting = (key: string, value: string | null) => {
    startTransition(async () => {
      const result = await updateSiteSetting(key, value ?? '')
      if (result.success) {
        setModifiedKeys((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
        showStatus('success', `Saved ${key}.`)
      } else {
        showStatus('error', result.error || `Unable to save ${key}.`)
      }
    })
  }

  const saveAllSettings = () => {
    startTransition(async () => {
      const result = await updateAllSiteSettings(settings)
      if (result.success) {
        setModifiedKeys(new Set())
        showStatus('success', 'All settings saved successfully!')
      } else {
        showStatus('error', result.error || 'Unable to save settings.')
      }
    })
  }

  // Group settings by category
  const categories = {
    company: ['company_name', 'business_name', 'email', 'phone', 'address', 'hours'],
    hero: ['hero_heading', 'hero_description', 'tagline'],
    service: ['service_area'],
    video: ['about_video_title', 'about_video_description', 'about_video_thumbnail_url', 'about_video_is_published'],
  }

  const getCategorySettings = (keys: string[]) => settings.filter(s => keys.includes(s.key))

  const isTextArea = (key: string) => [
    'description',
    'address',
    'details',
    'hero_heading',
    'hero_description',
    'tagline',
    'about_video_description',
  ].includes(key)

  const getSettingLabel = (key: string) => {
    const labels: Record<string, string> = {
      company_name: 'Company Name',
      business_name: 'Business Name',
      email: 'Email Address',
      phone: 'Phone Number',
      address: 'Physical Address',
      hours: 'Business Hours',
      hero_heading: 'Hero Section Heading',
      hero_description: 'Hero Section Description',
      tagline: 'Tagline',
      service_area: 'Service Area',
      about_video_title: 'About Video Title',
      about_video_description: 'About Video Description',
      about_video_thumbnail_url: 'About Video Thumbnail URL',
      about_video_is_published: 'Publish Video',
    }
    return labels[key] || key
  }

  return (
    <div className="space-y-6">
      {statusMsg && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-medium ${
            statusMsg.type === 'success'
              ? 'border-[#A2EAD4] bg-[#EAFDF8] text-[#0F5B4F]'
              : 'border-[#F8D2D0] bg-[#FDF3F2] text-[#B42318]'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Save All Button */}
      {modifiedKeys.size > 0 && (
        <div className="flex items-center justify-between rounded-[1.5rem] border border-[#A2EAD4] bg-[#EAFDF8] p-4">
          <p className="text-sm font-semibold text-[#0F5B4F]">
            {modifiedKeys.size} field{modifiedKeys.size !== 1 ? 's' : ''} modified
          </p>
          <Button
            onClick={saveAllSettings}
            disabled={pending}
            className="rounded-full bg-[#0F5B4F] px-6 py-2 text-white hover:bg-[#093D35]"
          >
            <Save className="h-4 w-4 mr-2" />
            Save All Changes
          </Button>
        </div>
      )}

      {/* Company Settings Section */}
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#14221F] flex items-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          Company Information
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {getCategorySettings(categories.company).map((setting) => (
            <div key={setting.key} className="rounded-[1.25rem] border border-[#DCE5E1] bg-[#F8FBF6] p-4 hover:border-[#0F5B4F] transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F] flex items-center gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Modified</span>
                )}
              </div>
              <div className="flex gap-2">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                ) : (
                  <Input
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => saveSetting(setting.key, setting.value)}
                  disabled={pending || !modifiedKeys.has(setting.key)}
                  className="rounded-full whitespace-nowrap"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Section Settings */}
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#14221F] flex items-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          Hero Section
        </h3>
        <div className="space-y-4">
          {getCategorySettings(categories.hero).map((setting) => (
            <div key={setting.key} className="rounded-[1.25rem] border border-[#DCE5E1] bg-[#F8FBF6] p-4 hover:border-[#0F5B4F] transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F] flex items-center gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Modified</span>
                )}
              </div>
              <div className="flex gap-2">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                ) : (
                  <Input
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => saveSetting(setting.key, setting.value)}
                  disabled={pending || !modifiedKeys.has(setting.key)}
                  className="rounded-full whitespace-nowrap"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Area Settings */}
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#14221F] flex items-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          Service Area
        </h3>
        <div className="space-y-4">
          {getCategorySettings(categories.service).map((setting) => (
            <div key={setting.key} className="rounded-[1.25rem] border border-[#DCE5E1] bg-[#F8FBF6] p-4 hover:border-[#0F5B4F] transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F] flex items-center gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Modified</span>
                )}
              </div>
              <div className="flex gap-2">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                ) : (
                  <Input
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => saveSetting(setting.key, setting.value)}
                  disabled={pending || !modifiedKeys.has(setting.key)}
                  className="rounded-full whitespace-nowrap"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Settings */}
      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-8 shadow-sm">
        <h3 className="text-lg font-semibold text-[#14221F] flex items-center gap-2 mb-6">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          About Video
        </h3>
        <div className="space-y-4">
          {getCategorySettings(categories.video).map((setting) => (
            <div key={setting.key} className="rounded-[1.25rem] border border-[#DCE5E1] bg-[#F8FBF6] p-4 hover:border-[#0F5B4F] transition-colors">
              <div className="flex items-center justify-between gap-2 mb-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-[#0F5B4F] flex items-center gap-1.5">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">Modified</span>
                )}
              </div>
              <div className="flex gap-2">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                ) : (
                  <Input
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
                  />
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => saveSetting(setting.key, setting.value)}
                  disabled={pending || !modifiedKeys.has(setting.key)}
                  className="rounded-full whitespace-nowrap"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
