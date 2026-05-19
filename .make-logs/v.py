from playwright.sync_api import sync_playwright
import time
errs=[]
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_context(viewport={'width':1280,'height':900}).new_page()
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.on('console', lambda m: errs.append('C:'+m.text) if m.type=='error' else None)
    # recherche avancee
    pg.goto(f'http://localhost:5173/explorer?x={time.time()}', wait_until='networkidle')
    pg.wait_for_timeout(2500)
    pg.locator('h2:has-text("Recherche")').first.scroll_into_view_if_needed()
    pg.wait_for_timeout(700)
    pg.screenshot(path='.make-logs/v-search.png')
    # profil (connexion)
    pg.goto('http://localhost:5173/login', wait_until='networkidle')
    pg.wait_for_timeout(700)
    pg.fill('input[name="email"]', 'demo@racines.app')
    pg.fill('input[name="password"]', 'demo1234')
    pg.click('button[type="submit"]')
    pg.wait_for_timeout(1800)
    pg.goto('http://localhost:5173/profile', wait_until='networkidle')
    pg.wait_for_timeout(1200)
    pg.screenshot(path='.make-logs/v-profile.png', full_page=True)
    b.close()
print('errors:', errs if errs else 'none')
