# Telegram LLM Bot (Cloudflare Workers)

ربات تلگرامی که با یه مدل OpenAI-compatible (از طریق Kilo/Gateway) چت می‌کنه.
System prompt رو می‌تونی راحت از متغیر محیطی تغییر بدی.

## پیش‌نیازها

- Node.js + npm
- حساب Cloudflare (رایگان)
- یه Bot Token از [@BotFather](https://t.me/BotFather)
- Base URL و API Key از gateway اوپن‌آی-کامپتیبل

## راه‌اندازی

```bash
cd telegram-llm-bot
npm install -g wrangler     # یا: npm i -D wrangler

# secret ها (هرگز توی wrangler.toml ننویس!):
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put LLM_API_KEY

# متغیرهای عمومی: LLM_BASE_URL رو ست کن (مثلا توی wrangler.toml یا):
npx wrangler secret put LLM_BASE_URL
```

## تغییر System Prompt

فقط کافیه مقدار `SYSTEM_PROMPT` رو توی `wrangler.toml` (زیر `[vars]`) عوض کنی
و دوباره دیپلوی کنی:

```toml
[vars]
SYSTEM_PROMPT = "تو یه دستیار فارسی‌زبان هستی و لحن صمیمی داری."
MODEL = "gpt-4o-mini"
```

برای تغییر بدون دیپلوی، می‌تونی از `npx wrangler secret put SYSTEM_PROMPT` استفاده کنی.

## دیپلوی

```bash
npx wrangler deploy
```

خروجی یه URL مثل `https://telegram-llm-bot.<sub>.workers.dev` میده.

## ست کردن Webhook

یه بار این رو بزن (URL رو با آدرس Worker خودت عوض کن):

```
https://telegram-llm-bot.<sub>.workers.dev/setup?url=https://telegram-llm-bot.<sub>.workers.dev
```

حالا توی تلگرام به ربات پیام بده، جواب می‌گیری.

## نکته Timeout

Worker معمولی ۱۰ ثانیه محدودیت داره. اگه مدل کنده یا پاسخ طولانی میده
و خطای timeout گرفتی، باید بری سراغ Queue + Queue Consumer (بی‌نهایت timeout).
برای همین کار `/setup` جدا نگه داشته شده که webhook همیشه سریع جواب بده.
