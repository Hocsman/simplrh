// Storage utilities for file uploads
import { createClient } from '@/lib/supabase/server'

export interface UploadResult {
  url: string
  path: string
  size: number
}

export async function uploadPayrollExport(
  orgId: string,
  period: string,
  fileBuffer: Buffer,
  format: 'SilaeCSV' | 'PayFitCSV'
): Promise<UploadResult> {
  const supabase = createClient()
  
  const fileName = `payroll-export-${orgId}-${period}.${format.toLowerCase()}`
  const filePath = `payroll-exports/${orgId}/${fileName}`
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, fileBuffer, {
      contentType: 'text/csv',
      upsert: true
    })

  if (error) {
    throw new Error(`Failed to upload payroll export: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath)

  return {
    url: urlData.publicUrl,
    path: filePath,
    size: fileBuffer.length
  }
}

export async function uploadDocument(
  orgId: string,
  fileName: string,
  fileBuffer: Buffer,
  contentType: string
): Promise<UploadResult> {
  const supabase = createClient()
  
  const filePath = `documents/${orgId}/${fileName}`
  
  const { data, error } = await supabase.storage
    .from('documents')
    .upload(filePath, fileBuffer, {
      contentType,
      upsert: true
    })

  if (error) {
    throw new Error(`Failed to upload document: ${error.message}`)
  }

  const { data: urlData } = supabase.storage
    .from('documents')
    .getPublicUrl(filePath)

  return {
    url: urlData.publicUrl,
    path: filePath,
    size: fileBuffer.length
  }
}

export async function deleteFile(filePath: string): Promise<boolean> {
  const supabase = createClient()
  
  const { error } = await supabase.storage
    .from('documents')
    .remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    return false
  }

  return true
}






