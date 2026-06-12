# Deployment Guide — AWS EC2 + Nginx + PM2

This guide deploys the backend (Express) and frontend (Next.js) on a single
Ubuntu EC2 instance, with Nginx as a reverse proxy and PM2 managing both
Node processes.

## 1. Launch EC2 Instance

- Ubuntu 22.04 LTS, t3.small or larger.
- Open inbound ports: 22 (SSH), 80 (HTTP), 443 (HTTPS).

## 2. Install Dependencies

```bash
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx postgresql postgresql-contrib
sudo npm install -g pm2
```

## 3. Set Up PostgreSQL

```bash
sudo -u postgres psql -c "CREATE DATABASE rajputi_fashion;"
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'your-secure-password';"
```

## 4. Deploy the Backend

```bash
git clone <your-repo-url> /var/www/rajputi
cd /var/www/rajputi/backend
cp .env.example .env
# edit .env: set DATABASE_URL, JWT_SECRET, CORS_ORIGIN=https://yourdomain.com

npm install
npx prisma migrate deploy
npx prisma db seed
npm run build

pm2 start dist/server.js --name rajputi-backend
```

## 5. Deploy the Frontend

```bash
cd /var/www/rajputi/frontend
cp .env.local.example .env.local
# edit .env.local: NEXT_PUBLIC_API_URL=https://yourdomain.com/api

npm install
npm run build

pm2 start npm --name rajputi-frontend -- start
```

## 6. Persist PM2 across reboots

```bash
pm2 save
pm2 startup
```

## 7. Configure Nginx Reverse Proxy

Create `/etc/nginx/sites-available/rajputi`:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location /api/ {
        proxy_pass http://localhost:4000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads/ {
        proxy_pass http://localhost:4000/uploads/;
    }

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/rajputi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## 8. HTTPS with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## 9. Updating the App

```bash
cd /var/www/rajputi && git pull

cd backend && npm install && npx prisma migrate deploy && npm run build && pm2 restart rajputi-backend

cd ../frontend && npm install && npm run build && pm2 restart rajputi-frontend
```
