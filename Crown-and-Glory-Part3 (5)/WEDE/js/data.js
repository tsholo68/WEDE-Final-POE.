/* Shared service data - used by services.js (dynamic cards) and forms.js (price + select options) */
window.CG_SERVICES = [
  {
    id: 'knotless-braids', name: 'Knotless Braids', category: 'Braids', price: 850, duration: '5 - 7 hours',
    image: 'images/knotless-braids-protective-style.jpg',
    alt: 'Client with long blonde and brown knotless braids parted neatly down the middle',
    blurb: 'Clean parting, lightweight and low-tension braids that are gentle on your edges.',
    includes: ['Consultation and hair prep', 'Clean, neat parting', 'Premium braiding hair', 'Edge-care finish']
  },
  {
    id: 'fulani-braids', name: 'Fulani Braids', category: 'Braids', price: 700, duration: '4 - 6 hours',
    image: 'images/fulani-braids-with-curly-ends.jpg',
    alt: 'Client with Fulani braids, cornrows at the front and long honey-blonde braids with curly ends',
    blurb: 'Classic feed-in cornrows at the front with long braids and curly ends for a statement look.',
    includes: ['Consultation and pattern choice', 'Feed-in cornrows', 'Braiding hair and curly ends', 'Beads or cuffs on request']
  },
  {
    id: 'straight-up', name: 'Straight-Up Braided Ponytail', category: 'Braids', price: 650, duration: '3 - 4 hours',
    image: 'images/straight-up-braided-ponytail.jpg',
    alt: 'Straight-up braided hairstyle swept into a high ponytail with curly ends and baby hair',
    blurb: 'Neat straight-up cornrows swept into a high ponytail, finished with soft curls and laid edges.',
    includes: ['Consultation', 'Straight-up cornrow pattern', 'High ponytail with braiding hair', 'Edge laying and curly ends']
  },
  {
    id: 'hair-installation', name: 'Hair Installation', category: 'Installation', price: 450, duration: '2 - 3 hours',
    image: 'images/hair-installation-sleek-straight.jpg',
    alt: 'Client with a sleek, straight, natural-looking installed hairstyle and a neat side parting',
    blurb: 'Custom fitting and natural-looking styling for a seamless, sleek finish and a flawless hairline.',
    includes: ['Custom fit and cut', 'Lace bleaching and plucking', 'Secure, comfortable install', 'Styling and aftercare tips']
  },
  {
    id: 'wash-treatment', name: 'Wash & Treatment', category: 'Hair Care', price: 350, duration: '1 - 1.5 hours',
    image: 'images/hair-wash-and-treatment.jpg',
    alt: 'Stylist gently shampooing a client\'s hair at a backwash basin',
    blurb: 'A relaxing shampoo and deep hydration treatment that brings softness and shine back to your hair.',
    includes: ['Scalp massage and gentle wash', 'Protein or moisture treatment', 'Steam session', 'Blow-dry or air-dry finish']
  }
];
window.CG_RULES = { dailyCap: 5, closedDay: 0 /* Sunday */ };
