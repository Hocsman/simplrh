// PDF Templates for legal documents
import { DocumentPDFGenerator, formatDate, formatCurrency } from './document-generator'

// Template 1: Contrat de prestation de services
export async function generateContratPrestation(data: any): Promise<Buffer> {
  const pdf = new DocumentPDFGenerator({
    title: 'Contrat de prestation de services',
    subject: 'Contrat commercial'
  })

  // Header
  pdf.addHeader('CONTRAT DE PRESTATION DE SERVICES', `Référence : CPRES-${Date.now()}`)

  // Parties
  pdf.addSectionTitle('ENTRE LES SOUSSIGNÉS')

  pdf.addBlock('LE PRESTATAIRE', [
    data.prestataire?.nom || 'Non renseigné',
    data.prestataire?.adresse || '',
    data.prestataire?.siret ? `SIRET : ${data.prestataire.siret}` : ''
  ].filter(Boolean))

  pdf.addParagraph('Ci-après dénommé « le Prestataire »', { indent: true })
  pdf.addSpacing(15)

  pdf.addParagraph('D\'UNE PART,', { bold: true })
  pdf.addSpacing(20)

  pdf.addParagraph('ET', { bold: true })
  pdf.addSpacing(20)

  pdf.addBlock('LE CLIENT', [
    data.client?.nom || 'Non renseigné',
    data.client?.adresse || ''
  ].filter(Boolean))

  pdf.addParagraph('Ci-après dénommé « le Client »', { indent: true })
  pdf.addSpacing(15)

  pdf.addParagraph('D\'AUTRE PART,', { bold: true })
  pdf.addSpacing(30)

  // Préambule
  pdf.addSectionTitle('PRÉAMBULE')
  pdf.addParagraph(
    'Le Client souhaite confier au Prestataire la réalisation d\'une prestation de services dans le cadre de son activité professionnelle. Le Prestataire déclare disposer des compétences et des moyens nécessaires pour la bonne exécution de cette prestation.'
  )
  pdf.addSpacing(20)

  // Article 1: Objet
  pdf.addSectionTitle('ARTICLE 1 - OBJET DU CONTRAT')
  pdf.addParagraph(
    `Le présent contrat a pour objet la réalisation de la prestation suivante : ${data.prestation?.description || 'Non précisée'}`
  )
  pdf.addSpacing(20)

  // Article 2: Durée
  pdf.addSectionTitle('ARTICLE 2 - DURÉE DU CONTRAT')
  pdf.addParagraph(
    `La prestation débutera à la date de signature du présent contrat et aura une durée de : ${data.prestation?.duree || 'Non précisée'}`
  )
  pdf.addSpacing(20)

  // Article 3: Conditions financières
  pdf.addSectionTitle('ARTICLE 3 - CONDITIONS FINANCIÈRES')
  const prix = data.prestation?.prix || 0
  pdf.addParagraph(
    `En contrepartie de la prestation définie à l'article 1, le Client s'engage à verser au Prestataire la somme de ${formatCurrency(prix)} HT.`
  )
  pdf.addParagraph(
    'Le paiement sera effectué selon les modalités suivantes : 30% à la commande, 70% à la livraison.'
  )
  pdf.addSpacing(20)

  // Article 4: Obligations du Prestataire
  pdf.addSectionTitle('ARTICLE 4 - OBLIGATIONS DU PRESTATAIRE')
  pdf.addParagraph(
    'Le Prestataire s\'engage à mettre en œuvre tous les moyens nécessaires pour la bonne exécution de la prestation dans les conditions et délais convenus. Il s\'engage notamment à :'
  )
  pdf.addParagraph('• Réaliser la prestation avec diligence et professionnalisme', { indent: true })
  pdf.addParagraph('• Respecter les délais convenus', { indent: true })
  pdf.addParagraph('• Informer le Client de l\'avancement des travaux', { indent: true })
  pdf.addParagraph('• Garantir la confidentialité des informations communiquées', { indent: true })
  pdf.addSpacing(20)

  // Article 5: Obligations du Client
  pdf.addSectionTitle('ARTICLE 5 - OBLIGATIONS DU CLIENT')
  pdf.addParagraph(
    'Le Client s\'engage à :'
  )
  pdf.addParagraph('• Fournir toutes les informations nécessaires à la réalisation de la prestation', { indent: true })
  pdf.addParagraph('• Régler les sommes dues dans les délais convenus', { indent: true })
  pdf.addParagraph('• Collaborer activement avec le Prestataire', { indent: true })
  pdf.addSpacing(20)

  // Article 6: Résiliation
  pdf.addSectionTitle('ARTICLE 6 - RÉSILIATION')
  pdf.addParagraph(
    'En cas de manquement grave de l\'une des parties à ses obligations contractuelles, l\'autre partie pourra, après mise en demeure restée sans effet pendant 15 jours, résilier le contrat de plein droit.'
  )
  pdf.addSpacing(20)

  // Article 7: Litiges
  pdf.addSectionTitle('ARTICLE 7 - LITIGES')
  pdf.addParagraph(
    'Tout litige relatif à l\'interprétation ou à l\'exécution du présent contrat sera soumis aux tribunaux compétents de [VILLE].'
  )
  pdf.addSpacing(30)

  // Signatures
  pdf.addParagraph('Fait en deux exemplaires originaux,', { bold: true })
  pdf.addSpacing(10)

  pdf.addSignatureBlock(data.prestataire?.nom || 'Le Prestataire', 'Le Prestataire')
  pdf.addSignatureBlock(data.client?.nom || 'Le Client', 'Le Client')

  // Legal notice
  pdf.addLegalNotice(
    'Document généré automatiquement par SimplRH. Ce document est un modèle à adapter selon votre situation. ' +
    'Il est recommandé de le faire relire par un professionnel du droit avant signature.'
  )

  return pdf.finalize()
}

