import os
import logging
import uvicorn
import asyncio
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, PlainTextResponse
from fastapi.templating import Jinja2Templates

from src.bot import build_bot, setup_handlers, run_bot
from src.keepalive import keep_alive

logger = logging.getLogger(__name__)
PORT = int(os.getenv("PORT", 7860))
SPACE_ID = os.getenv("SPACE_ID")
GATEWAY_TOKEN = os.getenv("GATEWAY_TOKEN", "")
templates = Jinja2Templates(directory="templates")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting HermesBot...")
    bot_task = asyncio.create_task(run_bot())
    yield
    logger.info("Shutting down...")
    bot_task.cancel()
    try:
        await bot_task
    except asyncio.CancelledError:
        pass


app = FastAPI(title="HermesBot", lifespan=lifespan)


@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/ping")
async def ping():
    keep_alive()
    return PlainTextResponse("OK")


@app.post("/webhook")
async def webhook(request: Request):
    return PlainTextResponse("Not configured", status_code=501)


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT)
