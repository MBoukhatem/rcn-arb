from playwright.sync_api import sync_playwright
import time
with sync_playwright() as p:
    b=p.chromium.launch(headless=True)
    pg=b.new_context(viewport={'width':1000,'height':780},device_scale_factor=1).new_page()
    pg.goto('http://localhost:5173/login', wait_until='networkidle')
    pg.wait_for_timeout(700)
    pg.fill('input[name="email"]', 'demo@racines.app')
    pg.fill('input[name="password"]', 'demo1234')
    pg.click('button[type="submit"]')
    pg.wait_for_timeout(1800)
    pg.goto('http://localhost:5173/profile', wait_until='networkidle')
    pg.wait_for_timeout(1300)
    pg.screenshot(path='.make-logs/p-prof.png')
    b.close()
print('ok')
