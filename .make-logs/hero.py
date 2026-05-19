from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_context(viewport={'width':1280,'height':1100},device_scale_factor=2).new_page()
    pg.goto(f'http://localhost:5173/?x={time.time()}', wait_until='networkidle')
    pg.wait_for_timeout(1500)
    pg.locator('section').first.screenshot(path='.make-logs/hero-z.png')
    b.close()
print('ok')
