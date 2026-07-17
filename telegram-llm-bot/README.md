# Telegram Tea Bot (Cloudflare Workers)

ربات تلگرامی که با مدل `kilo-auto/free` از طریق Kilo Gateway چت می‌کنه و شخصیت یک فنجان چای خوش‌عطر دارد.

## پیش‌نیازها

- Node.js + npm
- حساب Cloudflare (رایگان)
- یه Bot Token از [@BotFather](https://t.me/BotFather)
- API Key از Kilo Gateway

## راه‌اندازی

### ۱. نصب وابستگی‌ها

```bash
cd telegram-llm-bot
npm install
```

### ۲. تنظیم متغیرهای محیطی

فایل `.env` را با اطلاعات خود پر کنید:

```bash
cp .env.example .env
```

### ۳. دیپلوی

```bash
# تنظیم secrets (هرگز توی wrangler.toml ننویس!)
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put LLM_API_KEY

# دیپلوی
npx wrangler deploy
```

یا با اسکریپت دیپلوی:

```bash
BOT_TOKEN=... LLM_API_KEY=... ./deploy.sh
```

### ۴. ست کردن Webhook

بعد از دیپلوی، URL Worker را بگیرید و webhook را تنظیم کنید:

```
https://<your-worker>.workers.dev/setup?url=https://<your-worker>.workers.dev
```

## توسعه محلی

```bash
npm run dev
```

## نکته Timeout

Worker معمولی ۱۰ ثانیه محدودیت داره. اگه مدل کنده یا پاسخ طولانی میده
و خطای timeout گرفتی، باید بری سراغ Queue + Queue Consumer (بی‌نهایت timeout).
برای همین کار `/setup` جدا نگه داشته شده که webhook همیشه سریع جواب بده.
