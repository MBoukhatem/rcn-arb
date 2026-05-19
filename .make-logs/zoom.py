from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_context(viewport={'width':1280,'height':900},device_scale_factor=2).new_page()
    pg.goto(f'http://localhost:5173/?x={time.time()}', wait_until='networkidle')
    pg.evaluate("document.documentElement.classList.add('dark')")
    pg.wait_for_timeout(1500)
    for y in range(0,3500,350):
        pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(120)
    pg.evaluate('window.scrollTo(0,0)'); pg.wait_for_timeout(500)
    pg.screenshot(path='.make-logs/top-dark.png')          # viewport haut
    pg.evaluate('window.scrollTo(0,document.body.scrollHeight)')
    pg.wait_for_timeout(600)
    pg.screenshot(path='.make-logs/bottom-dark.png')       # viewport bas
    b.close()
print('ok')
