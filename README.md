# Cakearchy website

Cakes without the rules. The Cakearchy website, built from the Figma brand and design system.

It's plain HTML, CSS and JavaScript. No build step and nothing to install. Open `index.html` in a browser and it works.

## Pages

| Page | What it does |
| --- | --- |
| `index.html` | Homepage in the research-led order: date-first search, shop by occasion, quick bakes, lead times, signature cakes, how it works, allergies, weddings, Instagram, FAQs |
| `quick-bakes.html` | Quick bakes menu. Add `?item=classic` (or `mini`, `sprinkle`, `choc`, `party`) for a product page |
| `basket.html` | Basket and checkout for quick bakes, with delivery fee by postcode and an allergen check |
| `order.html` | The six-step request builder for custom cakes, including the allergies and intolerances step |
| `track.html` | Order tracker: countdown, stages, quote approval, messages |
| `allergens.html` | Honest allergen table |
| `coming-soon.html` | Market-testing page: "I'd buy this" buttons and a register-interest form |

## Changing prices, lead times and rules

Almost everything lives in **`js/config.js`**:

- `leadTimes`: quick bakes 3 days, celebration 5, bespoke 21, weddings 90
- `capacity`: how many orders a weekend
- `bookedDates`: days you're full or away
- `demoTaken`: fake bookings for the preview. Delete these before launch
- `delivery`: £6 in Harpenden, £10 up to 5 miles, plus a rough distance table by postcode district
- `quickBakes`, `signature`, `sizes`, `addOns`, `flavours`, `colours`: the menu
- `allergens`: what the order form says for each allergen (`yes`, `ingredients` or `no`)
- `business.interestFormEndpoint`: where coming-soon sign-ups get sent

Colours, fonts and spacing are CSS variables at the top of **`css/styles.css`**. They match the Figma variables.

## What's a preview and what's real

This is a working front end. These parts are simulated, ready to connect when we host it:

- **Payments.** The Pay buttons don't charge anything. Connect Stripe Checkout (or Shopify or Square) at hosting time.
- **Orders and requests.** These are saved in the visitor's browser only. Connect to email, a form service or a small database.
- **Availability.** Worked out from `config.js`. Later this should read from your real calendar of bookings.
- **Delivery distance.** Uses a rough postcode-district table. Swap for a proper distance check (for example, postcodes.io plus a distance calculation).
- **Photos.** AI-generated placeholders from the Figma file. Swap the files in `assets/img/` for real cake photos with the same names.

## Trying it locally

Double-click `index.html`, or run a tiny server from this folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000.
