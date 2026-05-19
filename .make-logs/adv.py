from playwright.sync_api import sync_playwright
import time
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_context(viewport={'width':1280,'height':900}).new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
    pg.goto(f'http://localhost:5173/explorer?x={time.time()}', wait_until='networkidle')
    pg.wait_for_timeout(2500)
    pg.locator('h2:has-text("Recherche")').first.scroll_into_view_if_needed()
    pg.wait_for_timeout(800)
    pg.screenshot(path='.make-logs/adv1.png')
    pg.locator('button:has-text("Verbe")').first.click()
    pg.wait_for_timeout(1500)
    pg.locator('h2:has-text("Recherche")').first.scroll_into_view_if_needed()
    pg.wait_for_timeout(500)
    pg.screenshot(path='.make-logs/adv2.png')
    b.close()
print('errors:', errs if errs else 'none')
