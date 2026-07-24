import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

from app.gateway import call_llm
from app.memory import append_message, load_conversation, clear_memory

logger = logging.getLogger(__name__)

ALLOWED_USERS = set()
GATEWAY_PASSWORD = os.environ.get("GATEWAY_PASSWORD", "")


def _is_allowed(user_id):
    if not ALLOWED_USERS:
        return True
    return user_id in ALLOWED_USERS


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not _is_allowed(user_id):
        await update.message.reply_text("Access denied.")
        return
    await update.message.reply_text(
        "Hermes bot is active. Send me any message and I will respond."
    )


async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not _is_allowed(user_id):
        await update.message.reply_text("Access denied.")
        return

    user_text = update.message.text
    if not user_text:
        return

    await update.message.reply_text("Thinking...")

    history = load_conversation(user_id)
    messages = history.get("conversation", [])
    messages.append({"role": "user", "content": user_text})

    response = call_llm(messages)

    messages.append({"role": "assistant", "content": response})
    append_message(user_id, "assistant", response)

    await update.message.reply_text(response)


async def clear(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not _is_allowed(user_id):
        await update.message.reply_text("Access denied.")
        return
    clear_memory(user_id)
    await update.message.reply_text("Memory cleared.")


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.effective_user.id
    if not _is_allowed(user_id):
        await update.message.reply_text("Access denied.")
        return
    history = load_conversation(user_id)
    count = len(history.get("conversation", []))
    await update.message.reply_text(f"Memory entries: {count}")


def setup_bot():
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not token:
        raise ValueError("TELEGRAM_BOT_TOKEN is not set")

    application = Application.builder().token(token).build()

    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("clear", clear))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    return application