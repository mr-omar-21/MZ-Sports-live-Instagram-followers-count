import re
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from playwright.async_api import async_playwright

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

browser = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global browser
    p = await async_playwright().start()
    browser = await p.chromium.launch(
        headless=True,
        args=["--no-sandbox", "--disable-setuid-sandbox"],
    )
    logger.info("Browser launched")
    yield
    await browser.close()
    await p.stop()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/followers")
async def get_followers(username: str = Query("mzsports_tz")):
    global browser
    if not browser:
        return {"error": "Browser not ready"}, 503

    try:
        page = await browser.new_page()
        await page.goto(f"https://www.instagram.com/{username}/", timeout=30000)
        await page.wait_for_timeout(5000)

        html = await page.content()
        await page.close()

        match = re.search(
            r'<meta\s+[^>]*property="og:description"[^>]*content="([^"]*)"',
            html,
        )
        if not match:
            return {"error": "og:description not found"}, 502

        f_match = re.search(r"([\d,]+)\s*Followers", match.group(1), re.I)
        if not f_match:
            return {"error": "could not parse count"}, 502

        count = int(f_match.group(1).replace(",", ""))
        return {"count": count, "username": username, "source": "playwright"}

    except Exception as e:
        logger.exception("Scrape failed")
        return {"error": str(e)}, 502


@app.get("/health")
async def health():
    return {"ok": browser is not None}
