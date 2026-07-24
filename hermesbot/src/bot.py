import logging
import os
from typing import Optional

from telegram import Update
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    filters,
    CallbackContext,
)

from src.gateway import HermesGatewayClient
from src.memory import Memory
from src.keepalive import keep_alive

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

TELEGRAM_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
if not TELEGRAM_TOKEN:
    raise RuntimeError("TELEGRAM_BOT_TOKEN must be set")
ALLOWED_USERS = set(
    int(x.strip())
    for x in os.getenv("TELEGRAM_ALLOWED_USERS", "").split(",")
    if x.strip()
)

gateway = HermesGatewayClient()
memory = Memory()


def is_allowed(user_id: int) -> bool:
    return user_id in ALLOWED_USERS


async def start(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    if not is_allowed(user_id):
        await update.message.reply_text("Unauthorized")
        return
    await update.message.reply_text(
        "Hermes سرویس فعال است.\n"
        "پیام خود را بفرستید."
    )


async def handle_message(update: Update, context: CallbackContext):
    user_id = update.effective_user.id
    if not is_allowed(user_id):
        await update.message.reply_text("Unauthorized")
        return

    user_text = update.message.text
    if not user_text:
        await update.message.reply_text("لطفاً متن بفرستید.")
        return

    status_msg = await update.message.reply_text("در حال پاسخ دادن...")

    try:
        messages = [{"role": "user", "content": user_text}]
        response = await gateway.chat(messages)
        await status_msg.edit_text(response)
        memory.remember(user_id, messages)
    except Exception as e:
        logger.error(f" chat failed: {e}")
        await status_msg.edit_text(
            f"خطا: {e}\n\n"
            "دوباره تلاش کنید."
        )


def build_bot() -> "ApplicationBuilder":
    if not TELEGRAM_TOKEN:
        raise RuntimeError("TELEGRAM_BOT_TOKEN missing")
    return ApplicationBuilder().token(TELEGRAM_TOKEN)


def setup_handlers(application):
    application.add_handler(CommandHandler("start", start))
    application.add_handler(
        MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message)
    )


async def run_bot():
    keep_alive()
    app = build_bot().build()
    setup_handlers(app)
    logger.info("Bot starting...")
    await app.initialize()
    await app.start()
    await app.updater.start_polling(drop_pending_updates=True)
