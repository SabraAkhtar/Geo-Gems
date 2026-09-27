import { EducationalArticle } from '../types';

export const EDUCATIONAL_ARTICLES: EducationalArticle[] = [
  {
    id: 'ruby-guide',
    title: 'Ruby: Color, Character & Beauty',
    subtitle: 'Decoding "Pigeon Blood" Red, Mogok Heritage, and Crystal Fluorescence',
    gemstone: 'Ruby',
    readingTime: '4 min read',
    heroImage: '/stones/ruby.jpg',
    summary: 'Discover what gives natural rubies their fiery luminescence, how chromium creates both color and natural inclusions, and why unheated stones command historical premiums.',
    contentSections: [
      {
        heading: 'The Chemistry of Red Corundum',
        body: 'Ruby is simply the red variety of the mineral corundum (aluminum oxide). What transforms ordinary corundum into the rarest of gems is trace amounts of chromium replacing aluminum in the crystal lattice. However, chromium has an ionic radius larger than aluminum, causing crystal strain that limits the size of ruby crystals in nature.',
      },
      {
        heading: 'What Truly Defines "Pigeon Blood"',
        body: 'The traditional Burmese term "Ko-twe" describes not just a specific red color, but a high degree of red fluorescence under UV light. When daylight strikes a Burmese ruby, the ultraviolet component excites the chromium ions, emitting additional red light that supercharges the color and masks shadowy extinction areas.',
      },
      {
        heading: 'Thermal Treatment Disclosure',
        body: 'Over 95% of rubies on the global market undergo high-temperature heating to dissolve silk inclusions or remove blue secondary tones. At GEO GEMS CRYSTALS, we explicitly distinguish unheated stones verified by independent gemological laboratories (such as GIA or Gübelin) with full disclosure.',
      },
    ],
  },
  {
    id: 'sapphire-guide',
    title: 'Sapphire: A World of Colors',
    subtitle: 'From Kashmir Velvet and Royal Blue to Lotus Padparadscha',
    gemstone: 'Sapphire',
    readingTime: '5 min read',
    heroImage: '/stones/sapphire.jpg',
    summary: 'Sapphire encompasses an entire celestial spectrum. Learn about Ceylon open-blue tones, the elusive Padparadscha sunset blend, and how trace iron and titanium interact.',
    contentSections: [
      {
        heading: 'The Royal Palette of Corundum',
        body: 'While "sapphire" commonly evokes vivid blue, natural corundum forms in every color of the rainbow except pure red (which is classified as ruby). Yellow sapphires gain color from iron, pinks from chromium, and majestic blues from paired intervalence charge transfers between iron (Fe²⁺) and titanium (Ti⁴⁺).',
      },
      {
        heading: 'The Sacred Padparadscha',
        body: 'Derived from the Sinhalese word for "lotus blossom", Padparadscha is the rarest of fancy sapphires. It requires a delicate, natural equilibrium between pink and orange hues without either tone overpowering the other. Genuine Padparadscha specimens are almost exclusively unearthed in Sri Lanka and Madagascar.',
      },
      {
        heading: 'Origins & Geographic Signatures',
        body: 'Ceylon (Sri Lankan) sapphires are celebrated for their "open" crystalline light blue to royal blue tones, rarely turning inky in low light. In contrast, historical Kashmir sapphires are noted for micro-fine inclusions that impart a distinctive velvety softness to the blue body color.',
      },
    ],
  },
  {
    id: 'emerald-guide',
    title: 'Emerald: The Beauty of Green',
    subtitle: 'Appreciating the Poetic "Jardin" and Beryl Inclusions',
    gemstone: 'Emerald',
    readingTime: '4 min read',
    heroImage: '/stones/emerald.jpg',
    summary: 'Unlike diamonds, natural emeralds embrace their inclusions as fingerprint proof of natural genesis. Learn about Muzo hydrothermal formations and safe care.',
    contentSections: [
      {
        heading: 'The Geological Miracle of Emeralds',
        body: 'Emerald formation is an earth paradox. Beryl requires beryllium—a light element concentrated in continental crust pegmatites—while intense green color requires chromium or vanadium, elements concentrated in deep oceanic mantle rocks. Only violent tectonic plate collisions bring these disparate elements together.',
      },
      {
        heading: 'The "Jardin" (Natural Garden)',
        body: 'Due to turbulent hydrothermal growth, natural emeralds contain 3-phase inclusions (microscopic cavities trapping liquid saline, a gas bubble, and a tiny rock salt crystal). In the gem trade, this inner landscape is poetically named the "jardin" (French for garden), celebrating the organic proof of earth-mining.',
      },
      {
        heading: 'Clarity Treatments: Oil vs. Polymers',
        body: 'Because surface-reaching fissures are customary in beryl, ancient Roman and Persian lapidaries soaked stones in pure cedarwood oil to equalize refractive indices. Cedarwood oil is traditional, reversible, and recognized by gem labs. At GEO GEMS CRYSTALS, we reject artificial polymer resins and only accept untreated or minor cedarwood oiled stones.',
      },
    ],
  },
  {
    id: 'amethyst-guide',
    title: 'Amethyst: The Allure of Purple',
    subtitle: 'From Ancient Talismans to Volcanic Geode Formations',
    gemstone: 'Amethyst',
    readingTime: '3 min read',
    heroImage: '/stones/amethyst.jpg',
    summary: 'The premier purple crystal, amethyst combines royal coloration with remarkable durability for daily jewelry wear.',
    contentSections: [
      {
        heading: 'Color Centers & Natural Irradiation',
        body: 'Amethyst gets its purple coloration from trace iron impurities (Fe³⁺) built into the quartz lattice that have been naturally irradiated by surrounding rock strata over millions of years, causing an electron transfer that absorbs green and yellow wavelengths.',
      },
      {
        heading: 'Siberian Quality Benchmark',
        body: 'The highest historical benchmark for amethyst is termed "Deep Siberian", characterized by rich 75-80% dark purple saturation complemented by approximately 20% vivid secondary red flash. Notable modern sources matching this quality include selected Uruguayan deposits.',
      },
      {
        heading: 'Hardness & Daily Wearability',
        body: 'Measuring 7.0 on the Mohs hardness scale, amethyst is resilient against household dust (which is primarily airborne quartz at Mohs 7), making it exceptionally durable for bespoke rings, earrings, and statement necklace pendants.',
      },
    ],
  },
  {
    id: 'carat-cut-guide',
    title: 'Understanding Gemstone Carat & Cut',
    subtitle: 'Why Specific Gravity and Facet Proportion Matter More Than Face Size',
    gemstone: 'Gemology',
    readingTime: '5 min read',
    heroImage: '/stones/quartz.jpg',
    summary: 'Learn why a 1-carat ruby looks smaller than a 1-carat emerald, and how master lapidaries balance optical brilliance with crystal conservation.',
    contentSections: [
      {
        heading: 'Carat Weight vs. Physical Dimensions',
        body: 'One metric carat equals exactly 0.200 grams. However, different gemstone species possess drastically different specific gravities (densities). For example, sapphire has a specific gravity of ~4.00, while emerald has ~2.72. Therefore, a 2-carat emerald will have a noticeably larger millimeter face spread than a 2-carat sapphire.',
      },
      {
        heading: 'Lapidary Art: Colored Stones vs. Diamonds',
        body: 'While diamonds are cut to rigid mathematical symmetry to produce maximum white dispersion, colored gemstones are faceted to optimize body color saturation, minimize color zoning, and conserve irreplaceable rough. A skilled cutter angles facets to avoid "windows" (transparent areas that leak light) while preventing "extinction" (dark dead zones).',
      },
      {
        heading: 'Buying Recommendation for Bespoke Settings',
        body: 'When planning a custom jewelry setting with a master goldsmith, always design around the physical millimeter measurements (length x width x depth) rather than relying solely on nominal carat weight.',
      },
    ],
  },
];
