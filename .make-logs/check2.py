from playwright.sync_api import sync_playwright
import time
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    for path in ['','explorer','profile']:
        pg=b.new_context(viewport={'width':1280,'height':900}).new_page()
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(f'http://localhost:5173/{path}?x={time.time()}', wait_until='networkidle')
        pg.wait_for_timeout(1000)
        name = path or 'home'
        pg.screenshot(path=f'.make-logs/v-{name}.png', full_page=True)
        pg.close()
    b.close()
print('errors:', errs if errs else 'none')
