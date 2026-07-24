import os
import logging
import threading

from app.bot import setup_bot
from app.keepalive import start_keepalive
from app.memory import load_conversation, append_message
from app.gateway import call_llm

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)


def run_telegram_bot():
    application = setup_bot()
    token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    bot_username = ""
    try:
        bot_info = application.bot.get_me()
        bot_username = bot_info.username
        logger.info(f"Bot username: @{bot_username}")
    except Exception as e:
        logger.warning(f"Could not get bot info: {e}")

    webhook_url = os.environ.get("TELEGRAM_WEBHOOK_URL", "")
    if webhook_url:
        port = int(os.environ.get("PORT", "7860"))
        webhook_path = f"/webhook/{token}"
        full_webhook = f"{webhook_url}{webhook_path}"
        application.run_webhook(
            listen="0.0.0.0",
            port=port,
            webhook_url=full_webhook,
        )
    else:
        application.run_polling(
            allowed_updates=application.updater.queue.update_types,
        )


def run_gradio_dashboard():
    try:
        import gradio as gr
    except ImportError:
        logger.warning("Gradio not installed, skipping dashboard")
        return

    def chat(message, history):
        user_id = os.environ.get("TELEGRAM_ALLOWED_USERS", "default")
        messages = []
        for user_msg, bot_msg in history:
            messages.append({"role": "user", "content": user_msg})
            messages.append({"role": "assistant", "content": bot_msg})
        messages.append({"role": "user", "content": message})
        response = call_llm(messages)
        messages.append({"role": "assistant", "content": response})
        append_message(user_id, "assistant", response)
        return response

    with gr.Blocks(title="Hermes Dashboard") as demo:
        gr.Markdown("# Hermes Agent Dashboard")
        gr.ChatInterface(fn=chat, theme="soft")

    port = int(os.environ.get("PORT", "7860"))
    demo.launch(server_name="0.0.0.0", server_port=port, share=False)


def main():
    logger.info("Hermes bot starting...")

    keepalive_stop, keepalive_thread = start_keepalive()

    telegram_thread = threading.Thread(target=run_telegram_bot, daemon=True)
    telegram_thread.start()
    logger.info("Telegram bot thread started")

    gradio_thread = threading.Thread(target=run_gradio_dashboard, daemon=True)
    gradio_thread.start()
    logger.info("Gradio dashboard thread started")

    try:
        while True:
            import time
            time.sleep(60)
    except KeyboardInterrupt:
        logger.info("Shutting down...")
        keepalive_stop.set()


if __name__ == "__main__":
    main()