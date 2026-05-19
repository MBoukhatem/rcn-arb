from playwright.sync_api import sync_playwright
import time
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_context(viewport={'width':1280,'height':900}).new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
    pg.goto(f'http://localhost:5173/explorer?x={time.time()}', wait_until='networkidle')
    pg.wait_for_timeout(1000)
    for L in ['ك','ت','ب']:
        pg.locator('button', has_text=L).first.click()
        pg.wait_for_timeout(300)
    pg.wait_for_timeout(2000)
    pg.screenshot(path='.make-logs/n-explorer.png', full_page=True)
    b.close()
print('errors:', errs if errs else 'none')
