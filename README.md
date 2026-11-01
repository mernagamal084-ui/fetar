# El Fetar El Masry — فطار الحتة

React + GSAP/ScrollTrigger (loaded from cdnjs) site.

## Run
    npm install
    npm run build        # creates dist/index.html + dist/img
    npx serve dist       # or open dist/index.html through any static server

## Edit
- src/data.js      -> dishes, Arabic/English names, descriptions, default prices, WhatsApp number
- src/styles.css   -> all styling
- src/Street.jsx, Signatures.jsx, Ingredients.jsx, Menu.jsx, Experience.jsx, Finale.jsx, Drawer.jsx -> sections
- public/img       -> cart.webp (cut-out of your cart) and the five dish photos
- test/            -> playwright test scripts (gsap-shim.js is for offline testing only)
