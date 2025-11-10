// Factur-X XML generation utilities
// This is a simplified implementation for demo purposes

export interface FacturXData {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  customer: {
    name: string
    address: string
    siret?: string
  }
  supplier: {
    name: string
    address: string
    siret: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    vatRate: number
    total: number
  }>
  totalHT: number
  totalVAT: number
  totalTTC: number
}

// Alias for compatibility
export type FacturXInvoiceData = FacturXData

export function generateFacturXXML(data: FacturXData): string {
  // Simplified Factur-X XML generation
  // In a real implementation, this would generate a complete Factur-X compliant XML
  return `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <ID>${data.invoiceNumber}</ID>
  <IssueDate>${data.invoiceDate}</IssueDate>
  <DueDate>${data.dueDate}</DueDate>
  <BuyerParty>
    <PartyName>${data.customer.name}</PartyName>
    <PostalAddress>
      <StreetName>${data.customer.address}</StreetName>
    </PostalAddress>
  </BuyerParty>
  <SellerParty>
    <PartyName>${data.supplier.name}</PartyName>
    <PostalAddress>
      <StreetName>${data.supplier.address}</StreetName>
    </PostalAddress>
  </SellerParty>
  <LegalMonetaryTotal>
    <LineExtensionAmount>${data.totalHT.toFixed(2)}</LineExtensionAmount>
    <TaxExclusiveAmount>${data.totalHT.toFixed(2)}</TaxExclusiveAmount>
    <TaxInclusiveAmount>${data.totalTTC.toFixed(2)}</TaxInclusiveAmount>
  </LegalMonetaryTotal>
</Invoice>`
}

export function validateFacturXData(data: FacturXData): boolean {
  return !!(
    data.invoiceNumber &&
    data.invoiceDate &&
    data.customer.name &&
    data.supplier.name &&
    data.items.length > 0
  )
}
