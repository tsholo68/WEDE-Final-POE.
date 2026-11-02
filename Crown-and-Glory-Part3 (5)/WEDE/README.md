# Crown & Glory Hair Studio - Web Development Project

Multi-page website for **Crown & Glory Hair Studio** (Johannesburg): services, gallery, bookings and contact.

---

## Part 3 Overview & Implementation

Part 3 adds JavaScript functionality, SEO, and validated forms on top of the Part 2 design.

### JavaScript enhancements (`js/`)
| Requirement | Where | How |
|---|---|---|
| Accordion | `index.html`, `services.html` | FAQ built with buttons + `aria-expanded`, one listener (event delegation) in `main.js` |
| Tabs | `about.html` | Accessible `role="tablist"` tabs with arrow-key support (`main.js`) |
| Modal | `services.html` | "Details" button opens a service-details dialog (Esc / click outside closes) |
| Interactive map | `contact.html` | Leaflet + Esri World Street Map tiles, two markers/popups, "Show on map" buttons use `flyTo` (`map.js`) |
| Animations & transitions | all pages | CSS keyframes (floating sparkles, fade/pop), hover transitions, scroll-reveal with `IntersectionObserver` |
| Advanced DOM manipulation | `services.js`, `forms.js` | Elements created with `createElement`/`DocumentFragment`, `textContent` (no unsafe `innerHTML`), `dataset`, delegation |
| Gallery + lightbox | `services.html` | Click a photo to enlarge; previous/next buttons and arrow keys |
| Dynamic content | `services.html` | Service cards are generated from `js/data.js` |
| Search / filter / sort | `services.html` | Live search, category filter (built from the data) and price/name sorting |

### SEO
* **On-page:** unique `<title>` and meta description per page, keywords, one `<h1>` per page with logical `h2`/`h3` order, descriptive image file names (e.g. `knotless-braids-protective-style.svg`) with alt text, clean file URLs, internal links in nav/footer/CTAs, responsive viewport meta.
* **Local SEO:** `HairSalon` JSON-LD structured data (address, phone, hours, geo) on the home and contact pages.
* **Off-page plan:** social profile links in the footer; Open Graph tags for sharing; backlink plan = list the studio on Google Business Profile, local salon directories and student-community pages, and ask collaborators to link back.
* **Technical:** `robots.txt`, `sitemap.xml`, `preconnect` + `defer` scripts + lazy-loaded images + lightweight SVG images for speed.
* **Security:** Content-Security-Policy meta tag, referrer policy, `rel="noopener noreferrer"` on external links, input validation, no `innerHTML` with user data, honeypot field against spam bots.

### Forms (`js/forms.js`)
* **enquiry.html** - validates, then shows a response with the **estimated cost, 30% deposit, duration and availability** for the chosen date (5 slots per day, closed Sundays, waitlist message when full).
* **contact.html** - validates, then compiles an **email** (subject + body) addressed to the recipient set in `RECIPIENT_EMAIL` at the top of `forms.js`; the client presses "Open in my email app" to send it.
* **Validation:** HTML5 attributes (`required`, `type`, `minlength`, `maxlength`, `pattern`) plus JavaScript: name, email, South African phone format, date range, message length. Inline error messages, live feedback on blur/input, character counters.
* **AJAX:** `fetch()` POSTs JSON to the form's `action` URL without reloading the page, with a loading spinner and error handling. The action currently points to the free test API `jsonplaceholder.typicode.com`; swap in a real endpoint (e.g. Formspree) to receive real submissions.

---

## Changelog

### Part 3 changes
1. **Added `js/main.js`** - mobile menu, scroll animations, accordion, tabs, modal/overlay helper.
2. **Added `js/data.js` and `js/services.js`** - five services with prices rendered dynamically; search, filter, sort, details modal, lightbox gallery.
3. **Added `js/map.js`** - replaced the static Google Maps iframe with an interactive Leaflet map (no API key needed).
4. **Added `js/forms.js`** - client-side validation, error handling, AJAX submission, booking response (cost/availability) and compiled contact email.
5. **Added `images/`** - five gallery photos (knotless braids, Fulani braids, straight-up ponytail, installation, wash) with descriptive file names, cropped to a consistent 4:5 portrait, plus a favicon.
6. **SEO** - rewrote `<head>` of every page (titles, descriptions, Open Graph, canonical, JSON-LD); added `robots.txt` and `sitemap.xml`.
7. **Redesigned `css/style.css`** - pink/lavender palette, gradient hero, sticky header, responsive mobile menu, reduced-motion support.
8. **Services page** - was three text-only cards with no photos; now a searchable gallery.

### Part 2 feedback fixes
**Marker feedback (Formative 2 Part 2):** *"Good work. External CSS, documentation and styling are strong, but add responsive breakpoints, typography adjustments, richer interaction states, and verifiable Git commits."*

