import { NextRequest, NextResponse } from 'next/server'
import { requireOrganization } from '@/domains/core/auth'
import { generatePayrollExport } from '@/domains/people/payroll'
import { uploadPayrollExport } from '@/lib/storage'
import { z } from 'zod'

const exportSchema = z.object({
  period: z.string().regex(/^\d{4}-\d{2}$/, 'Format de période invalide (YYYY-MM)'),
  format: z.enum(['SilaeCSV', 'PayFitCSV'])
})

export async function POST(request: NextRequest) {
  try {
    const org = await requireOrganization()
    const body = await request.json()
    
    const { period, format } = exportSchema.parse(body)
    
    // Generate payroll export
    const { export: payrollExport, csvContent } = await generatePayrollExport(
      org.id,
      period,
      format
    )
    
    // Upload CSV to storage
    const csvBuffer = Buffer.from(csvContent, 'utf-8')
    const upload = await uploadPayrollExport(org.id, period, csvBuffer, format)
    
    // Update export record with file path
    const { updatePayrollExportFilePath } = await import('@/domains/people/payroll')
    await updatePayrollExportFilePath(payrollExport.id, upload.path)
    
    return NextResponse.json({
      ...payrollExport,
      file_path: upload.path,
      download_url: upload.url,
      csv_content: csvContent // For immediate download
    })
  } catch (error: any) {
    console.error('Payroll export error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate payroll export' },
      { status: 400 }
    )
  }
}







