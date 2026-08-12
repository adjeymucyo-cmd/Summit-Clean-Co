import { NextRequest, NextResponse } from 'next/server'
import { uploadVideoFile, uploadThumbnailFile } from '@/lib/supabase/video-actions'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const type = formData.get('type')
  const file = formData.get('file')

  if (type !== 'video' && type !== 'thumbnail') {
    return NextResponse.json({ success: false, error: 'Invalid upload type.' }, { status: 400 })
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ success: false, error: 'No file uploaded.' }, { status: 400 })
  }

  const result = type === 'video'
    ? await uploadVideoFile(file)
    : await uploadThumbnailFile(file)

  return NextResponse.json(result, { status: result.success ? 200 : 500 })
}
