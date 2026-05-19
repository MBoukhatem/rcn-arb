from playwright.sync_api import sync_playwright
import time
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    # explorer avec une racine sélectionnée
    for theme in ('light','dark'):
        pg=b.new_context(viewport={'width':1280,'height':900}).new_page()
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('console', lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
        pg.goto(f'http://localhost:5173/explorer?x={time.time()}', wait_until='networkidle')
        pg.evaluate(f"document.documentElement.classList.{'add' if theme=='dark' else 'remove'}('dark')")
        pg.wait_for_timeout(1000)
        # sélectionner les 3 lettres ك ت ب via les slots
        slots = pg.locator('button:has-text("ك"), button:has-text("ت"), button:has-text("ب")')
        pg.screenshot(path=f'.make-logs/x-explorer-{theme}.png', full_page=True)
        pg.close()
    b.close()
print('errors:', errs if errs else 'none')
