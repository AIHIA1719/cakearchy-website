/*
  CAKEARCHY SETTINGS
  Everything you're likely to tweak lives here: prices, lead times, delivery fees,
  slots and the menu. Change a number, save, refresh. No other file needs touching.
*/
window.CAKEARCHY = {
  business: {
    name: 'Cakearchy',
    email: 'hello@cakearchy.com',
    instagram: 'https://instagram.com/cakearchy',
    area: 'Harpenden',
    replyHours: 24,
    depositPercent: 30,
    changeCutoffDays: 7,
    cancelFullRefundDays: 14,
    quickCancelHours: 48,
    // Where the coming soon interest form sends sign-ups. Paste a Formspree, Tally
    // or Google Apps Script URL here when you go live. Empty = saved in the browser only.
    interestFormEndpoint: '',
    launchMonth: 'early 2027'
  },

  // Festive snow and sprinkles on the homepage. Runs between these dates (MM-DD) each year.
  festive: { enabled: true, from: '11-15', to: '01-06' },

  // Minimum notice in days
  leadTimes: {
    quick: 3,        // Quick bakes
    celebration: 5,  // Birthday, kids, baby, Him/Her
    bespoke: 21,     // Bespoke and 3D
    wedding: 90      // Weddings
  },

  // How many orders you can take each weekend (Fri to Sun)
  capacity: {
    customPerWeekend: 4,
    quickPerWeekend: 6
  },

  // Dates you're already booked or away. Format YYYY-MM-DD
  bookedDates: ['2026-12-19', '2026-12-20', '2026-12-24', '2026-12-25', '2026-12-26'],

  // Pretend bookings so the slots-left counter shows something. Remove when real orders come in.
  demoTaken: { '2026-12-05': 2, '2026-12-06': 2, '2026-12-12': 1, '2026-12-13': 3 },

  delivery: {
    radiusMiles: 5,
    zones: [
      { name: 'Harpenden', maxMiles: 3, fee: 6 },
      { name: 'Up to 5 miles', maxMiles: 5, fee: 10 }
    ],
    // Rough distance by postcode district from Harpenden (AL5).
    // Placeholder until a proper distance check is added at hosting time.
    districtMiles: { AL5: 1.5, AL3: 4, AL4: 4.5, AL1: 5, AL2: 6, LU1: 5.5, LU2: 5.5, LU3: 7, LU4: 7, LU5: 8, AL6: 6, AL7: 8, AL8: 7, AL9: 9, AL10: 7, HP2: 6, HP1: 8, SG4: 9 }
  },

  occasions: [
    { id: 'birthday', name: 'Birthday', from: 45, img: 'assets/img/birthday-tile.jpg', lead: 'celebration' },
    { id: 'kids', name: 'Kids', from: 55, img: 'assets/img/kids.jpg', lead: 'celebration' },
    { id: 'baby', name: 'Baby', from: 50, img: 'assets/img/baby.jpg', lead: 'celebration' },
    { id: 'himher', name: 'Him/Her', from: 60, img: 'assets/img/himher.jpg', lead: 'celebration' },
    { id: 'cupcakes', name: 'Cupcakes', from: 15, img: 'assets/img/cupcakes.jpg', lead: 'quick' },
    { id: 'bespoke', name: 'Bespoke', from: 75, img: 'assets/img/florals.jpg', lead: 'bespoke' },
    { id: 'wedding', name: 'Wedding', from: 250, img: 'assets/img/wedding.jpg', lead: 'wedding' }
  ],

  quickBakes: [
    { id: 'sprinkle', name: 'Sprinkle Explosion', sub: '6 inch · serves 10 to 12', img: 'assets/img/birthday.jpg',
      desc: 'The hero. Vanilla sponge, raspberry jam, a hot pink drip, swirls, cherries and a wall of sprinkles.',
      sizes: [{ id: 'six', name: '6 inch', note: 'Serves 10 to 12', price: 40 }],
      flavours: ['Vanilla and raspberry', 'Chocolate fudge', 'Lemon'], colours: ['Hot pink drip', 'Ink drip'], message: true,
      allergens: 'gluten, eggs and milk' },
    { id: 'choc', name: 'Chocolate fudge drip', sub: '6 inch · serves 10 to 12', img: 'assets/img/choc.jpg',
      desc: 'Britain\'s favourite flavour, done properly. Chocolate fudge sponge, chocolate buttercream, a glossy drip and a crown of cherries. Or go Biscoff.',
      sizes: [{ id: 'six', name: '6 inch', note: 'Serves 10 to 12', price: 40 }],
      flavours: ['Chocolate fudge', 'Chocolate Biscoff'], colours: ['Cherries on top', 'Biscoff crumb on top'], message: true,
      allergens: 'gluten, eggs, milk and soya' },
    { id: 'heart', name: 'Vintage heart', sub: '6 inch heart · serves 10 to 12', img: 'assets/img/heart.jpg',
      desc: 'The one all over TikTok. A heart-shaped cake with frilly retro piping, bows and cherries. Birthdays, anniversaries, "just because".',
      sizes: [{ id: 'six', name: '6 inch heart', note: 'Serves 10 to 12', price: 45 }],
      flavours: ['Vanilla and raspberry', 'Lemon', 'Red velvet', 'Chocolate'], colours: ['Pink and cream', 'Cherry red', 'Buttercream yellow', 'All white'], message: true,
      allergens: 'gluten, eggs and milk' },
    { id: 'mini', name: 'Bento mini cake', sub: '4 inch · serves 2 to 4', img: 'assets/img/bento.jpg',
      desc: 'A little cake with a big attitude and a short message on top. Perfect for "just because", office treats and date nights.',
      sizes: [{ id: 'one', name: 'One mini cake', note: 'Serves 2 to 4', price: 22 }],
      flavours: ['Vanilla', 'Chocolate', 'Lemon', 'Red velvet', 'Biscoff'], colours: ['Bubblegum', 'Buttercream yellow', 'Cream'], message: true,
      allergens: 'gluten, eggs and milk' },
    { id: 'brownies', name: 'Brownie box', sub: 'Fudgy squares · from £12', img: 'assets/img/brownies.jpg',
      desc: 'Thick, gooey brownies in a hot pink box. Biscoff, salted caramel and triple chocolate, or a mix of all three.',
      sizes: [{ id: 'four', name: 'Box of 4', note: 'Pick a flavour or mix', price: 12 }, { id: 'nine', name: 'Box of 9', note: 'Pick a flavour or mix', price: 24 }],
      flavours: ['Mixed box', 'Biscoff', 'Salted caramel', 'Triple chocolate'], colours: ['Classic'], message: false,
      allergens: 'gluten, eggs, milk and soya' },
    { id: 'classic', name: 'Classic cupcakes', sub: 'Five flavours · from £15', img: 'assets/img/classic.jpg',
      desc: 'Fluffy sponge, a proper swirl of buttercream and rainbow sprinkles. Simple, and everyone eats them.',
      sizes: [{ id: 'six', name: 'Box of 6', note: 'Mix and match flavours', price: 15 }, { id: 'twelve', name: 'Box of 12', note: 'Mix and match flavours', price: 28 }],
      flavours: ['Vanilla', 'Chocolate', 'Lemon', 'Biscoff', 'Mix it up'], colours: ['Cream', 'Bubblegum', 'Buttercream yellow'], message: false,
      allergens: 'gluten, eggs and milk' },
    { id: 'party', name: 'Party cupcakes', sub: 'Cherry on top · from £18', img: 'assets/img/cupcakes.jpg',
      desc: 'Tall pink and cream swirls, sprinkles and a cherry on every single one.',
      sizes: [{ id: 'six', name: 'Box of 6', note: 'Pink and cream mix', price: 18 }, { id: 'twelve', name: 'Box of 12', note: 'Pink and cream mix', price: 34 }],
      flavours: ['Vanilla', 'Chocolate', 'Red velvet', 'Half and half'], colours: ['Pink and cream'], message: false,
      allergens: 'gluten, eggs and milk' }
  ],

  quickAddOns: [
    { id: 'cherries', name: 'Extra cherries', note: 'Because more is more', price: 3 },
    { id: 'tag', name: 'Gift tag with a message', note: 'Handwritten', price: 2 },
    { id: 'candle', name: 'Number candle', note: 'Gold, to match the crown', price: 3 }
  ],

  signature: [
    { id: 'sprinkle', name: 'Sprinkle Explosion', occasion: 'Birthday', img: 'assets/img/birthday.jpg', from: 45, desc: 'Vanilla sponge, raspberry jam and enough sprinkles to make a grown-up giggle.' },
    { id: 'lemon', name: 'Lemon Drizzle Queen', occasion: 'Birthday', img: 'assets/img/lemon.jpg', from: 45, desc: 'Britain\'s favourite cake, all dressed up. Zingy lemon sponge, a white drizzle and candied lemon crown.' },
    { id: 'biscoff', name: 'Biscoff Boss', occasion: 'Birthday', img: 'assets/img/biscoff.jpg', from: 50, desc: 'Caramel biscuit sponge, Biscoff buttercream, a glossy drip and a crunchy crumb collar.' },
    { id: 'dino', name: 'Dino Disco', occasion: 'Kids', img: 'assets/img/kids.jpg', from: 55, desc: 'Chocolate fudge layers with a dinosaur who definitely came to party.' },
    { id: 'hello', name: 'Hello Little One', occasion: 'Baby', img: 'assets/img/baby.jpg', from: 50, desc: 'In 2 colourways for boys or girls.' },
    { id: 'fancy', name: 'Fancy Pants', occasion: 'Him/Her', img: 'assets/img/himher.jpg', from: 60, desc: 'A black and pink Lambeth cake with cherries on top. Rules optional.' },
    { id: 'redvelvet', name: 'Red Velvet Rebel', occasion: 'Him/Her', img: 'assets/img/redvelvet.jpg', from: 55, desc: 'Deep red sponge, cream cheese frosting and semi-naked sides. Looks innocent, isn\'t.' },
    { id: 'crew', name: 'Cupcake Crew', occasion: 'Cupcakes', img: 'assets/img/cupcakes.jpg', from: 18, desc: 'Swirls, sprinkles and a cherry on top. Sold in sixes and twelves.' },
    { id: 'totally', name: 'Totally You', occasion: 'Bespoke', img: 'assets/img/florals.jpg', from: 75, desc: 'Buttercream florals, sculpted toppers or something nobody\'s done yet. Bring the idea, I\'ll make it happen.' }
  ],

  // The Naughty Step: 18+ range. Names are bleeped on the site, spelled out on the cake.
  naughty: [
    { id: 'llfo', name: 'Live, Laugh, F*** Off', img: 'assets/img/naughty-llfo.jpg', from: 24, desc: 'A box of six pretty cupcakes, spelling it out one word at a time.' },
    { id: 'oaf', name: 'Old As F***', img: 'assets/img/naughty-oaf.jpg', from: 50, desc: 'Chocolate fudge layers, a glittery number and enough candles to set off the smoke alarm.' },
    { id: 'hfb', name: 'Happy F***ing Birthday', img: 'assets/img/naughty-hfb.jpg', from: 45, desc: 'Retro frills, cherries on top and an extra word that does a lot of heavy lifting.' },
    { id: 'ws', name: 'Well, S***.', img: 'assets/img/naughty-ws.jpg', from: 50, desc: 'For leaving dos, break-ups and anything that deserves a dramatic sigh. Knife not included.' }
  ],

  // Request builder sizes
  sizes: [
    { id: 's6', name: 'Small · 6 inch', note: 'Serves 12 to 15', price: 55 },
    { id: 'm8', name: 'Medium · 8 inch', note: 'Serves 20 to 30', price: 70 },
    { id: 't8', name: 'Tall · 8 inch double height', note: 'Serves 30 to 40', price: 90 },
    { id: 'two', name: 'Two tiers', note: 'Serves 50 to 70', price: 150 }
  ],
  addOns: [
    { id: 'cup6', name: '6 matching cupcakes', note: 'For party bags or the grown-ups', price: 18 },
    { id: 'candle', name: 'Number candle', note: 'Gold, to match the crown', price: 3 }
  ],
  flavours: ['Vanilla', 'Chocolate fudge', 'Lemon drizzle', 'Red velvet', 'Biscoff', 'Raspberry ripple'],
  colours: ['Hot pink', 'Buttercream', 'Bubblegum', 'Ink', 'Surprise me'],

  // Allergy rules. What the form says when people tick things.
  // can: 'yes' (fine), 'ingredients' (made without, but not safe for severe allergy), 'no' (can't do safely)
  allergens: [
    { id: 'gluten', name: 'Gluten', hint: 'Wheat, barley, rye, oats', can: 'ingredients', extra: 5,
      ok: 'Gluten-free ingredients: +£5', okBody: 'I\'ll bake with gluten-free flour, but my kitchen isn\'t gluten-free, so this cake isn\'t suitable for coeliacs.' },
    { id: 'eggs', name: 'Eggs', hint: '', can: 'yes', extra: 0, ok: 'Egg-free: no problem', okBody: 'I\'ll use my egg-free sponge. It\'s just as fluffy.' },
    { id: 'milk', name: 'Milk and dairy', hint: '', can: 'yes', extra: 3, ok: 'Dairy-free: +£3', okBody: 'Dairy-free sponge and buttercream. Made in a kitchen that uses dairy.' },
    { id: 'peanuts', name: 'Peanuts', hint: '', can: 'no' },
    { id: 'nuts', name: 'Tree nuts', hint: 'Almonds, hazelnuts, pistachios and so on', can: 'no' },
    { id: 'soya', name: 'Soya', hint: '', can: 'ingredients', extra: 0, ok: 'Soya-free: can do', okBody: 'I\'ll leave out soya ingredients. Traces may be present in my kitchen.' },
    { id: 'sesame', name: 'Sesame', hint: '', can: 'ingredients', extra: 0, ok: 'Sesame-free: can do', okBody: 'None of my recipes use sesame, but I can\'t guarantee trace-free.' }
  ],
  otherAllergens: ['Celery', 'Crustaceans', 'Fish', 'Lupin', 'Molluscs', 'Mustard', 'Sulphites'],
  dietary: ['Vegan', 'Vegetarian (no gelatine)', 'Halal-friendly', 'Lower sugar']
};
