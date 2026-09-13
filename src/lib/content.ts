export const BOOKING_URL = "https://venue.ink/@goodnina_tattooing";
export const INSTAGRAM_URL = "https://www.instagram.com/goodnina_tattooing/";
export const INSTAGRAM_HANDLE = "@goodnina_tattooing";

export type Lang = "es" | "en";
export type Category = "floral" | "ornamental" | "lettering" | "fineline";

export type Work = {
  id: string;
  src: string;
  category: Category;
  wide?: boolean;
  object?: "left" | "center" | "top";
  alt: { es: string; en: string };
};

export const works: Work[] = [
  {
    id: "poetry-anemones",
    src: "/images/gallery/poetry-anemones.jpg",
    category: "floral",
    alt: {
      es: "Anémonas cubriendo el rostro, y arriba: “She lives in the poetry she cannot write.”",
      en: "Anemones covering the face, with “She lives in the poetry she cannot write” above.",
    },
  },
  {
    id: "cautionary-tale",
    src: "/images/gallery/cautionary-tale.jpg",
    category: "lettering",
    alt: {
      es: "Lettering corto y limpio: “a cautionary tale.”",
      en: "Short, clean lettering: “a cautionary tale.”",
    },
  },
  {
    id: "blackberry",
    src: "/images/gallery/blackberry.jpg",
    category: "floral",
    alt: {
      es: "Zarzamoras y flores silvestres en el antebrazo, con un pequeño sello junto a la muñeca.",
      en: "Wild blackberries and blossoms on the forearm, with a small stamp at the wrist.",
    },
  },
  {
    id: "moon-hills",
    src: "/images/gallery/moon-hills.jpg",
    category: "fineline",
    alt: {
      es: "Luna, estrellas y un horizonte de montañas, todo en una sola línea.",
      en: "Moon, stars, and a mountain line — all in a single quiet stroke.",
    },
  },
  {
    id: "heart-cross",
    src: "/images/gallery/heart-cross.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Un corazón de tallo y una amapola, unido a una cruz en fine line.",
      en: "A stem-drawn heart and poppy, joined to a small cross in fine line.",
    },
  },
  {
    id: "wonder-lost",
    src: "/images/gallery/wonder-lost.jpg",
    category: "lettering",
    alt: {
      es: "Lettering cursivo: “Not all those who wonder are lost.”",
      en: "Script lettering: “Not all those who wonder are lost.”",
    },
  },
  {
    id: "puppy",
    src: "/images/gallery/puppy.jpg",
    category: "fineline",
    alt: {
      es: "Un perrito diminuto en fine line, apenas una silueta en el brazo.",
      en: "A tiny dog in fine line — just a silhouette on the arm.",
    },
  },
  {
    id: "vine-arm",
    src: "/images/gallery/vine-arm.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Enredadera de campanillas en fine line, subiendo por el brazo.",
      en: "Fine-line morning glories climbing the upper arm.",
    },
  },
  {
    id: "golden-ratio",
    src: "/images/gallery/golden-ratio.jpg",
    category: "ornamental",
    alt: {
      es: "Espiral áurea y cuadrados de Fibonacci, dibujados a línea fina.",
      en: "A golden-ratio spiral and Fibonacci squares, drawn in fine line.",
    },
  },
  {
    id: "consider-lilies",
    src: "/images/gallery/consider-lilies.jpg",
    category: "floral",
    alt: {
      es: "Dos lirios en fine line y el verso “consider the lilies” — Mateo 6:28.",
      en: "Two fine-line lilies and the line “consider the lilies” — Matthew 6:28.",
    },
  },
  {
    id: "roadrunner",
    src: "/images/gallery/roadrunner.jpg",
    category: "fineline",
    alt: {
      es: "Un correcaminos en fine line, de paso ligero sobre el brazo.",
      en: "A roadrunner in fine line, mid-stride on the arm.",
    },
  },
  {
    id: "mason-jar",
    src: "/images/gallery/mason-jar.jpg",
    category: "floral",
    alt: {
      es: "Un frasco con lavanda, margaritas, un colibrí y una mariposa, en el tobillo.",
      en: "A jar of lavender and daisies, with a hummingbird and a butterfly, on the ankle.",
    },
  },
  {
    id: "raven-book",
    src: "/images/gallery/raven-book.jpg",
    category: "lettering",
    alt: {
      es: "Un cuervo sobre un libro abierto, y debajo: “You have been in every line I have ever read.”",
      en: "A raven on an open book, and below: “You have been in every line I have ever read.”",
    },
  },
  {
    id: "thunderbird",
    src: "/images/gallery/thunderbird.jpg",
    category: "ornamental",
    alt: {
      es: "Ave del trueno en línea fina sobre la muñeca.",
      en: "A thunderbird in fine line on the wrist.",
    },
  },
  {
    id: "lily-shoulder",
    src: "/images/gallery/lily-shoulder.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Lirios recorriendo el hombro, ya curados, en fine line.",
      en: "Lilies running over the shoulder, healed, in fine line.",
    },
  },
  {
    id: "astronaut-neck",
    src: "/images/gallery/astronaut-neck.jpg",
    category: "fineline",
    alt: {
      es: "Un astronauta en la nuca, con estrellas, lunas y un planeta a su alrededor.",
      en: "An astronaut at the nape, with stars, moons, and a planet around him.",
    },
  },
  {
    id: "astronaut-detail",
    src: "/images/gallery/astronaut-detail.jpg",
    category: "fineline",
    alt: {
      es: "Detalle del astronauta: sombreado suave y traje en fine line.",
      en: "Detail of the astronaut — soft shading and a fine-line suit.",
    },
  },
  {
    id: "line-portraits",
    src: "/images/gallery/line-portraits.jpg",
    category: "fineline",
    alt: {
      es: "Dos perfiles en una sola línea, con flores y las fechas 2007 y 1983.",
      en: "Two profiles in a single line, with flowers and the years 2007 and 1983.",
    },
  },
  {
    id: "bull-skull",
    src: "/images/gallery/bull-skull.jpg",
    category: "floral",
    alt: {
      es: "Cráneo de toro con una figura, una cruz y flores, en el costado.",
      en: "A bull skull with a small figure, a cross, and flowers, on the side.",
    },
  },
  {
    id: "ohana",
    src: "/images/gallery/ohana.jpg",
    category: "lettering",
    wide: true,
    alt: {
      es: "Hibisco, lettering y pequeñas figuras recorriendo el antebrazo — Ohana y Hakuna Matata.",
      en: "Hibiscus, lettering, and small figures along the forearm — Ohana and Hakuna Matata.",
    },
  },
  {
    id: "floral-shark",
    src: "/images/gallery/floral-shark.jpg",
    category: "fineline",
    alt: {
      es: "Un tiburón en contorno, lleno de flores, en la espalda.",
      en: "An outline of a shark, filled with flowers, on the back.",
    },
  },
  {
    id: "mandala-eye",
    src: "/images/gallery/mandala-eye.jpg",
    category: "ornamental",
    object: "left",
    alt: {
      es: "Mandala ornamental con un ojo al centro y geometría bajando hacia la mano.",
      en: "An ornamental mandala with an eye at the center, geometry running to the hand.",
    },
  },
  {
    id: "shoulder-garden",
    src: "/images/gallery/shoulder-garden.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Flores en el hombro, una mariposa y un cráneo con lettering al costado.",
      en: "Flowers on the shoulder, a butterfly, and a floral skull with lettering down the arm.",
    },
  },
  {
    id: "back-florals",
    src: "/images/gallery/back-florals.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Amapolas, narcisos y una margarita recorriendo el omóplato, en fine line.",
      en: "Poppies, daffodils, and a daisy running over the shoulder blade, in fine line.",
    },
  },
  {
    id: "finger-script",
    src: "/images/gallery/finger-script.jpg",
    category: "lettering",
    alt: {
      es: "Lettering minúsculo en los dedos: una firma en cursiva y un numeral romano.",
      en: "Tiny lettering on the fingers — a script initial and a Roman numeral.",
    },
  },
  {
    id: "calla-lilies",
    src: "/images/gallery/calla-lilies.jpg",
    category: "floral",
    alt: {
      es: "Dos calas en una sola línea, recién hechas en el antebrazo.",
      en: "Two calla lilies in a single line, fresh on the forearm.",
    },
  },
  {
    id: "lily-stars",
    src: "/images/gallery/lily-stars.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Lirios y estrellas recorriendo el brazo, y “Fiat” escrito en el dorso de la mano.",
      en: "Lilies and stars running down the arm, with “Fiat” on the back of the hand.",
    },
  },
  {
    id: "matching-anchors",
    src: "/images/gallery/matching-anchors.jpg",
    category: "fineline",
    alt: {
      es: "Dos anclas pequeñas a juego — una en la muñeca, otra en el pecho.",
      en: "Two small matching anchors — one on the wrist, one on the chest.",
    },
  },
  {
    id: "sylvia",
    src: "/images/gallery/sylvia.jpg",
    category: "lettering",
    alt: {
      es: "El nombre “sylvia” en una cursiva fina y limpia.",
      en: "The name “sylvia” in a quiet, fine script.",
    },
  },
  {
    id: "rosary",
    src: "/images/gallery/rosary.jpg",
    category: "floral",
    alt: {
      es: "Un rosario de rosa, lirio, mariposas y una cruz, cayendo por el antebrazo.",
      en: "A rosary of rose, lily, butterflies, and a cross, falling down the forearm.",
    },
  },
  {
    id: "rib-hummingbird",
    src: "/images/gallery/rib-hummingbird.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Narcisos y amapolas en el costado, con un colibrí acercándose a las flores.",
      en: "Daffodils and poppies on the rib, with a hummingbird leaning into the flowers.",
    },
  },
  {
    id: "geometric-cube",
    src: "/images/gallery/geometric-cube.jpg",
    category: "ornamental",
    alt: {
      es: "Un cubo geométrico de grecas y un patrón de estrellas en la nuca.",
      en: "A geometric cube of meanders and a star pattern at the nape.",
    },
  },
  {
    id: "running-horses",
    src: "/images/gallery/running-horses.jpg",
    category: "fineline",
    alt: {
      es: "Tres caballos diminutos al galope, en una sola línea sobre la piel.",
      en: "Three tiny horses in a gallop, drawn in a single quiet line.",
    },
  },
  {
    id: "kite-line",
    src: "/images/gallery/kite-line.jpg",
    category: "fineline",
    alt: {
      es: "Una cometa y su hilo, todo en un trazo continuo.",
      en: "A kite and its string, all in one continuous stroke.",
    },
  },
  {
    id: "spider-star",
    src: "/images/gallery/spider-star.jpg",
    category: "fineline",
    alt: {
      es: "Una araña diminuta colgando de una estrella, en la muñeca.",
      en: "A tiny spider hanging from a star, on the wrist.",
    },
  },
  {
    id: "cowboy-skull",
    src: "/images/gallery/cowboy-skull.jpg",
    category: "fineline",
    alt: {
      es: "Un cráneo de toro con un vaquero y una cruz, en el interior del brazo.",
      en: "A bull skull with a small cowboy and a cross, on the inner arm.",
    },
  },
  {
    id: "celtic-knots",
    src: "/images/gallery/celtic-knots.jpg",
    category: "ornamental",
    alt: {
      es: "Cuatro nudos celtas en cruz, rodeados de un punteado suave.",
      en: "Four Celtic knots in a cross, ringed with a soft stipple.",
    },
  },
  {
    id: "lily-ribbon",
    src: "/images/gallery/lily-ribbon.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Un lirio en el hombro, con un listón y estrellas que lo rodean.",
      en: "A lily on the shoulder, with a ribbon and stars around it.",
    },
  },
  {
    id: "paisley-lotus",
    src: "/images/gallery/paisley-lotus.jpg",
    category: "ornamental",
    alt: {
      es: "Un loto ornamental con volutas de paisley recorriendo el antebrazo.",
      en: "An ornamental lotus with paisley scrolls running the forearm.",
    },
  },
  {
    id: "stipple-ankle",
    src: "/images/gallery/stipple-ankle.jpg",
    category: "ornamental",
    alt: {
      es: "Un rombo ornamental en punteado, sobre el tobillo.",
      en: "An ornamental diamond in stipple, on the ankle.",
    },
  },
  {
    id: "gone-fishing",
    src: "/images/gallery/gone-fishing.jpg",
    category: "lettering",
    alt: {
      es: "“GONE fishing” con una caña y la fecha 1.7.23.",
      en: "“GONE fishing” with a rod and the date 1.7.23.",
    },
  },
  {
    id: "friends-wherever",
    src: "/images/gallery/friends-wherever.jpg",
    category: "lettering",
    alt: {
      es: "Lettering cursivo bajando el antebrazo: “you'll have friends wherever you go.”",
      en: "Script running down the forearm: “you'll have friends wherever you go.”",
    },
  },
  {
    id: "sternum-ornament",
    src: "/images/gallery/sternum-ornament.jpg",
    category: "ornamental",
    alt: {
      es: "Un adorno simétrico en punteado, colocado en el esternón.",
      en: "A symmetrical stippled ornament, placed on the sternum.",
    },
  },
  {
    id: "lego-brick",
    src: "/images/gallery/lego-brick.jpg",
    category: "fineline",
    alt: {
      es: "Un ladrillo de construcción en fine line, pequeño y preciso.",
      en: "A building brick in fine line — small and precise.",
    },
  },
  {
    id: "burn-slow",
    src: "/images/gallery/burn-slow.jpg",
    category: "ornamental",
    alt: {
      es: "“burn slow” en el dorso de la mano, con estrellas y marcas ornamentales en los dedos.",
      en: "“burn slow” on the back of the hand, with stars and ornamental marks on the fingers.",
    },
  },
  {
    id: "ladybug",
    src: "/images/gallery/ladybug.jpg",
    category: "fineline",
    alt: {
      es: "Una mariquita diminuta — del tamaño de un centavo — en fine line.",
      en: "A tiny ladybug, about the size of a penny, in fine line.",
    },
  },
  {
    id: "zia-sun",
    src: "/images/gallery/zia-sun.jpg",
    category: "ornamental",
    alt: {
      es: "El sol Zia, símbolo de Nuevo México, en una línea limpia sobre la muñeca.",
      en: "The Zia sun, New Mexico’s symbol, in a clean line on the wrist.",
    },
  },
  {
    id: "lightly-child",
    src: "/images/gallery/lightly-child.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "“lightly child” en cursiva junto a un hombro de flores y una mariposa.",
      en: "“lightly child” in script beside a shoulder of flowers and a butterfly.",
    },
  },
  {
    id: "lotus-ribs",
    src: "/images/gallery/lotus-ribs.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Un loto y una campanilla recorriendo el costado, con tallos que siguen el cuerpo.",
      en: "A lotus and a bellflower along the ribs, stems following the body.",
    },
  },
  {
    id: "dragonflies",
    src: "/images/gallery/dragonflies.jpg",
    category: "fineline",
    alt: {
      es: "Cuatro libélulas diminutas y corazones sobre la clavícula.",
      en: "Four tiny dragonflies and hearts across the collarbone.",
    },
  },
  {
    id: "wild-stems",
    src: "/images/gallery/wild-stems.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Tallos silvestres envolviendo el brazo, finos y botánicos.",
      en: "Wild stems wrapping the arm — thin, botanical, quiet.",
    },
  },
  {
    id: "finger-charms",
    src: "/images/gallery/finger-charms.jpg",
    category: "fineline",
    alt: {
      es: "Miniaturas en los dedos: un candado, una vela y una hoja.",
      en: "Tiny charms on the fingers: a lock, a candle, and a leaf.",
    },
  },
  {
    id: "swallows-vine",
    src: "/images/gallery/swallows-vine.jpg",
    category: "floral",
    object: "left",
    alt: {
      es: "Una enredadera de florecitas recorriendo el hombro, con dos golondrinas.",
      en: "A vine of small blossoms over the shoulder, with two swallows.",
    },
  },
  {
    id: "moth-chest",
    src: "/images/gallery/moth-chest.jpg",
    category: "fineline",
    alt: {
      es: "Una polilla detallada en el pecho, con una estrella debajo.",
      en: "A detailed moth on the chest, with a small star beneath it.",
    },
  },
  {
    id: "pinky-promise",
    src: "/images/gallery/pinky-promise.jpg",
    category: "fineline",
    alt: {
      es: "Dos manos en promesa, con signos zodiacales y una estrella al centro.",
      en: "Two hands in a pinky promise, with zodiac marks and a star between them.",
    },
  },
  {
    id: "let-them",
    src: "/images/gallery/let-them.jpg",
    category: "lettering",
    alt: {
      es: "Lettering cursivo: “let them.”",
      en: "Script lettering: “let them.”",
    },
  },
  {
    id: "floral-sleeve",
    src: "/images/gallery/floral-sleeve.jpg",
    category: "floral",
    alt: {
      es: "Un medio sleeve floral: lirio, girasol, rosa y margarita, con sombreado suave.",
      en: "A floral half-sleeve — lily, sunflower, rose, and daisy, with soft shading.",
    },
  },
  {
    id: "axolotl",
    src: "/images/gallery/axolotl.jpg",
    category: "fineline",
    alt: {
      es: "Un ajolote con sombrero de mago, en fine line y punteado.",
      en: "An axolotl in a wizard hat, in fine line and stipple.",
    },
  },
  {
    id: "diver",
    src: "/images/gallery/diver.jpg",
    category: "fineline",
    alt: {
      es: "Una nadadora diminuta, a punto de entrar al agua.",
      en: "A tiny swimmer, just as she enters the water.",
    },
  },
];

