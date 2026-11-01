// Default menu — everything here is editable in the site via "Edit menu" (saved in the visitor's browser).
export const DISHES = [
  {
    id: 'ful', no: '01', ar: 'فول', en: 'Ful Medames', arFull: 'فول مدمس',
    img: 'img/ful.webp', thumb: 'img/ful-s.webp', pos: '50% 55%', price: 40,
    bg: '#C8321F', ink: '#F4E7CC', accent: '#E3A92B', glow: '#E3A92B',
    tag: { en: 'Slow-cooked until creamy', ar: 'استواء على نار هادية' },
    desc: {
      en: 'Fava beans simmered low and slow, finished with olive oil, cumin and a squeeze of lemon. Served with baladi bread.',
      ar: 'فول مستوي على نار هادية، بزيت زيتون وكمون وعصرة ليمون. بيتقدم مع العيش البلدي.',
    },
    ingredients: [
      { t: 'fava', en: 'Cooked fava beans', ar: 'فول مدمس' },
      { t: 'oil', en: 'Olive oil', ar: 'زيت زيتون' },
      { t: 'cumin', en: 'Cumin', ar: 'كمون' },
      { t: 'lemon', en: 'Lemon', ar: 'ليمون' },
      { t: 'veg', en: 'Fresh vegetables', ar: 'خضار طازة' },
    ],
  },
  {
    id: 'taameya', no: '02', ar: 'طعمية', en: 'Taameya', arFull: 'طعمية',
    img: 'img/taameya.webp', thumb: 'img/taameya-s.webp', pos: '40% 55%', price: 30,
    bg: '#5E6B2E', ink: '#F4E7CC', accent: '#E3A92B', glow: '#8FA33C',
    tag: { en: 'Crisp outside, green inside', ar: 'مقرمشة برّه، خضرا جوّه' },
    desc: {
      en: 'Egyptian falafel made from fava beans and fresh herbs, rolled in sesame and fried golden. Five pieces with baladi bread.',
      ar: 'طعمية بالفول والتعليقة الخضرا، بالسمسم ومحمّرة دهبي. خمس حبات مع العيش البلدي.',
    },
    ingredients: [
      { t: 'falafel', en: 'Golden crispy falafel', ar: 'طعمية مقرمشة' },
      { t: 'mash', en: 'Fava bean mixture', ar: 'خلطة الفول' },
      { t: 'herb', en: 'Fresh herbs', ar: 'خضرة طازة' },
      { t: 'sesame', en: 'Sesame', ar: 'سمسم' },
      { t: 'bread', en: 'Baladi bread', ar: 'عيش بلدي' },
    ],
  },
  {
    id: 'eggs', no: '03', ar: 'بيض', en: 'Eggs', arFull: 'بيض',
    img: 'img/eggs.webp', thumb: 'img/eggs-s.webp', pos: '50% 55%', price: 45,
    bg: '#E3A92B', ink: '#3A2012', accent: '#C8321F', glow: '#FFD35C',
    tag: { en: 'Sizzling in the pan', ar: 'سخن في الطاسة' },
    desc: {
      en: 'Farm eggs cooked in a hot cast-iron pan with tomato, green pepper and spices. Served sizzling with baladi bread.',
      ar: 'بيض بلدي في طاسة حديد سخنة بالطماطم والفلفل الأخضر والتوابل. بيتقدم ساخن مع العيش البلدي.',
    },
    ingredients: [
      { t: 'egg', en: 'Fried eggs', ar: 'بيض مقلي' },
      { t: 'tomato', en: 'Tomatoes', ar: 'طماطم' },
      { t: 'pepper', en: 'Green peppers', ar: 'فلفل أخضر' },
      { t: 'spice', en: 'Spices', ar: 'توابل' },
      { t: 'bread', en: 'Baladi bread', ar: 'عيش بلدي' },
    ],
  },
  {
    id: 'potatoes', no: '04', ar: 'بطاطس', en: 'Fried Potatoes', arFull: 'بطاطس محمّرة',
    img: 'img/potatoes.webp', thumb: 'img/potatoes-s.webp', pos: '50% 50%', price: 35,
    bg: '#F2E4C8', ink: '#3A2012', accent: '#C8321F', glow: '#E9A93A',
    tag: { en: 'Garlic, coriander, crunch', ar: 'تومية وكزبرة وقرمشة' },
    desc: {
      en: 'Hand-cut potato cubes fried golden, tossed with garlic, fresh coriander, salt and spices while still hot.',
      ar: 'مكعبات بطاطس مقطعة باليد ومحمّرة دهبي، مقلبة بالتومية والكزبرة الخضرا والملح والتوابل وهي سخنة.',
    },
    ingredients: [
      { t: 'potato', en: 'Golden fried potato', ar: 'بطاطس محمّرة' },
      { t: 'salt', en: 'Salt', ar: 'ملح' },
      { t: 'spice', en: 'Spices', ar: 'توابل' },
      { t: 'herb', en: 'Fresh herbs', ar: 'كزبرة خضرا' },
      { t: 'garlic', en: 'Garlic', ar: 'تومية' },
    ],
  },
  {
    id: 'mesaka', no: '05', ar: 'مسقعة', en: "Mesaka'a", arFull: 'مسقعة',
    img: 'img/mesaka.webp', thumb: 'img/mesaka-s.webp', pos: '50% 50%', price: 50,
    bg: '#3A2012', ink: '#F4E7CC', accent: '#C8321F', glow: '#7A3F86',
    tag: { en: 'Eggplant, slow & saucy', ar: 'باذنجان على مهلة' },
    desc: {
      en: 'Fried eggplant slow-cooked in garlicky tomato sauce with green pepper and spices. Rich, smoky and made to be scooped with bread.',
      ar: 'باذنجان مقلي متسبّك في صلصة طماطم بالتومية والفلفل الأخضر والتوابل. غني ومدخّن ومتعمل عشان يتغمّس بالعيش.',
    },
    ingredients: [
      { t: 'eggplant', en: 'Fried eggplant', ar: 'باذنجان مقلي' },
      { t: 'sauce', en: 'Tomato sauce', ar: 'صلصة طماطم' },
      { t: 'garlic', en: 'Garlic', ar: 'تومية' },
      { t: 'pepper', en: 'Green peppers', ar: 'فلفل أخضر' },
      { t: 'spice', en: 'Spices', ar: 'توابل' },
    ],
  },
];

export const MORNING = [
  { time: '05:40', ar: 'الفرن صحي', en: 'The bakery lights go on.' },
  { time: '06:10', ar: 'ريحة العيش البلدي', en: 'Baladi bread, straight from the oven.' },
  { time: '06:40', ar: 'العربية وصلت', en: 'The cart rolls in, the pot still steaming.' },
  { time: '07:05', ar: 'الشارع كله جعان', en: 'And the whole street is hungry.' },
];

export const SETTINGS_DEFAULT = { whatsapp: '201000000000', deliveryFee: 25, currency: 'EGP' };

// small safe localStorage wrapper (can throw in private windows / previews)
export const store = {
  get(k, fb) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch { return fb; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  del(k) { try { localStorage.removeItem(k); } catch { /* ignore */ } },
};
