'use client'

import { useState, useTransition, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateAllSiteSettings, updateSiteSetting } from '@/lib/supabase/admin-actions'
import type { SiteSettingRow } from '@/lib/types'
import { CheckCircle2, AlertCircle, Save, Edit2, Key, Mail, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function AdminSettingsManager({ initialSettings }: { initialSettings: SiteSettingRow[] }) {
  const [settings, setSettings] = useState(initialSettings)
  const [pending, startTransition] = useTransition()
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [modifiedKeys, setModifiedKeys] = useState<Set<string>>(new Set())

  const [adminEmail, setAdminEmail] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [credPending, setCredPending] = useState(false)
  const [credStatusMsg, setCredStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setAdminEmail(data.user.email)
        setNewEmail(data.user.email)
      }
    })
  }, [])

  const handleUpdateCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setCredStatusMsg(null)

    if (newPassword && newPassword !== confirmPassword) {
      setCredStatusMsg({ type: 'error', text: 'Passwords do not match.' })
      return
    }

    const supabase = createClient()
    if (!supabase) {
      setCredStatusMsg({ type: 'error', text: 'Supabase is not configured.' })
      return
    }

    setCredPending(true)
    try {
      const updates: { email?: string; password?: string } = {}
      if (newEmail && newEmail !== adminEmail) {
        updates.email = newEmail
      }
      if (newPassword) {
        updates.password = newPassword
      }

      if (Object.keys(updates).length === 0) {
        setCredStatusMsg({ type: 'error', text: 'No changes provided.' })
        setCredPending(false)
        return
      }

      const { error } = await supabase.auth.updateUser(updates)
      if (error) {
        setCredStatusMsg({ type: 'error', text: error.message })
      } else {
        setCredStatusMsg({ type: 'success', text: 'Credentials updated successfully.' })
        setAdminEmail(newEmail)
        setNewPassword('')
        setConfirmPassword('')
      }
    } catch (err: any) {
      setCredStatusMsg({ type: 'error', text: err?.message || 'An error occurred while updating credentials.' })
    } finally {
      setCredPending(false)
    }
  }

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
          className={`flex items-center gap-3 rounded-xl border p-3 text-sm font-medium sm:p-4 ${
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

      {modifiedKeys.size > 0 && (
        <div className="flex flex-col gap-3 rounded-[1.25rem] border border-[#A2EAD4] bg-[#EAFDF8] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <p className="text-sm font-semibold text-[#0F5B4F]">
            {modifiedKeys.size} field{modifiedKeys.size !== 1 ? 's' : ''} modified
          </p>
          <Button
            onClick={saveAllSettings}
            disabled={pending}
            className="rounded-full bg-[#0F5B4F] px-5 py-2 text-white hover:bg-[#093D35]"
          >
            <Save className="mr-2 h-4 w-4" />
            Save All Changes
          </Button>
        </div>
      )}

      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-[#14221F] sm:text-lg">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          Company Information
        </h3>
        <div className="grid gap-4 lg:grid-cols-2">
          {getCategorySettings(categories.company).map((setting) => (
            <div key={setting.key} className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px]">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Modified</span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="min-h-[90px] flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
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
                  className="rounded-full whitespace-nowrap sm:self-start"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-[#14221F] sm:text-lg">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          Hero Section
        </h3>
        <div className="space-y-4">
          {getCategorySettings(categories.hero).map((setting) => (
            <div key={setting.key} className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px]">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Modified</span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="min-h-[90px] flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
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
                  className="rounded-full whitespace-nowrap sm:self-start"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-[#14221F] sm:text-lg">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          Service Area
        </h3>
        <div className="space-y-4">
          {getCategorySettings(categories.service).map((setting) => (
            <div key={setting.key} className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px]">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Modified</span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="min-h-[90px] flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
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
                  className="rounded-full whitespace-nowrap sm:self-start"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-[#14221F] sm:text-lg">
          <span className="h-2 w-2 rounded-full bg-[#0F5B4F]" />
          About Video
        </h3>
        <div className="space-y-4">
          {getCategorySettings(categories.video).map((setting) => (
            <div key={setting.key} className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px]">
                  <Edit2 className="h-3.5 w-3.5" />
                  {getSettingLabel(setting.key)}
                </Label>
                {modifiedKeys.has(setting.key) && (
                  <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-600">Modified</span>
                )}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {isTextArea(setting.key) ? (
                  <Textarea
                    value={setting.value ?? ''}
                    onChange={(e) => handleUpdate(setting.key, e.target.value)}
                    rows={3}
                    placeholder={`Enter ${getSettingLabel(setting.key).toLowerCase()}`}
                    className="min-h-[90px] flex-1 rounded-xl border-[#DCE5E1] focus-visible:ring-[#0F5B4F]/20"
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
                  className="rounded-full whitespace-nowrap sm:self-start"
                >
                  Save
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-4 shadow-sm sm:p-6 lg:p-8">
        <h3 className="mb-5 flex items-center gap-2 text-base font-semibold text-[#14221F] sm:text-lg">
          <Key className="h-4 w-4 text-[#0F5B4F]" />
          Admin Credentials
        </h3>
        
        {credStatusMsg && (
          <div
            className={`mb-5 flex items-center gap-3 rounded-xl border p-3 text-sm font-medium sm:p-4 ${
              credStatusMsg.type === 'success'
                ? 'border-[#A2EAD4] bg-[#EAFDF8] text-[#0F5B4F]'
                : 'border-[#F8D2D0] bg-[#FDF3F2] text-[#B42318]'
            }`}
          >
            {credStatusMsg.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 shrink-0" />
            )}
            <span>{credStatusMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleUpdateCredentials} className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4">
              <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px] mb-2">
                <Mail className="h-3.5 w-3.5" />
                Change Admin Email
              </Label>
              <Input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Email Address"
                className="rounded-xl border-[#DCE5E1] bg-white focus-visible:ring-[#0F5B4F]/20"
              />
            </div>

            <div className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4">
              <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px] mb-2">
                <Key className="h-3.5 w-3.5" />
                New Password (leave blank if unchanged)
              </Label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                  className="rounded-xl border-[#DCE5E1] bg-white pr-11 focus-visible:ring-[#0F5B4F]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#60716D] transition hover:text-[#0F5B4F]"
                  aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="rounded-[1.1rem] border border-[#DCE5E1] bg-[#F8FBF6] p-3 transition-colors hover:border-[#0F5B4F] sm:p-4 lg:col-span-2">
              <Label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#0F5B4F] sm:text-[11px] mb-2">
                <Key className="h-3.5 w-3.5" />
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm New Password"
                  className="rounded-xl border-[#DCE5E1] bg-white pr-11 focus-visible:ring-[#0F5B4F]/20"
                  disabled={!newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#60716D] transition hover:text-[#0F5B4F] disabled:opacity-50"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  disabled={!newPassword}
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={credPending}
              className="rounded-full bg-[#0F5B4F] px-5 py-2 text-white hover:bg-[#093D35]"
            >
              Update Credentials
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
