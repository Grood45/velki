# Velki Project

This is the Velki project repository.

## Get Started

### 1. Install Dependencies
You need to install dependencies for both the server (backend) and client (frontend).

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

---

### 2. Run the Project
Open two terminals to run the backend and frontend simultaneously.

**Terminal 1 (Backend):**
```bash
cd server
npm start
```
*The server will start on port 5001.*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*The client will start on http://localhost:5173.*

---

## Admin Access & Credentials

To access the Admin Panel, follow these details:

- **Admin Login Page**: [http://localhost:5173/admin](http://localhost:5173/admin)
- **Mother Admin Page**: [http://localhost:5173/motheradmin](http://localhost:5173/motheradmin)

### Default Mother Admin Credentials:
These credentials give you full access to the system.

- **Username**: `motheradmin`
- **Password**: `password123`

---

## Troubleshooting

- **Database**: Ensure your MongoDB connection string in `server/.env` is correct.
- **Login fails?**: Check if `JWT_SECRET` is present in `server/.env`.

---

## Deploying to AWS EC2 (Single App Setup)

This guide explains how to host both the Backend (Node.js) and Frontend (Vite/React) together as a **single application** on an AWS EC2 instance. The Express backend will serve the static React frontend files directly, so Nginx is only used as a simple reverse proxy.

### Step 1: Set up the AWS EC2 Instance
1. Go to your AWS Console and launch a new **EC2 Instance** (Ubuntu 22.04 LTS is recommended).
2. Create or select a **Key Pair** (.pem file) so you can SSH into the server.
3. In **Network Settings**, make sure to **Allow SSH traffic**, **Allow HTTP traffic**, and **Allow HTTPS traffic**.
4. Once running, connect to your server using SSH:
   ```bash
   ssh -i /path/to/your-key.pem ubuntu@your-ec2-ip
   ```

### Step 2: Install Required Server Software
Run these commands on your EC2 instance to install Node.js, npm, PM2, and Nginx:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install curl git nginx -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g pm2
```

### Step 3: Clone Code and Set Up Environment Variables (.env)
1. Clone this project repository into your home folder (`/home/ubuntu/`).
2. You need to configure `.env` in both the `server` and `client` directories.

#### 1. Server `.env` (`server/.env`)
Create the file: `nano server/.env`
```env
# Your MongoDB connection string
DB_URI=mongodb+srv://<your_user>:<your_password>@cluster0.mongodb.net/velki-main
PORT=5001

# The frontend domain URL without protocol (E.g. example.com)
SITE_URL=your-domain.com

# JWT Secret key for user sessions
JWT_SECRET=supersecretkey123!@#

# KingExchange API Keys (if applicable/provided by vendor)
KINGEXCH_API_KEY=your_key_here
KINGEXCH_API_URL=https://api.kingexchange.example
```

#### 2. Client `.env` (`client/.env`)
Create the file: `nano client/.env`
```env
# Point this to your backend server URL (can be your domain name with the backend port, or ideally your domain name directly if proxied)
VITE_BASE_API_URL=http://your-ec2-ip:5001
```

### Step 4: Build Frontend and Start Backend

Since the backend is configured to serve the frontend directly, you only need to run the Node.js server.
```bash
# First, build the frontend
cd ~/your-repo-folder/client
npm install
npm run build

# Then, start the backend with PM2
cd ~/your-repo-folder/server
npm install
pm2 start index.js --name "velki-app"
pm2 save
pm2 startup
```

### Step 5: Configure Nginx (Reverse Proxy)
Nginx will expose port 80 (HTTP) to the public internet and forward all traffic to your Node.js backend.

1. Open the default Nginx config:
```bash
sudo nano /etc/nginx/sites-available/default
```

2. Replace the contents with the following:
```nginx
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:5001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. Save the file (`Ctrl+O`, `Enter`, `Ctrl+X`) and restart Nginx:
```bash
sudo systemctl restart nginx
```

### Step 6: KingExchange (kingexch) Integration Details
1. **API Keys**: Make sure you get the proper `Merchant ID`, `Secret Key`, and `API Endpoint` from the KingExchange provider. 
2. **Environment File**: Add these precisely as requested into your MongoDB database configuration or your `server/.env`.
3. **Whitelist IP**: KingExchange **requires your server IP to be whitelisted** on their end. Log into the KingExchange Admin/Vendor portal and add your **AWS EC2 Public IP address** to their whitelist. If you don't do this, KingExchange will reject all API requests from your server with a CORS or 401 Unauthorized error!

That's it! Your site should now be live on your EC2 Public IP Address.
