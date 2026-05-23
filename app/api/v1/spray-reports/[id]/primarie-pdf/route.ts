import { verifySession, errUnauthorized } from '@/app/api/v1/_mock/auth'

export async function GET() {
  const session = await verifySession()
  if (!session) return errUnauthorized()
  // Return a minimal PDF bytes response
  const minimalPdf = '%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n190\n%%EOF'
  return new Response(minimalPdf, {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="notificare-primarie.pdf"' }
  })
}
