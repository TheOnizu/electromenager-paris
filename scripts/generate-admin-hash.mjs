#!/usr/bin/env node
/**
 * Génère le hash bcrypt du mot de passe admin.
 * Usage : node scripts/generate-admin-hash.mjs [mot-de-passe]
 *
 * Copiez la valeur ADMIN_PASSWORD_HASH dans votre .env ou .env.docker
 */
import bcrypt from 'bcryptjs'
import { createInterface } from 'node:readline'

const arg = process.argv[2]

async function hash(password) {
  const h = await bcrypt.hash(password, 12)
  console.log('\n✅ Hash généré :\n')
  console.log(`ADMIN_PASSWORD_HASH=${h}`)
  console.log('\nCopiez cette ligne dans votre fichier .env ou .env.docker\n')
}

if (arg) {
  await hash(arg)
}
else {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  rl.question('Entrez le mot de passe admin : ', async (pw) => {
    rl.close()
    if (!pw || pw.length < 8) {
      console.error('❌ Le mot de passe doit faire au moins 8 caractères.')
      process.exit(1)
    }
    await hash(pw)
  })
}
