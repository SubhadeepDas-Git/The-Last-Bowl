import { MoodRecommendation } from '../types';

export const RESTAURANT_INFO = {
  name: 'THE LAST BOWL',
  tagline: 'A Cozy Ramen Retreat After Dark',
  philosophy: 'We believe that comfort food should be as comforting as the night itself.',
  hours: {
    openHour: 19, // 7:00 PM
    closeHour: 4,  // 4:00 AM
    display: 'Daily · 7:00 PM – 4:00 AM',
    note: 'Kitchen serves until 3:30 AM'
  },
  location: {
    address: 'Midnight Alley, Neon District',
    subtext: 'Between 4th & Lantern Way, under the copper lantern',
    city: 'Nightfall Quarter',
    transitTip: '2-minute walk from Night Market Transit Station (Exit B)',
    parking: 'Quiet street parking along Lantern Way after 8:00 PM'
  },
  contact: {
    email: 'hello@thelastbowl.com',
    phone: '+1 (555) 839-2695'
  },
  copyright: '© 2026 The Last Bowl. All rights reserved.',
  
  // High-res authentic image URLs extracted directly from Wix site
  images: {
    heroBanner: 'https://static.wixstatic.com/media/a46dc5_b151b96a651a4b81a926fcc50328dd96~mv2.jpg',
    soulOfBowl: 'https://static.wixstatic.com/media/a46dc5_405cdb72f99640af807208e8e739f5e9~mv2.jpg',
    storyPortrait: 'https://static.wixstatic.com/media/a46dc5_2e4aad2ab9bf4ec7a607207a62d67415~mv2.jpg',
    logo: 'https://static.wixstatic.com/media/a46dc5_6a134defc5d94d41b1a0d5d47eb69794~mv2.png'
  }
};

export const BENEFITS = [
  {
    id: 'signature-bowls',
    title: 'SIGNATURE BOWLS',
    subtitle: 'Handcrafted With Patience',
    description: 'Handcrafted ramen with artisanal ingredients and a perfect balance of flavors to satisfy your midnight cravings.',
    badge: 'Artisanal Broths'
  },
  {
    id: 'cozy-ambiance',
    title: 'COZY AMBIANCE',
    subtitle: 'Quiet Haven After Dark',
    description: 'Our intimate setting is designed for those who value a quiet retreat after the city lights have dimmed.',
    badge: 'Soft Glow & Lo-Fi'
  },
  {
    id: 'midnight-ritual',
    title: 'MIDNIGHT RITUAL',
    subtitle: 'A Solitary Warmth',
    description: 'Experience the perfect blend of nostalgia and comfort. We serve our most beloved dishes at the hour when the world slows down.',
    badge: 'Served Until 4 AM'
  }
];

export const STORY_CONTENT = {
  sectionLabel: 'A LITTLE BOWL, A BIG DREAM',
  heading: 'Our Story',
  subheading: 'RAMEN & WARM NIGHTS',
  paragraphs: [
    `It began, quite literally, with a late night bowl — steam curling up in an empty kitchen, the kind of hour when the world goes quiet and a single bowl of ramen feels like the only thing that makes sense. That small, cozy moment became the name, and slowly, the whole idea of the restaurant: a place for the in-between hours, for people who find comfort at midnight.`,
    `The soul of it, though, came from somewhere else entirely — from watching When I Fly Towards You, and falling completely into its quiet, tender world. There was something about the warmth between its characters, the patience, the soft glow of scenes lit like this very page, that felt like it belonged in a bowl of something homemade. I wanted to bottle that feeling — gentle, hopeful, a little dreamy — and serve it, one steaming bowl at a time.`,
    `So Late Night Bowl isn't just a ramen place. It's a little universe stitched together from a drama that moved me and a bowl of noodles that once kept me company at 1AM — made for anyone chasing warmth after dark.`
  ],
  closing: 'with warmth, always',
  signature: '— late night bowl'
};

export const MOOD_RECOMMENDATIONS: MoodRecommendation[] = [
  {
    mood: 'cozy',
    title: 'Velvet Tonkotsu',
    subtitle: 'A warm blanket in bowl form',
    bowlId: 'velvet-tonkotsu',
    quote: 'For the nights when the air is chilly and you want to be wrapped in something slow-simmered, velvety, and deep.',
    notes: '12-hour pork collagen broth · Chashu · Black garlic oil whisper',
    ambientVibe: 'Soft wood counter, dimmed warm incandescent lantern light.'
  },
  {
    mood: 'adventurous',
    title: 'Midnight Curry Ramen',
    subtitle: 'Unrushed spice & hearty joy',
    bowlId: 'midnight-curry',
    quote: 'For the nights when curiosity strikes past midnight and you crave rich, fragrant Japanese curry over chewy noodles.',
    notes: '12-spice curry compote · Caramelized onion · Tender pork & onsen egg',
    ambientVibe: 'Rain tapping against copper eaves, steam rising.'
  },
  {
    mood: 'quiet',
    title: 'Starlit Shoyu',
    subtitle: 'Clarity under the constellations',
    bowlId: 'starlit-shoyu',
    quote: 'For solitary late-night hours when you want a delicate, translucent broth that comforts without overwhelming.',
    notes: 'Kombu chicken dashi · Wakayama barrel shoyu · Crisp nori',
    ambientVibe: 'Corner window seat, watching distant city lights flicker.'
  },
  {
    mood: 'spicy',
    title: 'Dream Chaser Spicy Ramen',
    subtitle: 'A spirited spark in the night',
    bowlId: 'dream-chaser-spicy',
    quote: 'For those who find energy when others are asleep, chasing ambition with fiery chili oil and crushed toasted peanuts.',
    notes: 'Fermented chili miso · Roasted garlic oil · Soft-boiled ajitama',
    ambientVibe: 'Rhythm of noodles swirling in boiling kettles, lively kitchen hum.'
  },
  {
    mood: 'dreamy',
    title: 'Moonlit Miso',
    subtitle: 'Golden glow in dark waters',
    bowlId: 'moonlit-miso',
    quote: 'Our house favorite — golden, gentle, with sweet charred corn and melting butter like moonlight resting on still lake water.',
    notes: 'Triple miso · Hokkaido churned butter · Jammy golden egg',
    ambientVibe: 'Lo-fi chimes, steam spiraling toward dark pine ceilings.'
  }
];
