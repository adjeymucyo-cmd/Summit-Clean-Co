'use server'

import { createServiceRoleClient } from './server'

export type AboutVideoSettings = {
  video_url: string
  thumbnail_url: string
  title: string
  description: string
  is_published: boolean
}

// Default values for about page video
const DEFAULT_TITLE = 'More Than Cleaning — We Care About Your Space'
const DEFAULT_DESCRIPTION = 'At Summit Clean Co., we believe a clean environment is the foundation for a healthy, happy life. Watch our team in action as we bring detail-oriented cleaning care to residential and commercial spaces.'

export async function getAboutVideoSettings(): Promise<AboutVideoSettings> {
  const client = createServiceRoleClient()
  if (!client) {
    return {
      video_url: '',
      thumbnail_url: '',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      is_published: false,
    }
  }

  const { data, error } = await client
    .from('site_settings')
    .select('*')
    .in('key', [
      'about_video_url',
      'about_video_thumbnail_url',
      'about_video_title',
      'about_video_description',
      'about_video_is_published',
    ])

  if (error || !data) {
    return {
      video_url: '',
      thumbnail_url: '',
      title: DEFAULT_TITLE,
      description: DEFAULT_DESCRIPTION,
      is_published: false,
    }
  }

  const settingsMap = Object.fromEntries(data.map((row) => [row.key, row.value]))

  return {
    video_url: settingsMap['about_video_url'] || '',
    thumbnail_url: settingsMap['about_video_thumbnail_url'] || '',
    title: settingsMap['about_video_title'] || DEFAULT_TITLE,
    description: settingsMap['about_video_description'] || DEFAULT_DESCRIPTION,
    is_published: settingsMap['about_video_is_published'] === 'true',
  }
}

export async function saveAboutVideoMetadata(input: {
  title: string
  description: string
  is_published: boolean
}) {
  const client = createServiceRoleClient()
  if (!client) {
    return { success: false, error: 'Database client not initialized.' }
  }

  const timestamp = new Date().toISOString()
  const rows = [
    { key: 'about_video_title', value: input.title || DEFAULT_TITLE, updated_at: timestamp },
    { key: 'about_video_description', value: input.description || DEFAULT_DESCRIPTION, updated_at: timestamp },
    { key: 'about_video_is_published', value: String(input.is_published), updated_at: timestamp },
  ]

  const { error } = await client.from('site_settings').upsert(rows)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
}

async function ensureAboutVideoBucketExists(client: any) {
  try {
    const { data: buckets, error } = await client.storage.listBuckets()
    if (error) {
      console.error('Error listing buckets:', error.message)
      // Attempt creation as fallback anyway
      await client.storage.createBucket('about-videos', { public: true })
      return
    }
    const exists = buckets?.some((b: any) => b.name === 'about-videos')
    if (!exists) {
      await client.storage.createBucket('about-videos', { public: true })
    }
  } catch (err: any) {
    console.error('Exception ensuring bucket exists:', err.message)
  }
}

export async function uploadVideoFile(file: File) {
  const client = createServiceRoleClient()
  if (!client) {
    return { success: false, error: 'Database client not initialized.' }
  }

  if (!file) {
    return { success: false, error: 'No file provided.' }
  }

  try {
    await ensureAboutVideoBucketExists(client)

    const ext = file.name.split('.').pop() || 'mp4'
    const fileName = `video-${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await client.storage
      .from('about-videos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data } = client.storage.from('about-videos').getPublicUrl(fileName)
    const videoUrl = data.publicUrl

    const timestamp = new Date().toISOString()
    const { error: dbError } = await client.from('site_settings').upsert([
      { key: 'about_video_url', value: videoUrl, updated_at: timestamp },
      { key: 'about_video_is_published', value: 'true', updated_at: timestamp },
    ])

    if (dbError) {
      return { success: false, error: dbError.message }
    }

    return { success: true, url: videoUrl }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload video file.' }
  }
}

export async function uploadThumbnailFile(file: File) {
  const client = createServiceRoleClient()
  if (!client) {
    return { success: false, error: 'Database client not initialized.' }
  }

  if (!file) {
    return { success: false, error: 'No file provided.' }
  }

  try {
    await ensureAboutVideoBucketExists(client)

    const ext = file.name.split('.').pop() || 'jpg'
    const fileName = `thumb-${Date.now()}.${ext}`
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await client.storage
      .from('about-videos')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (uploadError) {
      return { success: false, error: uploadError.message }
    }

    const { data } = client.storage.from('about-videos').getPublicUrl(fileName)
    const thumbnailUrl = data.publicUrl

    const timestamp = new Date().toISOString()
    const { error: dbError } = await client.from('site_settings').upsert([
      { key: 'about_video_thumbnail_url', value: thumbnailUrl, updated_at: timestamp },
      { key: 'about_video_is_published', value: 'true', updated_at: timestamp },
    ])

    if (dbError) {
      return { success: false, error: dbError.message }
    }

    return { success: true, url: thumbnailUrl }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload thumbnail file.' }
  }
}

export async function deleteAboutVideo() {
  const client = createServiceRoleClient()
  if (!client) {
    return { success: false, error: 'Database client not initialized.' }
  }

  try {
    // 1. Fetch current settings to find files to delete
    const settings = await getAboutVideoSettings()

    const filesToDelete: string[] = []
    if (settings.video_url) {
      const parts = settings.video_url.split('/')
      const videoFilename = parts[parts.length - 1]
      if (videoFilename) filesToDelete.push(videoFilename)
    }
    if (settings.thumbnail_url) {
      const parts = settings.thumbnail_url.split('/')
      const thumbFilename = parts[parts.length - 1]
      if (thumbFilename) filesToDelete.push(thumbFilename)
    }

    // 2. Delete files from storage
    if (filesToDelete.length > 0) {
      const { error: deleteError } = await client.storage
        .from('about-videos')
        .remove(filesToDelete)
      if (deleteError) {
        console.error('Failed to delete files from storage:', deleteError.message)
      }
    }

    // 3. Clear settings in site_settings
    const timestamp = new Date().toISOString()
    const keysToReset = [
      { key: 'about_video_url', value: '', updated_at: timestamp },
      { key: 'about_video_thumbnail_url', value: '', updated_at: timestamp },
      { key: 'about_video_title', value: DEFAULT_TITLE, updated_at: timestamp },
      { key: 'about_video_description', value: DEFAULT_DESCRIPTION, updated_at: timestamp },
      { key: 'about_video_is_published', value: 'false', updated_at: timestamp },
    ]

    const { error: dbError } = await client.from('site_settings').upsert(keysToReset)
    if (dbError) {
      return { success: false, error: dbError.message }
    }

    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to delete video and clear settings.' }
  }
}
