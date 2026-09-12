import { BrothOption, NoodleOption, ProteinOption, ToppingOption, ExtraOption } from '../types';

export const BASE_BOWL_PRICE = 12.0;

export const BROTH_OPTIONS: BrothOption[] = [
  {
    id: 'miso',
    name: 'Miso Broth',
    description: 'Triple-fermented white and red miso, slow-simmered with kombu and sesame.',
    additionalPrice: 0,
    color: '#D49B55',
    flavorProfile: 'Rich, Umami & Golden'
  },
  {
    id: 'shoyu',
    name: 'Shoyu Broth',
    description: 'Delicate clear dashi broth steeped with barrel-aged soy sauce and bonito flakes.',
    additionalPrice: 0,
    color: '#8A5328',
    flavorProfile: 'Light, Balanced & Clean'
  },
  {
    id: 'tonkotsu',
    name: 'Tonkotsu Broth',
    description: '12-hour simmered pork marrow broth, creamy and silky with natural collagen.',
    additionalPrice: 1.0,
    color: '#EAD7C2',
    flavorProfile: 'Velvety, Deep & Savory'
  },
  {
    id: 'curry',
    name: 'Japanese Curry Broth',
    description: 'Warming aromatic curry blend with caramelized root vegetables and mild spices.',
    additionalPrice: 1.0,
    color: '#B26C2A',
    flavorProfile: 'Warm, Hearty & Fragrant'
  },
  {
    id: 'yuzu-veg',
    name: 'Yuzu Vegetable Broth',
    description: 'Pure plant dashi with shiitake, kelp, and bright Kochi citrus zest.',
    additionalPrice: 0,
    color: '#C4D89A',
    flavorProfile: 'Bright, Citrusy & Plant-Based'
  }
];

export const NOODLE_OPTIONS: NoodleOption[] = [
  {
    id: 'thin',
    name: 'Thin Straight Noodles',
    description: 'Hakata-style firm wheat noodles with exceptional bite and quick slurp.',
    firmness: 'Firm / Katame'
  },
  {
    id: 'medium',
    name: 'Medium Wavy Noodles',
    description: 'Classic Sapporo curly yellow noodles designed to catch every drop of broth.',
    firmness: 'Springy / Futsuu'
  },
  {
    id: 'thick',
    name: 'Thick Hand-Cut Noodles',
    description: 'Robust, chewy artisan noodles for bold and hearty broths.',
    firmness: 'Chewy / Mochi'
  }
];

export const PROTEIN_OPTIONS: ProteinOption[] = [
  {
    id: 'chashu',
    name: 'Braised Pork Belly Chashu',
    additionalPrice: 3.0,
    dietary: 'Signature'
  },
  {
    id: 'chicken',
    name: 'Tender Sake Chicken',
    additionalPrice: 2.5,
    dietary: 'Lean'
  },
  {
    id: 'tofu',
    name: 'Pan-Seared Organic Tofu',
    additionalPrice: 1.5,
    dietary: 'Vegetarian'
  },
  {
    id: 'egg-protein',
    name: 'Double Marinated Ajitama Egg',
    additionalPrice: 1.5,
    dietary: 'Vegetarian'
  },
  {
    id: 'none',
    name: 'No Protein (Broth & Veg Focus)',
    additionalPrice: 0,
    dietary: 'Pure'
  }
];

export const TOPPING_OPTIONS: ToppingOption[] = [
  { id: 'ajitama', name: 'Ajitama Egg', additionalPrice: 1.5, category: 'egg' },
  { id: 'corn', name: 'Charred Sweet Corn', additionalPrice: 1.0, category: 'crunch' },
  { id: 'bamboo', name: 'Braised Bamboo Shoots (Menma)', additionalPrice: 1.0, category: 'classic' },
  { id: 'scallions', name: 'Fresh Tokyo Scallions', additionalPrice: 0.5, category: 'fresh' },
  { id: 'mushrooms', name: 'Shiitake Mushrooms', additionalPrice: 1.5, category: 'fresh' },
  { id: 'wood-ear', name: 'Wood Ear Mushroom (Kikurage)', additionalPrice: 1.0, category: 'crunch' },
  { id: 'nori', name: 'Crisp Roasted Nori (2 sheets)', additionalPrice: 1.0, category: 'classic' },
  { id: 'chili-oil', name: 'Midnight House Chili Crisp Oil', additionalPrice: 0.75, category: 'classic' }
];

export const EXTRA_OPTIONS: ExtraOption[] = [
  { id: 'extra-noodles', name: 'Extra Kaedama (Noodle Refill)', price: 2.0 },
  { id: 'extra-egg', name: 'Extra Jammy Ajitama Egg', price: 1.5 },
  { id: 'extra-protein', name: 'Extra Protein Portion', price: 3.0 },
  { id: 'extra-toppings', name: 'Chef’s Trio Topping Bundle', price: 2.5 }
];
