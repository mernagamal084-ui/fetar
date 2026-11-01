import { chromium } from 'playwright';
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('dist'); const shim = fs.readFileSync('test/gsap-shim.js','utf8');
const srv = http.createServer((q,r)=>{ let f=path.join(root,q.url==='/'?'index.html':q.url.split('?')[0]); fs.readFile(f,(e,d)=>{ if(e){r.writeHead(404);r.end();return;} r.writeHead(200,{'content-type':f.endsWith('.html')?'text/html':f.endsWith('.webp')?'image/webp':'text/plain'}); r.end(d);});}).listen(8124);
const mob = process.argv[2]==='mob';
const b = await chromium.launch(); const ctx = await b.newContext({viewport: mob?{width:390,height:844}:{width:1440,height:900}, hasTouch:mob, isMobile:mob, permissions:['clipboard-read','clipboard-write']});
const pg = await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/cdnjs.*gsap\.min\.js/, r=>r.fulfill({contentType:'text/javascript',body:shim}));
await pg.route(/cdnjs.*ScrollTrigger\.min\.js/, r=>r.fulfill({contentType:'text/javascript',body:''}));
await pg.route(/fonts\.(googleapis|gstatic)/, r=>r.abort());
await pg.goto('http://localhost:8124/'); await pg.waitForTimeout(3300);
const ok=(n,c)=>console.log((c?'PASS ':'FAIL ')+n);
const y0=()=>pg.evaluate(()=>scrollY);
// nav jump to menu
if(mob){ await pg.click('.burger'); await pg.waitForTimeout(300); }
await pg.click('.links button:nth-child(4)'); await pg.waitForTimeout(2200);
ok('nav → menu scrolls', await pg.evaluate(()=>Math.abs(document.getElementById('menu').getBoundingClientRect().top)<200));
// add to order
await pg.click('.mcard:nth-child(1) .btn-solid'); await pg.click('.mcard:nth-child(2) .btn-solid');
await pg.click('.mcard:nth-child(2) .stepper button[aria-label="Add one"]');
ok('badge = 3', (await pg.textContent('.order-btn b'))==='3');
// open drawer
await pg.click('.order-btn'); await pg.waitForTimeout(600);
ok('drawer lines', (await pg.$$('.line')).length===2);
const tot1=await pg.textContent('.sum .tot dd'); ok('total 40+60+25 fee=125 → '+tot1, tot1.startsWith('125'));
await pg.click('.seg button:nth-child(2)'); const tot2=await pg.textContent('.sum .tot dd'); ok('pickup total 100 → '+tot2, tot2.startsWith('100'));
await pg.screenshot({path:`/tmp/shots/${mob?'mob':'desk'}-drawer.png`});
await pg.click('.dr-foot .btn-solid'); await pg.click('form .btn-solid'); 
ok('validation errors shown', (await pg.$$('form em')).length>=2);
await pg.fill('form label:nth-child(1) input','Mona'); await pg.fill('form label:nth-child(2) input','01012345678');
await pg.click('form .btn-solid'); await pg.waitForTimeout(300);
ok('order confirmation', !!(await pg.$('.receipt'))); const href=await pg.getAttribute('.dr-done a.btn','href'); ok('whatsapp link', href.startsWith('https://wa.me/'));
await pg.screenshot({path:`/tmp/shots/${mob?'mob':'desk'}-done.png`});
await pg.click('.linkish'); await pg.waitForTimeout(300);
ok('cart cleared', (await pg.textContent('.order-btn b'))==='0');
// edit mode
await pg.evaluate(()=>document.getElementById('menu').scrollIntoView()); await pg.click('.menu-tools .btn');
await pg.fill('.mcard:nth-child(1) .price-in','55'); await pg.fill('.mcard:nth-child(1) .mc-ar input','فول مدمس');
await pg.click('.menu-tools .btn'); await pg.waitForTimeout(200);
ok('price edit persists in card', (await pg.textContent('.mcard:nth-child(1) .mc-price b'))==='55');
await pg.click('.mcard:nth-child(1) .btn-solid'); await pg.click('.order-btn'); await pg.waitForTimeout(500);
ok('drawer uses edited price', (await pg.textContent('.line .ln-s')).startsWith('55')); await pg.click('.x'); await pg.waitForTimeout(500);
// lightbox
await pg.click('.mcard:nth-child(3) .mc-img'); ok('lightbox opens', !!(await pg.$('.lightbox img'))); await pg.keyboard.press('Escape'); await pg.click('.lightbox figcaption button'); ok('lightbox closes', !(await pg.$('.lightbox')));
// ingredient tab click
await pg.evaluate(()=>window.scrollTo(0,ScrollTrigger.getById('ingredients').start)); await pg.waitForTimeout(500);
await pg.click('.ing-tabs button:nth-child(5)'); await pg.waitForTimeout(2200);
ok('tab → mesaka active', (await pg.textContent('.ii-en')).includes("Mesaka"));
await pg.screenshot({path:`/tmp/shots/${mob?'mob':'desk'}-mesaka.png`});
// hotspots
await pg.evaluate(()=>document.querySelector('.xp-stage').scrollIntoView()); await pg.waitForTimeout(800);
await pg.click('.hot:nth-of-type(2)',{force:true}).catch(()=>{}); 
const before=await pg.textContent('.xp-card b'); await pg.click('.xp-dots button:nth-child(5)'); ok('hotspot dots change card', before!==(await pg.textContent('.xp-card b')));
// finale CTA opens drawer
await pg.evaluate(()=>window.scrollTo(0,ScrollTrigger.getById('finale').end)); await pg.waitForTimeout(500);
await pg.click('.fn-cta .btn-cream'); await pg.waitForTimeout(500); ok('finale CTA opens drawer', await pg.evaluate(()=>document.querySelector('.drawer-wrap').classList.contains('open')));
await pg.screenshot({path:`/tmp/shots/${mob?'mob':'desk'}-drawer2.png`});
// horizontal overflow
ok('no horizontal overflow', await pg.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
console.log('errors:',errs.join('|')||'none'); await b.close(); srv.close();
