#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Configuration de SimplRH...');

// Vérifier si .env.local existe
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ Fichier .env.local manquant');
  console.log('📝 Copiez .env.example vers .env.local et configurez vos variables');
  process.exit(1);
}

console.log('✅ Configuration terminée !');
console.log('');
console.log('📚 Prochaines étapes :');
console.log('1. Configurez votre base Supabase');
console.log('2. Lancez le serveur : npm run dev');
console.log('3. Ouvrez http://localhost:3000');