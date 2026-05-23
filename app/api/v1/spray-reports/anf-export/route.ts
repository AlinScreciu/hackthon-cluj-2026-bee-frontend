import { verifySession, errUnauthorized, errBadRequest } from '@/app/api/v1/_mock/auth'
import { sprayReports, getUserById } from '@/app/api/v1/_mock/data'

export async function POST(req: Request) {
  const session = await verifySession()
  if (!session) return errUnauthorized()

  const body = await req.json().catch(() => ({}))
  const farmerId = session.role === 'inspector' && body.farmer_id ? body.farmer_id : session.sub
  const from = body.from ?? '2023-01-01'
  const to = body.to ?? new Date().toISOString().substring(0, 10)

  if (!from || !to) {
    return errBadRequest('validation_failed', 'Câmpurile from și to sunt obligatorii.')
  }

  const farmer = getUserById(farmerId)
  const reports = Array.from(sprayReports.values())
    .filter(r => r.farmer_id === farmerId)
    .filter(r => r.created_at >= from && r.created_at <= to + 'T23:59:59Z')
    .sort((a, b) => a.created_at.localeCompare(b.created_at))

  const lines = reports.map((r, i) =>
    `${i + 1}. ${r.created_at.substring(0, 10)} | ${r.parcel.name} | ${r.substance} (${r.toxicity}) | ${r.surface_ha} ha | ${r.crop} | Ledger: ${r.ledger_hash}`
  ).join('\n')

  const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/MediaBox[0 0 595 842]/Parent 2 0 R/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 500>>
stream
BT /F1 12 Tf 50 800 Td
(REGISTRU ANF - RADARUL ALBINELOR) Tj
0 -20 Td (Fermier: ${farmer?.full_name ?? farmerId}) Tj
0 -20 Td (Perioada: ${from} - ${to}) Tj
0 -20 Td (Total rapoarte: ${reports.length}) Tj
0 -30 Td (Rapoarte stropire:) Tj
0 -20 Td (${lines.substring(0, 200)}) Tj
0 -40 Td (Generat de Radarul Albinelor la ${new Date().toISOString()}) Tj
ET
endstream
endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
trailer<</Size 6/Root 1 0 R>>
startxref 0
%%EOF`

  return new Response(pdfContent, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="registru-anf-${farmerId}-${from}-${to}.pdf"`,
    },
  })
}
