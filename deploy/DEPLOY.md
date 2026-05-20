# Déploiement sur Hetzner VPS

## Prérequis

- VPS Hetzner (CAX11 ou supérieur) sous Ubuntu 24.04
- Domaine pointant vers l'IP du VPS (enregistrement A)
- Accès SSH root

---

## 1. Préparation du serveur

```bash
# Mise à jour
apt update && apt upgrade -y

# Dépendances
apt install -y nginx certbot python3-certbot-nginx git curl

# Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt install -y nodejs

# pnpm
npm install -g pnpm pm2
```

---

## 2. Cloner le projet

```bash
cd /var/www
git clone https://github.com/TheOnizu/electromenager-paris.git
cd electromenager-paris
pnpm install
```

---

## 3. Variables d'environnement

```bash
cp .env.example .env
nano .env   # Remplir toutes les valeurs
```

Générer le hash du mot de passe admin :
```bash
node scripts/generate-admin-hash.mjs
# Copier ADMIN_PASSWORD_HASH= dans .env
```

---

## 4. Base de données Supabase

1. Créer un projet sur [supabase.com](https://supabase.com) (gratuit)
2. Dans l'éditeur SQL, exécuter `supabase/schema.sql` puis `supabase/seed.sql`
3. Copier `SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY` dans `.env`

---

## 5. Build Nuxt

```bash
pnpm build
```

---

## 6. PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # Suivre les instructions affichées
```

---

## 7. Nginx + SSL

```bash
# Copier la config
cp deploy/nginx.conf /etc/nginx/sites-available/electromenager-paris
# Remplacer votre-domaine.fr par votre vrai domaine
sed -i 's/votre-domaine.fr/monsite.fr/g' /etc/nginx/sites-available/electromenager-paris

ln -s /etc/nginx/sites-available/electromenager-paris /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Certificat SSL
certbot --nginx -d monsite.fr -d www.monsite.fr
```

---

## 8. Cron job (relance avis)

```bash
crontab -e
# Ajouter :
0 9 * * * curl -s -H "x-cron-secret: VOTRE_CRON_SECRET" https://monsite.fr/api/cron/review-requests
```

---

## Mise à jour

```bash
cd /var/www/electromenager-paris
git pull
pnpm install
pnpm build
pm2 restart electromenager-paris
```