// Template 2: CGV E-commerce
export async function generateCGVEcommerce(data: any): Promise<Buffer> {
  const pdf = new DocumentPDFGenerator({
    title: 'Conditions Générales de Vente - E-commerce',
    subject: 'CGV E-commerce'
  })

  pdf.addHeader('CONDITIONS GÉNÉRALES DE VENTE', 'E-commerce')

  // Préambule
  pdf.addSectionTitle('PRÉAMBULE')
  pdf.addParagraph(
    'Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre :',
    { bold: true }
  )
  pdf.addSpacing(10)

  pdf.addBlock('LE VENDEUR', [
    data.entreprise?.nom || 'Non renseigné',
    data.entreprise?.adresse || '',
    data.entreprise?.siret ? `SIRET : ${data.entreprise.siret}` : '',
    data.entreprise?.email ? `Email : ${data.entreprise.email}` : '',
    data.entreprise?.telephone ? `Tél : ${data.entreprise.telephone}` : ''
  ].filter(Boolean))

  pdf.addParagraph(
    `Exploitant le site internet : ${data.site?.url || 'Non renseigné'}`,
    { indent: true, bold: true }
  )
  pdf.addSpacing(20)

  // Article 1: Objet
  pdf.addSectionTitle('ARTICLE 1 - OBJET')
  pdf.addParagraph(
    `Les présentes CGV régissent les ventes de ${data.site?.activite || 'produits/services'} proposés sur le site ${data.site?.url || '[site]'}.`
  )
  pdf.addSpacing(20)

  // Article 2: Prix
  pdf.addSectionTitle('ARTICLE 2 - PRIX')
  pdf.addParagraph(
    'Les prix sont indiqués en euros toutes taxes comprises (TTC). Le Vendeur se réserve le droit de modifier ses prix à tout moment, étant entendu que les produits seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.'
  )
  pdf.addSpacing(20)

  // Article 3: Commandes
  pdf.addSectionTitle('ARTICLE 3 - COMMANDES')
  pdf.addParagraph(
    'Le Client passe commande sur le site internet en suivant le processus suivant :'
  )
  pdf.addParagraph('1. Sélection des produits et ajout au panier', { indent: true })
  pdf.addParagraph('2. Validation du panier', { indent: true })
  pdf.addParagraph('3. Renseignement des informations de livraison et de facturation', { indent: true })
  pdf.addParagraph('4. Choix du mode de paiement', { indent: true })
  pdf.addParagraph('5. Acceptation des CGV et validation définitive', { indent: true })
  pdf.addSpacing(20)

  // Article 4: Paiement
  pdf.addSectionTitle('ARTICLE 4 - PAIEMENT')
  pdf.addParagraph(
    'Le paiement s\'effectue en ligne par carte bancaire ou tout autre moyen accepté sur le site. ' +
    'Le paiement est sécurisé et la transaction est cryptée. Les données bancaires ne sont pas conservées par le Vendeur.'
  )
  pdf.addSpacing(20)

  // Article 5: Livraison
  pdf.addSectionTitle('ARTICLE 5 - LIVRAISON')
  pdf.addParagraph(
    'Les produits sont livrés à l\'adresse indiquée par le Client lors de la commande. ' +
    'Les délais de livraison sont indiqués sur le site et courent à compter de la validation de la commande et du paiement.'
  )
  pdf.addParagraph(
    'En cas de retard de livraison supérieur à 7 jours ouvrés, le Client peut annuler sa commande et obtenir le remboursement des sommes versées.'
  )
  pdf.addSpacing(20)

  // Article 6: Droit de rétractation
  pdf.addSectionTitle('ARTICLE 6 - DROIT DE RÉTRACTATION')
  pdf.addParagraph(
    'Conformément à l\'article L.221-18 du Code de la consommation, le Client dispose d\'un délai de 14 jours à compter de la réception des produits pour exercer son droit de rétractation sans avoir à justifier de motifs ni à payer de pénalités.'
  )
  pdf.addParagraph(
    'Pour exercer ce droit, le Client doit notifier sa décision au Vendeur par email à l\'adresse : ' +
    (data.entreprise?.email || '[email]')
  )
  pdf.addSpacing(20)

  // Article 7: Garanties
  pdf.addSectionTitle('ARTICLE 7 - GARANTIES')
  pdf.addParagraph(
    'Tous les produits vendus bénéficient de la garantie légale de conformité (articles L.217-4 et suivants du Code de la consommation) ' +
    'et de la garantie contre les vices cachés (articles 1641 et suivants du Code civil).'
  )
  pdf.addSpacing(20)

  // Article 8: Responsabilité
  pdf.addSectionTitle('ARTICLE 8 - RESPONSABILITÉ')
  pdf.addParagraph(
    'Le Vendeur ne saurait être tenu responsable de l\'inexécution du contrat en cas de rupture de stock, indisponibilité du produit, ' +
    'ou cas de force majeure.'
  )
  pdf.addSpacing(20)

  // Article 9: Données personnelles
  pdf.addSectionTitle('ARTICLE 9 - DONNÉES PERSONNELLES')
  pdf.addParagraph(
    'Les données personnelles collectées sont nécessaires au traitement de la commande. Conformément au RGPD, ' +
    'le Client dispose d\'un droit d\'accès, de rectification, de suppression et d\'opposition concernant ses données personnelles.'
  )
  pdf.addSpacing(20)

  // Article 10: Litiges
  pdf.addSectionTitle('ARTICLE 10 - LITIGES')
  pdf.addParagraph(
    'Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée avant toute action judiciaire. ' +
    'Le Client peut recourir à une médiation de la consommation auprès des instances prévues à cet effet.'
  )
  pdf.addSpacing(30)

  // Date
  pdf.addParagraph(`Date d'entrée en vigueur : ${formatDate(new Date())}`, { bold: true })

  // Legal notice
  pdf.addLegalNotice(
    'CGV générées automatiquement par SimplRH. Ce document est un modèle à adapter selon votre activité. ' +
    'Il est recommandé de le faire relire par un professionnel du droit avant publication.'
  )

  return pdf.finalize()
}

