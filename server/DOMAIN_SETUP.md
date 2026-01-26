# 🌐 Setting Up Your Own Domain with Mailgun

Currently your emails are sent from: `noreply@sandbox35e13be1d96a4562b4e2444c7760dd39.mailgun.org`

To send from your own domain (e.g., `contact@paulmallner.com`), follow these steps:

## 📋 Prerequisites
You need to own a domain. If you don't have one, you can:
- Buy one from Namecheap, GoDaddy, etc. (~$10-15/year)
- Get a free one from Freenom (.tk, .ml, .ga domains)
- Use a subdomain if you have any existing domain

## 🚀 Step-by-Step Setup

### 1. Add Domain to Mailgun
1. Go to [Mailgun Dashboard](https://app.mailgun.com/app/sending/domains)
2. Click **"Add New Domain"**
3. Enter your domain (e.g., `paulmallner.com` or `mail.paulmallner.com`)
4. Select **"Create DKIM Authority"** (recommended for better deliverability)
5. Click **"Add Domain"**

### 2. Configure DNS Records
Mailgun will show you DNS records to add. They'll look like this:

```
Type: TXT
Name: @
Value: v=spf1 include:mailgun.org ~all

Type: TXT  
Name: smtp._domainkey
Value: k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA... (long DKIM key)

Type: CNAME
Name: email
Value: mailgun.org

Type: MX
Name: @
Value: 10 mxa.mailgun.org
       10 mxb.mailgun.org
```

### 3. Add DNS Records to Your Domain
**Where to add these depends on your domain provider:**

#### Namecheap:
1. Login → Domain List → Manage → Advanced DNS
2. Add each record as shown above

#### GoDaddy:
1. Login → My Products → DNS → Manage Zones
2. Add each record type

#### Cloudflare:
1. Login → Select Domain → DNS → Records
2. Add each record

#### Other providers:
Look for "DNS Management", "DNS Records", or "Advanced DNS"

### 4. Verify Domain
1. After adding DNS records, wait 15-30 minutes
2. Go back to Mailgun → Domain Settings
3. Click **"Verify DNS Settings"**
4. If successful, you'll see green checkmarks ✅

**Note:** DNS propagation can take up to 48 hours, but usually works within 1 hour.

### 5. Update Your Server Configuration
Once verified, update your `.env` file:

```bash
# Change from:
MAILGUN_DOMAIN=sandbox35e13be1d96a4562b4e2444c7760dd39.mailgun.org

# To:
MAILGUN_DOMAIN=paulmallner.com
# or
MAILGUN_DOMAIN=mail.paulmallner.com
```

### 6. Restart Server and Test
```bash
npm start
npm run test-email
```

## 🎯 Benefits of Your Own Domain

✅ **Professional Emails**: `contact@paulmallner.com` instead of sandbox  
✅ **No Recipient Limits**: Send to anyone, not just authorized recipients  
✅ **Better Deliverability**: Less likely to be marked as spam  
✅ **Brand Recognition**: Emails come from your domain  
✅ **Custom Sender Names**: "Paul Wallner - Portfolio" instead of "Portfolio Contact (Sandbox)"

## 🆓 Free Domain Options

If you don't want to buy a domain:

1. **Freenom** (freenom.com) - Free .tk, .ml, .ga domains
2. **GitHub Pages** - Use yourname.github.io (if you have GitHub)
3. **Netlify** - Free subdomain with hosting

## 🔧 Troubleshooting

**DNS Records Not Verifying?**
- Wait longer (up to 48 hours)
- Double-check record values (no extra spaces)
- Use DNS checker tools like whatsmydns.net

**Still Getting Sandbox Emails?**
- Make sure you updated the `.env` file
- Restart your server
- Check the domain name is exactly as verified in Mailgun

**Need Help?**
- Mailgun has excellent documentation
- Most domain providers have DNS setup guides
- Feel free to ask for help with your specific domain provider

---

**Current Status:** ✅ Sandbox working, ready to upgrade to custom domain!