'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { 
  AboutVideoSettings, 
  saveAboutVideoMetadata, 
  deleteAboutVideo 
} from '@/lib/supabase/video-actions'
import { Upload, Trash2, Film, Image as ImageIcon, CheckCircle2, AlertCircle, Play, Pause } from 'lucide-react'

export function AboutVideoManager({ initialSettings }: { initialSettings: AboutVideoSettings }) {
  const [settings, setSettings] = useState<AboutVideoSettings>(initialSettings)
  const [title, setTitle] = useState(initialSettings.title)
  const [description, setDescription] = useState(initialSettings.description)
  const [isPublished, setIsPublished] = useState(initialSettings.is_published)

  const [pending, startTransition] = useTransition()
  const [videoUploading, setVideoUploading] = useState(false)
  const [thumbUploading, setThumbUploading] = useState(false)
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Video playback preview state
  const [previewPlaying, setPreviewPlaying] = useState(false)

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMsg({ type, text })
    setTimeout(() => {
      setStatusMsg(null)
    }, 5000)
  }

  async function handleSaveMetadata() {
    startTransition(async () => {
      const result = await saveAboutVideoMetadata({
        title,
        description,
        is_published: isPublished
      })

      if (result.success) {
        setSettings(prev => ({
          ...prev,
          title,
          description,
          is_published: isPublished
        }))
        showStatus('success', 'Metadata and publication settings saved successfully.')
      } else {
        showStatus('error', result.error || 'Failed to save metadata.')
      }
    })
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>, type: 'video' | 'thumbnail') {
    const input = event.target
    const file = input.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('type', type)
    formData.append('file', file)

    if (type === 'video') {
      setVideoUploading(true)
    } else {
      setThumbUploading(true)
    }

    try {
      const response = await fetch('/api/admin/about-video', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(errorData?.error || 'Upload failed.')
      }

      const result = await response.json()
      if (result.success && result.url) {
        setSettings((prev) => ({
          ...prev,
          [type === 'video' ? 'video_url' : 'thumbnail_url']: result.url,
          is_published: true,
        }))
        setIsPublished(true)
        showStatus('success', type === 'video' ? 'Video uploaded successfully and set to published.' : 'Thumbnail uploaded successfully and set to published.')
      } else {
        showStatus('error', result.error || 'Failed to upload media.')
      }
    } catch (err: any) {
      showStatus('error', err.message || 'Error uploading media.')
    } finally {
      if (type === 'video') {
        setVideoUploading(false)
      } else {
        setThumbUploading(false)
      }
      input.value = ''
    }
  }

  async function handleDeleteMedia() {
    if (!confirm('Are you sure you want to delete the video and thumbnail? This will clear settings and delete files from Supabase Storage.')) {
      return
    }

    startTransition(async () => {
      const result = await deleteAboutVideo()
      if (result.success) {
        setSettings({
          video_url: '',
          thumbnail_url: '',
          title: 'More Than Cleaning — We Care About Your Space',
          description: 'At Summit Clean Co., we believe a clean environment is the foundation for a healthy, happy life. Watch our team in action as we bring detail-oriented cleaning care to residential and commercial spaces.',
          is_published: false
        })
        setTitle('More Than Cleaning — We Care About Your Space')
        setDescription('At Summit Clean Co., we believe a clean environment is the foundation for a healthy, happy life. Watch our team in action as we bring detail-oriented cleaning care to residential and commercial spaces.')
        setIsPublished(false)
        setPreviewPlaying(false)
        showStatus('success', 'Video and media deleted and settings reset.')
      } else {
        showStatus('error', result.error || 'Failed to delete video settings.')
      }
    })
  }

  return (
    <div className="space-y-8">
      {statusMsg && (
        <div className={`flex items-center gap-3 rounded-xl p-4 text-sm font-medium border ${
          statusMsg.type === 'success' 
            ? 'bg-[#EAFDF8] border-[#A2EAD4] text-[#0F5B4F]' 
            : 'bg-[#FDF3F2] border-[#F8D2D0] text-[#B42318]'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Left Side: Forms & Settings */}
        <div className="space-y-6">
          {/* Section Metadata Card */}
          <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#14221F]">Video Storytelling Content</h3>
            <p className="text-sm text-[#60716D] mt-1">Customize the title, description, and status for the video storytelling section on the About page.</p>
            
            <div className="mt-6 space-y-4">
              <div>
                <Label htmlFor="video-title">Section Title</Label>
                <div className="mt-1.5">
                  <Input 
                    id="video-title"
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    placeholder="Enter section title..."
                    className="h-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="video-description">Short Supporting Description</Label>
                <div className="mt-1.5">
                  <Textarea 
                    id="video-description"
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Enter short description..."
                    rows={4}
                  />
                </div>
              </div>

              <div>
                <Label>Publication Status</Label>
                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublished}
                    onClick={() => setIsPublished(!isPublished)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${
                      isPublished ? 'bg-[#0F5B4F]' : 'bg-[#DCE5E1]'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isPublished ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-sm font-medium text-[#14221F]">
                    {isPublished ? 'Published (visible on About page)' : 'Draft (hidden from public view)'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#DCE5E1] flex justify-between items-center">
              <Button 
                onClick={handleSaveMetadata} 
                disabled={pending}
                className="rounded-full px-6 py-2.5 h-10"
              >
                {pending ? 'Saving...' : 'Save Settings'}
              </Button>

              {settings.video_url && (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteMedia} 
                  disabled={pending}
                  className="rounded-full flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" /> Delete Video & Media
                </Button>
              )}
            </div>
          </div>

          {/* Media Uploader Card */}
          <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#14221F]">Media Assets</h3>
            <p className="text-sm text-[#60716D] mt-1">Upload the video file and poster thumbnail. Recommended formats: MP4 for video, JPG/PNG/WebP for thumbnail.</p>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {/* Video Upload Card */}
              <div className="rounded-xl border border-[#DCE5E1] bg-[#F5F7F2] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DFEEE8] text-[#0F5B4F] mb-4">
                    <Film className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-[#14221F]">Cleaning Video</h4>
                  <p className="text-xs text-[#60716D] mt-1">Select an MP4 or WebM video file. High compression recommended.</p>
                </div>
                
                <div className="mt-6">
                  {settings.video_url ? (
                    <div className="space-y-3">
                      <div className="text-xs text-[#0F5B4F] font-semibold bg-[#DFEEE8] px-2.5 py-1 rounded-full inline-block truncate max-w-full">
                        File uploaded
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="replace-video-input"
                          accept="video/*"
                          onChange={(e) => handleFileChange(e, 'video')}
                          className="hidden"
                          disabled={videoUploading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full rounded-full cursor-pointer"
                          disabled={videoUploading}
                        >
                          <label htmlFor="replace-video-input">
                            <Upload className="mr-2 h-4 w-4" /> {videoUploading ? 'Uploading...' : 'Replace Video'}
                          </label>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="video-input"
                        accept="video/*"
                        onChange={(e) => handleFileChange(e, 'video')}
                        className="hidden"
                        disabled={videoUploading}
                      />
                      <Button
                        className="w-full rounded-full cursor-pointer h-10"
                        asChild
                        disabled={videoUploading}
                      >
                        <label htmlFor="video-input">
                          <Upload className="mr-2 h-4 w-4" /> {videoUploading ? 'Uploading...' : 'Upload Video File'}
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Thumbnail Upload Card */}
              <div className="rounded-xl border border-[#DCE5E1] bg-[#F5F7F2] p-5 flex flex-col justify-between">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DFEEE8] text-[#0F5B4F] mb-4">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <h4 className="font-semibold text-[#14221F]">Poster Thumbnail</h4>
                  <p className="text-xs text-[#60716D] mt-1">Select an image to show as a placeholder before the video plays.</p>
                </div>
                
                <div className="mt-6">
                  {settings.thumbnail_url ? (
                    <div className="space-y-3">
                      <div className="text-xs text-[#0F5B4F] font-semibold bg-[#DFEEE8] px-2.5 py-1 rounded-full inline-block truncate max-w-full">
                        Thumbnail uploaded
                      </div>
                      <div className="relative">
                        <input
                          type="file"
                          id="replace-thumb-input"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, 'thumbnail')}
                          className="hidden"
                          disabled={thumbUploading}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="w-full rounded-full cursor-pointer"
                          disabled={thumbUploading}
                        >
                          <label htmlFor="replace-thumb-input">
                            <Upload className="mr-2 h-4 w-4" /> {thumbUploading ? 'Uploading...' : 'Replace Poster'}
                          </label>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        id="thumb-input"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'thumbnail')}
                        className="hidden"
                        disabled={thumbUploading}
                      />
                      <Button
                        className="w-full rounded-full cursor-pointer h-10"
                        asChild
                        disabled={thumbUploading}
                      >
                        <label htmlFor="thumb-input">
                          <Upload className="mr-2 h-4 w-4" /> {thumbUploading ? 'Uploading...' : 'Upload Poster Image'}
                        </label>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Preview */}
        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-[#DCE5E1] bg-white p-6 shadow-sm sticky top-6">
            <h3 className="text-lg font-semibold text-[#14221F]">Public Live Preview</h3>
            <p className="text-sm text-[#60716D] mt-1">This is how the video section currently looks on the public website.</p>

            <div className="mt-6 border border-[#DCE5E1] rounded-2xl overflow-hidden bg-[#F5F7F2]">
              {settings.video_url ? (
                <div className="relative aspect-video w-full bg-black group">
                  {previewPlaying ? (
                    <video
                      src={settings.video_url}
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      onPause={() => setPreviewPlaying(false)}
                      onEnded={() => setPreviewPlaying(false)}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      {settings.thumbnail_url ? (
                        <img 
                          src={settings.thumbnail_url} 
                          alt="Poster Thumbnail Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#DFEEE8] text-[#0F5B4F]">
                          <Film className="h-10 w-10 mb-2 opacity-55" />
                          <span className="text-xs font-semibold">No Thumbnail Uploaded</span>
                        </div>
                      )}
                      
                      {/* Play Button Overlay */}
                      <button
                        onClick={() => setPreviewPlaying(true)}
                        className="absolute inset-0 m-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-[#0F5B4F] shadow-lg transition duration-300 hover:scale-110 hover:bg-white"
                        aria-label="Play video"
                      >
                        <Play className="h-6 w-6 fill-current ml-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="aspect-video w-full flex flex-col items-center justify-center text-center p-8 bg-[#DFEEE8]/40 border border-dashed border-[#A2EAD4] rounded-2xl">
                  <Film className="h-12 w-12 text-[#60716D] opacity-40 mb-3" />
                  <p className="font-semibold text-sm text-[#14221F]">No video uploaded yet</p>
                  <p className="text-xs text-[#60716D] mt-1 max-w-[200px]">Upload a video to display it on your website</p>
                </div>
              )}

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest font-semibold text-[#0F5B4F]">
                    {isPublished ? '● Published' : '○ Draft'}
                  </span>
                  <span className="text-xs text-[#60716D]">Preview</span>
                </div>
                <h4 className="font-semibold text-base text-[#14221F] line-clamp-1">{title || 'More Than Cleaning — We Care About Your Space'}</h4>
                <p className="text-xs leading-5 text-[#60716D] line-clamp-3">{description || 'At Summit Clean Co., we believe...'}</p>
                
                <div className="pt-2 border-t border-[#DCE5E1]/60 flex justify-center">
                  <div className="inline-flex items-center justify-center rounded-full bg-[#1f7768] text-white px-4 py-1.5 text-xs font-semibold select-none opacity-80">
                    Get a Free Quote
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