/** Homepage cover: best of each category, magazine order. Full set lives in /galeria. */
export const coverIds = [
  "back-florals",
  "raven-book",
  "mandala-eye",
  "floral-sleeve",
  "line-portraits",
  "friends-wherever",
  "paisley-lotus",
  "rosary",
  "axolotl",
  "swallows-vine",
  "golden-ratio",
  "cowboy-skull",
] as const;

export const featuredWorks = coverIds.map(
  (id) => works.find((w) => w.id === id)!,
);

export const copy = {
  es: {
    metaTitle: "Nina Romero | Tatuadora fine line en Albuquerque, NM",
    metaDescription:
      "Tatuajes fine line, florales y ornamentales a medida, por Nina Romero — tatuadora cubana en Albuquerque, Nuevo México. Mira el trabajo y agenda por Venue.",
    ogAlt:
      "Nina Romero, tatuadora fine line en Albuquerque, entre flores, con corona de margaritas y crisantemos.",
    skip: "Saltar al contenido",
    nav: {
      work: "Galería",
      about: "Sobre",
      faq: "Preguntas",
      book: "Agendar",
    },
    langLabel: "Idioma",
    hero: {
      kicker: "Albuquerque, New Mexico",
      title: "Nina Romero",
      lede: "Fine line tattoo · Floral · Ornamental",
    },
    intro: {
      title: "Dibujado para quien lo lleva",
      p1: "Soy Nina Romero, tatuadora cubana en Albuquerque, Nuevo México. Mi trabajo se centra en el fine line y en los detalles delicados. Me inspiran los elementos botánicos, las formas orgánicas y los diseños ornamentales, aunque disfruto explorar otras ideas siempre con una estética sutil y limpia.",
      p2: "Me gusta crear piezas a medida que acompañen el cuerpo y se sientan personales. Cada tatuaje es una forma de hacer algo bonito, intencional y especial — pensado para sentirse verdaderamente tuyo.",
    },
    styles: {
      title: "El trabajo, por tipo",
      items: [
        {
          name: "Fine line",
          body: "Trazo fino y detalle de una sola aguja. Piezas pequeñas y precisas: un retrato en una línea, un animal diminuto, una marca que se lee como un dibujo de cerca.",
        },
        {
          name: "Floral",
          body: "Lirios, amapolas, enredaderas y tallos silvestres que siguen el hombro, el costado, el brazo. Botánica a medida — no flash de catálogo.",
        },
        {
          name: "Ornamental",
          body: "Mandalas, paisley, geometría y punteado. Trabajo que se sienta como una joya en el esternón, la mano o el tobillo.",
        },
        {
          name: "Lettering",
          body: "Un nombre, un verso, una sola línea en cursiva. Lettering que pertenece a la piel, con el ritmo y el peso de una escritura hecha a mano.",
        },
      ],
    },
    quote:
      "Cada tatuaje es una forma de crear algo bonito, intencional y especial — pensado para sentirse verdaderamente tuyo.",
    gallery: {
      title: "Galería",
      pageTitle: "Galería de tatuajes",
      metaTitle: "Galería de tatuajes | Fine line y floral — Nina Romero",
      metaDescription:
        "Tatuajes fine line, florales, ornamentales y lettering de Nina Romero en Albuquerque, NM. Piezas curadas y recientes. Agenda una sesión por Venue.",
      hint: "Desliza hacia el lado.",
      lede: "Piezas curadas y recientes: floral, ornamental, lettering y fine line. Toca una para verla de cerca.",
      all: "Ver todo",
      filterAll: "Todas",
      filters: {
        floral: "Floral",
        ornamental: "Ornamental",
        lettering: "Lettering",
        fineline: "Fine line",
      },
      empty: "No hay piezas en esta categoría todavía.",
      close: "Cerrar",
      prev: "Anterior",
      next: "Siguiente",
    },
    faq: {
      title: "Preguntas frecuentes",
      items: [
        {
          q: "¿Cómo agendo un tatuaje con Nina Romero?",
          a: "Reserva por Venue o escríbeme por Instagram (@goodnina_tattooing). Incluye referencias, zona del cuerpo, tamaño aproximado y tu disponibilidad. Trabajo con cita en Albuquerque, Nuevo México.",
        },
        {
          q: "¿Cuánto cuesta un tatuaje fine line en Albuquerque?",
          a: "El precio depende del tamaño, el detalle y la colocación. El trabajo custom de fine line, floral y ornamental se cotiza después de ver tu idea y dónde va en el cuerpo. Normalmente se pide un depósito para guardar la fecha.",
        },
        {
          q: "¿Dónde está el estudio de tatuaje?",
          a: "Tatuo en Albuquerque, Nuevo México. La dirección exacta y las notas de estacionamiento se comparten cuando se confirma la cita.",
        },
        {
          q: "¿Solo haces fine line, floral y ornamental?",
          a: "Ese es el centro de mi trabajo: fine line, botánica, ornamental y lettering. Si tu idea cabe en esa línea — un mandala, un verse, un animal en un trazo — podemos hablarlo. No hago realismo a color ni piezas de catálogo.",
        },
        {
          q: "¿Cómo me preparo para la cita?",
          a: "Los días previos: nada de alcohol, sol fuerte ni medicamentos que adelgacen la sangre, salvo prescripción. El día de la cita, duerme, come, llega limpia/o y con ropa que deje acceso a la zona. Lleva identificación.",
        },
        {
          q: "¿Cómo se cuida un tatuaje fine line?",
          a: "Deja el vendaje el tiempo que te indique. Lava con agua tibia y jabón sin perfume, seca sin frotar y aplica una capa fina de la crema recomendada. Nada de piscinas ni sol directo hasta que sane. No recojas costras — en fine line eso se nota más.",
        },
        {
          q: "¿Haces retoques?",
          a: "Cuando esté completamente sano, si alguna zona necesita un retoque, escríbeme por Instagram o Venue dentro de la ventana que te dé.",
        },
      ],
    },
    book: {
      title: "Agenda un tatuaje a medida",
      body: "Las sesiones se reservan por Venue: referencias, colocación, tamaño y tus fechas. Tatuo en Albuquerque, Nuevo México. Si prefieres, también puedes escribirme por Instagram.",
      cta: "Agendar en Venue",
      instagram: "Instagram",
    },
    footer: {
      location: "Albuquerque, New Mexico",
      legal: "Aviso legal",
      privacy: "Privacidad",
      credit:
        "Nina Romero — tatuadora cubana en Albuquerque. Fine line, floral y ornamental.",
      work: "Galería",
      book: "Agendar",
    },
    privacy: {
      title: "Privacidad",
      metaTitle: "Privacidad | Nina Romero",
      metaDescription:
        "Cómo trata este portafolio los datos: sin formularios en el servidor; las citas se reservan en Venue e Instagram.",
      body: "Este sitio es un portafolio. No guarda formularios ni datos personales en este servidor. Las citas se reservan en Venue; Instagram y Venue tienen sus propias políticas. No se necesitan cookies de seguimiento para ver el sitio.",
    },
    legal: {
      title: "Aviso legal",
      metaTitle: "Aviso legal | Nina Romero",
      metaDescription:
        "Aviso legal del portafolio de Nina Romero (Jaline Romero Heredia), tatuadora en Albuquerque, Nuevo México.",
      body: "Artista: Nina Romero (Jaline Romero Heredia). Albuquerque, Nuevo México, EE. UU. Este sitio web es un portafolio de tatuaje fine line, floral y ornamental. Instagram @goodnina_tattooing.",
    },
  },
  en: {
    metaTitle: "Nina Romero | Fine Line Tattoo Artist in Albuquerque, NM",
    metaDescription:
      "Custom fine line, floral, and ornamental tattoos by Nina Romero — Cuban tattoo artist in Albuquerque, New Mexico. View the work and book a session on Venue.",
    ogAlt:
      "Nina Romero, fine line tattoo artist in Albuquerque, among daisies and chrysanthemums.",
    skip: "Skip to content",
    nav: {
      work: "Gallery",
      about: "About",
      faq: "FAQ",
      book: "Book",
    },
    langLabel: "Language",
    hero: {
      kicker: "Albuquerque, New Mexico",
      title: "Nina Romero",
      lede: "Fine line tattoo · Floral · Ornamental",
    },
    intro: {
      title: "Drawn for the person wearing it",
      p1: "I'm Nina Romero, a Cuban tattoo artist in Albuquerque, New Mexico. My work centers on fine line and delicate detail. I'm especially drawn to botanical elements, organic forms, and ornamental design, though I enjoy exploring other ideas while keeping a quiet, clean aesthetic.",
      p2: "I like making custom pieces that sit naturally on the body and feel personal to the person wearing them. Every tattoo is a way of making something beautiful, intentional, and special — meant to feel truly yours.",
    },
    styles: {
      title: "The work, by kind",
      items: [
        {
          name: "Fine line",
          body: "A quiet mark and single-needle detail. Small, precise pieces — a one-line portrait, a tiny animal, a drawing that reads as a line from across the room.",
        },
        {
          name: "Floral",
          body: "Lilies, poppies, vines, and wild stems that follow a shoulder, a rib, an arm. Custom botanicals — not a flash sheet.",
        },
        {
          name: "Ornamental",
          body: "Mandalas, paisley, geometry, and stipple. Work that sits like jewelry on the sternum, the hand, the ankle.",
        },
        {
          name: "Lettering",
          body: "A name, a verse, a single line of script. Lettering that belongs on skin, with the weight and rhythm of a hand.",
        },
      ],
    },
    quote:
      "Every tattoo is a way of making something beautiful, intentional, and special — meant to feel truly yours.",
    gallery: {
      title: "Gallery",
      pageTitle: "Tattoo gallery",
      metaTitle: "Tattoo Gallery | Fine Line & Floral — Nina Romero",
      metaDescription:
        "Custom fine line, floral, ornamental, and lettering tattoos by Nina Romero in Albuquerque, NM. Healed and fresh work — book a session on Venue.",
      hint: "Slide sideways.",
      lede: "Healed and fresh tattoos — floral, ornamental, lettering, and fine line. Tap a piece to look closer.",
      all: "See all",
      filterAll: "All",
      filters: {
        floral: "Floral",
        ornamental: "Ornamental",
        lettering: "Lettering",
        fineline: "Fine line",
      },
      empty: "Nothing in this category yet.",
      close: "Close",
      prev: "Previous",
      next: "Next",
    },
    faq: {
      title: "Frequently asked",
      items: [
        {
          q: "How do I book a tattoo with Nina Romero?",
          a: "Book through Venue or write me on Instagram (@goodnina_tattooing). Include references, placement, approximate size, and your availability. I tattoo by appointment in Albuquerque, New Mexico.",
        },
        {
          q: "How much does a fine line tattoo cost in Albuquerque?",
          a: "Price depends on size, detail, and placement. Custom fine line, floral, and ornamental work is quoted after I see your idea and where it sits on the body. A deposit is typically required to hold the date.",
        },
        {
          q: "Where is the tattoo studio?",
          a: "I tattoo in Albuquerque, New Mexico. The exact address and parking notes are shared when your appointment is confirmed.",
        },
        {
          q: "Do you only tattoo fine line, floral, and ornamental?",
          a: "That's the center of the work: fine line, botanicals, ornamental, and lettering. If your idea lives in that line — a mandala, a verse, an animal in a single stroke — we can talk. I don't do color realism or flash-sheet pieces.",
        },
        {
          q: "How should I prepare for my appointment?",
          a: "In the days before: no alcohol, heavy sun, or blood-thinning medication unless prescribed. The day of, sleep, eat, arrive clean, and wear clothing that gives access to the area. Bring ID.",
        },
        {
          q: "How do I take care of a fine line tattoo?",
          a: "Leave the bandage on for the time I tell you. Wash with lukewarm water and unscented soap, pat dry, and apply a thin layer of the recommended ointment. No pools or direct sun until healed. Don't pick scabs — it shows more in fine line.",
        },
        {
          q: "Do you do touch-ups?",
          a: "Once fully healed, if a small area needs a touch-up, reach out via Instagram or Venue within the window I give you.",
        },
      ],
    },
    book: {
      title: "Book a custom tattoo",
      body: "Sessions are reserved through Venue — references, placement, size, and your dates. I tattoo in Albuquerque, New Mexico. If you prefer, you can also write me on Instagram.",
      cta: "Book on Venue",
      instagram: "Instagram",
    },
    footer: {
      location: "Albuquerque, New Mexico",
      legal: "Legal",
      privacy: "Privacy",
      credit:
        "Nina Romero — Cuban tattoo artist in Albuquerque. Fine line, floral & ornamental.",
      work: "Gallery",
      book: "Book",
    },
    privacy: {
      title: "Privacy",
      metaTitle: "Privacy | Nina Romero",
      metaDescription:
        "How this portfolio handles data: no forms stored here; booking happens on Venue and Instagram.",
      body: "This site is a portfolio. It does not store forms or personal data on this server. Booking happens on Venue; Instagram and Venue have their own policies. No tracking cookies are required to view the site.",
    },
    legal: {
      title: "Legal",
      metaTitle: "Legal | Nina Romero",
      metaDescription:
        "Legal notice for Nina Romero (Jaline Romero Heredia), tattoo artist in Albuquerque, New Mexico.",
      body: "Artist: Nina Romero (Jaline Romero Heredia). Albuquerque, New Mexico, USA. This website is a portfolio of fine line, floral, and ornamental tattooing. Instagram @goodnina_tattooing.",
    },
  },
} as const;

export type Copy = (typeof copy)[Lang];