1. **Responsive breakpoints** - previously a single `720px` breakpoint. `css/style.css` now has breakpoints at 1400px+, 1199px, 1023px, 767px, 599px and 380px, plus landscape-phone, touch-device (`hover: none`, 44px tap targets) and print rules. The service grid moves from 3 columns to 2 to 1, the toolbar and feature cards restack, the map and lightbox resize, and buttons go full-width on phones. Tested with no horizontal scrolling from 320px to 1440px.
2. **Typography adjustments** - fluid type scale with `clamp()` custom properties (`--fs-body`, `--fs-h1`, `--fs-h2`, `--fs-h3`, `--fs-small`) so text scales smoothly between phone and desktop; paragraph line length capped at `65ch`; `text-wrap: balance` on headings and `pretty` on paragraphs; tuned line-height, letter-spacing, and smaller label/helper text sizes.
3. **Richer interaction states** - added hover, `:focus-visible`, pressed (`:active`) and `:disabled` states for buttons, nav links, the logo, cards, accordion headers, tabs, modal/lightbox controls and footer links; animated link underlines and visited colour; form fields now have hover, focus ring, valid (green tick) and invalid (red cross + shake) states, and a loading/disabled submit button; hover-only effects are switched off on touch screens.
4. **Verifiable Git commits** - changes are now committed in small, separate steps with descriptive messages (see commit history in the repository), for example `Add responsive breakpoints for tablet and mobile`, `Add fluid typography scale`, `Add hover, focus and active states`.
5. **Earlier fixes kept from this round** - one `<h1>` per page, inline styles removed, fragile `a[href*=...]` selectors replaced by `.btn`, CSS `@import` replaced with `<link>` tags.

### Part 1 feedback fixes (previous)
1. Moved all `.html` files to the project root so links work.
2. Corrected the stylesheet link in every page head to `css/style.css`.
3. Expanded this README with a changelog and folder overview.

---

## Folder Structure

```text
WEDE/
├── css/
│   └── style.css
├── images/
│   ├── favicon.svg
│   ├── knotless-braids-protective-style.jpg
│   ├── fulani-braids-with-curly-ends.jpg
│   ├── straight-up-braided-ponytail.jpg
│   ├── hair-installation-sleek-straight.jpg
│   └── hair-wash-and-treatment.jpg
├── js/
│   ├── data.js
│   ├── main.js
│   ├── services.js
│   ├── map.js
│   └── forms.js
├── about.html
├── contact.html
├── enquiry.html
├── index.html
├── services.html
├── robots.txt
├── sitemap.xml
└── README.md
```

## How to test locally (Visual Studio Code)

1. **Open the project:** VS Code > File > Open Folder > choose the `WEDE` folder (the one containing `index.html`).
2. **Install Live Server:** click the Extensions icon (four squares), search **Live Server** (by Ritwick Dey), click Install.
3. **Run it:** right-click `index.html` in the Explorer > **Open with Live Server**. The site opens at `http://127.0.0.1:5500`. Saving a file refreshes the page automatically. Stop it with the "Port: 5500" button in the bottom bar.
4. **Check for errors:** in the browser press `F12` > **Console**. There should be no red errors (the map needs an internet connection).
5. **Test each page:**
   * *Home* - click each FAQ question (opens/closes); hover the buttons and cards.
   * *About* - click the three tabs; try the left/right arrow keys.
   * *Services* - search "braids", "wash" and nonsense text; use Category and Sort; click "Details" (Esc closes); click a photo and use the arrows; click "Book" (the service is pre-selected on the form).
   * *Bookings* - press Submit empty (error messages); try a bad email, phone `123`, a past date and a Sunday; then fill it correctly and read the cost/availability response; try the Waitlist option.
   * *Contact* - drag/zoom the map, click the markers and the "Show on map" buttons; send a valid message and press "Open in my email app".
6. **Test responsiveness:** `F12` > click the device icon (Toggle device toolbar, `Ctrl+Shift+M`) > try 375px (phone), 768px (tablet) and 1280px (laptop). Nothing should scroll sideways and the menu becomes a hamburger on phones.
7. **Test SEO/speed:** in Chrome `F12` > **Lighthouse** > tick Performance, Accessibility, Best practices, SEO > Analyze. Also visit `/robots.txt` and `/sitemap.xml` in the Live Server address.
8. **Validate code (optional):** paste pages into <https://validator.w3.org/> and the CSS into <https://jigsaw.w3.org/css-validator/>.
9. **Commit your work:** Source Control panel (branch icon) > type a message > Commit > Sync Changes.

## Before publishing
* Replace `your-username.github.io/WEDE` in the canonical/Open Graph tags, `robots.txt` and `sitemap.xml` with your real GitHub Pages URL.
* Change `RECIPIENT_EMAIL` in `js/forms.js` to the real studio email.
* Make sure you have permission to use the gallery photos (or replace them with photos of your own work) and keep the descriptive file names and alt text.

## References

* Google Fonts. 2026. *Playfair Display, Dancing Script & Poppins*. Available at: <https://fonts.google.com/> [Accessed 24 October 2026].
* Leaflet. 2026. *Leaflet - an open-source JavaScript library for interactive maps*. Available at: <https://leafletjs.com/> [Accessed 24 October 2026].
* Esri. 2026. *World Street Map*. Available at: <https://www.arcgis.com/home/item.html?id=3b93337983e9436f8db950e38a8629af> [Accessed 1 November 2026].
* OpenStreetMap contributors. 2026. *OpenStreetMap*. Available at: <https://www.openstreetmap.org/> [Accessed 24 October 2026].
* Mozilla Developer Network (MDN). 2026. *Using the Fetch API*. Available at: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch> [Accessed 24 October 2026].
* MDN. 2026. *Client-side form validation*. Available at: <https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation> [Accessed 24 October 2026].
* MDN. 2026. *Content-Security-Policy*. Available at: <https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP> [Accessed 24 October 2026].
* Google Search Central. 2026. *SEO Starter Guide*. Available at: <https://developers.google.com/search/docs/fundamentals/seo-starter-guide> [Accessed 24 October 2026].
* Schema.org. 2026. *HairSalon*. Available at: <https://schema.org/HairSalon> [Accessed 24 October 2026].
* W3C. 2026. *WAI-ARIA Authoring Practices: Tabs and Accordion patterns*. Available at: <https://www.w3.org/WAI/ARIA/apg/> [Accessed 24 October 2026].
