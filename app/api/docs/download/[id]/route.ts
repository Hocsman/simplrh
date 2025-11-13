import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface DownloadRouteProps {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: DownloadRouteProps) {
  try {
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Get user's organization
    const { data: member } = await supabase
      .from('members')
      .select('org_id')
      .eq('user_id', user.id)
      .single()

    if (!member) {
      return NextResponse.json({ error: 'Organisation non trouvée' }, { status: 404 })
    }

    // Get document request with files
    const { data: docRequest, error: docError } = await supabase
      .from('doc_requests')
      .select(`
        *,
        files:doc_files(*)
      `)
      .eq('id', id)
      .eq('org_id', member.org_id)
      .single()

    if (docError || !docRequest) {
      return NextResponse.json({ error: 'Document non trouvé' }, { status: 404 })
    }

    if (docRequest.status !== 'generated' || !docRequest.files || docRequest.files.length === 0) {
      return NextResponse.json({ error: 'Document non disponible' }, { status: 404 })
    }

    const file = docRequest.files[0]

    // Download file from Supabase Storage
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('documents')
      .download(file.path)

    if (downloadError || !fileData) {
      console.error('Download error:', downloadError)
      return NextResponse.json({ error: 'Erreur lors du téléchargement' }, { status: 500 })
    }

    // Convert Blob to Buffer
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract filename from path
    const filename = file.path.split('/').pop() || 'document.pdf'

    // Return PDF with proper headers
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'Cache-Control': 'private, max-age=3600'
      }
    })
  } catch (error: any) {
    console.error('❌ Document download error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement du document' },
      { status: 500 }
    )
  }
}