// Template 3: Lettre de mise en demeure
export async function generateMiseEnDemeure(data: any): Promise<Buffer> {
  const pdf = new DocumentPDFGenerator({
    title: 'Lettre de mise en demeure',
    subject: 'Mise en demeure pour impayé'
  })

  pdf.addHeader('LETTRE DE MISE EN DEMEURE', 'Recommandé avec accusé de réception')

  // Expéditeur
  pdf.addBlock('EXPÉDITEUR', [
    data.expediteur?.nom || 'Non renseigné',
    data.expediteur?.adresse || ''
  ].filter(Boolean))

  pdf.addSpacing(20)

  // Destinataire
  pdf.addBlock('DESTINATAIRE', [
    data.destinataire?.nom || 'Non renseigné',
    data.destinataire?.adresse || ''
  ].filter(Boolean))

  pdf.addSpacing(30)

  // Date et lieu
  pdf.addParagraph(`Fait à ____________, le ${formatDate(new Date())}`, { bold: true })
  pdf.addSpacing(20)

  // Objet
  pdf.addField('Objet', 'Mise en demeure de payer', { bold: true })
  pdf.addSpacing(20)

  // Corps de la lettre
  pdf.addParagraph('Madame, Monsieur,', { bold: true })
  pdf.addSpacing(15)

  pdf.addParagraph(
    `Par la présente, je vous informe qu'à ce jour, je n'ai toujours pas reçu le règlement de la somme de ${formatCurrency(data.objet?.montant || 0)} ` +
    `qui m'est due au titre de : ${data.objet?.description || 'Non précisé'}.`
  )
  pdf.addSpacing(15)

  pdf.addParagraph(
    `Cette somme devait être réglée à la date du ${data.objet?.echeance ? formatDate(data.objet.echeance) : '[date]'}, ` +
    'conformément à nos accords.'
  )
  pdf.addSpacing(15)

  const delai = data.objet?.delai || 8
  pdf.addParagraph(
    `Je vous mets donc en demeure de procéder au règlement de cette somme dans un délai de ${delai} jours ` +
    `à compter de la réception de la présente lettre, soit avant le ${formatDate(new Date(Date.now() + delai * 24 * 60 * 60 * 1000))}.`
  )
  pdf.addSpacing(15)

  pdf.addParagraph(
    'Le règlement devra être effectué par virement bancaire ou par chèque à l\'ordre de : ' +
    (data.expediteur?.nom || '[nom]')
  )
  pdf.addSpacing(15)

  pdf.addParagraph(
    'À défaut de règlement dans le délai imparti, je me verrai contraint d\'engager une procédure judiciaire à votre encontre, ' +
    'sans autre préavis. Les frais de justice et les intérêts de retard seront à votre charge.'
  )
  pdf.addSpacing(15)

  pdf.addParagraph(
    'Je reste à votre disposition pour toute information complémentaire.'
  )
  pdf.addSpacing(30)

  // Formule de politesse
  pdf.addParagraph(
    'Veuillez agréer, Madame, Monsieur, l\'expression de mes salutations distinguées.'
  )
  pdf.addSpacing(40)

  // Signature
  pdf.addSignatureBlock(data.expediteur?.nom || 'L\'expéditeur')

  // Legal notice
  pdf.addLegalNotice(
    'Lettre générée automatiquement par SimplRH. Ce document est un modèle à adapter selon votre situation. ' +
    'Il est recommandé de consulter un professionnel du droit pour vous assurer de sa validité juridique.'
  )

  return pdf.finalize()
}
