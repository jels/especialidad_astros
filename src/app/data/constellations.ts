export interface ConstellationStar {
  key: string;
  name: string;
  x: number;
  y: number;
  r: number;
  color?: string;
  label?: boolean;
}

export interface ConstellationData {
  id: string;
  name: string;
  latin: string;
  season: string;
  visibleAllYear: boolean;
  accent: string;
  description: string;
  howTo: string;
  fact: string;
  stars: ConstellationStar[];
  links: [string, string][];
}

export const CONSTELLATIONS: ConstellationData[] = [
  {
    id: 'crux',
    name: 'Cruz del Sur',
    latin: 'Crux',
    season: 'Todo el año en el sur',
    visibleAllYear: true,
    accent: '#67e8f9',
    description:
      'Es la cruz más famosa del cielo austral. Su brazo largo funciona como una brújula natural: si lo prolongas, apunta hacia el polo sur celeste.',
    howTo:
      'Busca cuatro estrellas muy brillantes formando una cruz inclinada. Acrux es la de la punta inferior y Gacrux la de arriba.',
    fact: 'Aparece en las banderas de Australia, Brasil, Nueva Zelanda y Samoa, entre otros países del hemisferio sur.',
    stars: [
      { key: 'gacrux', name: 'Gacrux', x: 205, y: 82, r: 5, label: true },
      { key: 'mimosa', name: 'Mimosa', x: 120, y: 192, r: 4.8, label: true },
      { key: 'imai', name: 'Imai', x: 310, y: 208, r: 4 },
      { key: 'eps', name: 'ε Crucis', x: 262, y: 282, r: 3 },
      { key: 'acrux', name: 'Acrux', x: 245, y: 356, r: 5.8, label: true },
    ],
    links: [
      ['gacrux', 'acrux'],
      ['mimosa', 'imai'],
      ['acrux', 'eps'],
      ['eps', 'imai'],
    ],
  },
  {
    id: 'orion',
    name: 'Orión',
    latin: 'Orion',
    season: 'Verano austral',
    visibleAllYear: false,
    accent: '#c4b5fd',
    description:
      'El cazador del cielo. Su cinturón de tres estrellas es una de las figuras más fáciles de reconocer desde casi cualquier lugar del planeta.',
    howTo:
      'Busca tres estrellas casi en línea recta. Arriba a la izquierda está la rojiza Betelgeuse; abajo a la derecha, la azulada Rigel.',
    fact: 'Debajo del cinturón cuelga la nebulosa de Orión, una guardería de estrellas que se ve a simple vista como una manchita difusa.',
    stars: [
      { key: 'meissa', name: 'Meissa', x: 205, y: 62, r: 3 },
      { key: 'betelgeuse', name: 'Betelgeuse', x: 110, y: 122, r: 6, color: '#fca5a5', label: true },
      { key: 'bellatrix', name: 'Bellatrix', x: 300, y: 140, r: 4.5 },
      { key: 'alnitak', name: 'Alnitak', x: 190, y: 245, r: 3.5 },
      { key: 'alnilam', name: 'Alnilam', x: 227, y: 257, r: 3.5 },
      { key: 'mintaka', name: 'Mintaka', x: 264, y: 269, r: 3.5 },
      { key: 'saiph', name: 'Saiph', x: 145, y: 370, r: 4 },
      { key: 'rigel', name: 'Rigel', x: 332, y: 350, r: 5.5, color: '#bfdbfe', label: true },
      { key: 's1', name: 'Espada', x: 216, y: 300, r: 2 },
      { key: 's2', name: 'Espada', x: 222, y: 326, r: 2 },
      { key: 's3', name: 'Espada', x: 228, y: 352, r: 2 },
    ],
    links: [
      ['meissa', 'betelgeuse'],
      ['meissa', 'bellatrix'],
      ['betelgeuse', 'alnitak'],
      ['bellatrix', 'mintaka'],
      ['alnitak', 'alnilam'],
      ['alnilam', 'mintaka'],
      ['alnitak', 'saiph'],
      ['mintaka', 'rigel'],
      ['saiph', 'rigel'],
      ['alnilam', 's1'],
      ['s1', 's2'],
      ['s2', 's3'],
    ],
  },
  {
    id: 'scorpius',
    name: 'Escorpio',
    latin: 'Scorpius',
    season: 'Invierno austral',
    visibleAllYear: false,
    accent: '#fb7185',
    description:
      'Un escorpión de estrellas con un corazón rojo: Antares. Su cola curva se hunde en la zona más brillante de la Vía Láctea.',
    howTo:
      'Busca una estrella rojiza brillante y sigue la curva de estrellas que baja como una cola. Antares está en el centro del animal.',
    fact: 'Muy cerca de Antares, el cielo está tan poblado de estrellas que parece una nube. Estás mirando hacia el centro de nuestra galaxia.',
    stars: [
      { key: 'graffias', name: 'Graffias', x: 55, y: 110, r: 3 },
      { key: 'dschubba', name: 'Dschubba', x: 95, y: 148, r: 4 },
      { key: 'pi', name: 'Pi Scorpii', x: 82, y: 202, r: 3 },
      { key: 'antares', name: 'Antares', x: 190, y: 222, r: 6.5, color: '#fca5a5', label: true },
      { key: 'tau', name: 'Tau Scorpii', x: 255, y: 250, r: 3 },
      { key: 'epsilon', name: 'Epsilon', x: 300, y: 286, r: 3.5 },
      { key: 'mu', name: 'Mu Scorpii', x: 330, y: 325, r: 3 },
      { key: 'zeta', name: 'Zeta', x: 350, y: 364, r: 3.5 },
      { key: 'eta', name: 'Eta', x: 350, y: 404, r: 3 },
      { key: 'theta', name: 'Theta', x: 330, y: 434, r: 3 },
      { key: 'iota', name: 'Iota', x: 306, y: 456, r: 3 },
      { key: 'kappa', name: 'Kappa', x: 286, y: 476, r: 3 },
      { key: 'shaula', name: 'Shaula', x: 264, y: 504, r: 4, label: true },
      { key: 'lesath', name: 'Lesath', x: 248, y: 526, r: 2.8 },
    ],
    links: [
      ['graffias', 'dschubba'],
      ['dschubba', 'pi'],
      ['dschubba', 'antares'],
      ['antares', 'tau'],
      ['tau', 'epsilon'],
      ['epsilon', 'mu'],
      ['mu', 'zeta'],
      ['zeta', 'eta'],
      ['eta', 'theta'],
      ['theta', 'iota'],
      ['iota', 'kappa'],
      ['kappa', 'shaula'],
      ['shaula', 'lesath'],
    ],
  },
  {
    id: 'ursa-major',
    name: 'Osa Mayor',
    latin: 'Ursa Major',
    season: 'Primavera boreal · casi todo el año en el norte',
    visibleAllYear: false,
    accent: '#93c5fd',
    description:
      'Contiene el “cazo” o “carro”: siete estrellas que forman una de las figuras más buscadas del cielo del norte.',
    howTo:
      'Localiza cuatro estrellas formando un recipiente y tres más como el mango. En el hemisferio norte es una gran guía hacia la estrella Polar.',
    fact: 'Si prolongas la línea entre Merak y Dubhe unas cinco veces, llegas a Polaris, la estrella Polar.',
    stars: [
      { key: 'dubhe', name: 'Dubhe', x: 80, y: 122, r: 5, label: true },
      { key: 'merak', name: 'Merak', x: 86, y: 206, r: 4.5, label: true },
      { key: 'phecda', name: 'Phecda', x: 160, y: 220, r: 4.5 },
      { key: 'megrez', name: 'Megrez', x: 176, y: 160, r: 3.8 },
      { key: 'alioth', name: 'Alioth', x: 228, y: 126, r: 4.8 },
      { key: 'mizar', name: 'Mizar', x: 288, y: 100, r: 4.6, label: true },
      { key: 'alkaid', name: 'Alkaid', x: 356, y: 76, r: 4.5 },
    ],
    links: [
      ['dubhe', 'merak'],
      ['merak', 'phecda'],
      ['phecda', 'megrez'],
      ['megrez', 'alioth'],
      ['alioth', 'mizar'],
      ['mizar', 'alkaid'],
      ['megrez', 'dubhe'],
    ],
  },
  {
    id: 'centaurus',
    name: 'Centauro',
    latin: 'Centaurus',
    season: 'Todo el año en el sur',
    visibleAllYear: true,
    accent: '#fcd34d',
    description:
      'Un centauro que rodea a las estrellas más cercanas al Sol. Es una constelación enorme del cielo austral.',
    howTo:
      'Busca a Alfa Centauri, muy brillante y cercana a la Cruz del Sur. El resto del cuerpo se extiende hacia el oeste con Hadar (Beta Centauri).',
    fact: 'Su sistema Alfa Centauri, junto a Próxima, está a 4,37 años luz: es el vecindario estelar más cercano al nuestro.',
    stars: [
      { key: 'alpha', name: 'Alfa Centauri', x: 300, y: 334, r: 6, color: '#fef3c7', label: true },
      { key: 'beta', name: 'Hadar', x: 334, y: 268, r: 4.8, color: '#dbeafe', label: true },
      { key: 'proxima', name: 'Próxima', x: 276, y: 356, r: 2 },
      { key: 'epsilon', name: 'Épsilon', x: 226, y: 300, r: 3.5 },
      { key: 'zeta', name: 'Zeta', x: 184, y: 264, r: 3.2 },
      { key: 'gamma', name: 'Gamma', x: 206, y: 224, r: 3.5 },
      { key: 'delta', name: 'Delta', x: 170, y: 180, r: 3.5 },
      { key: 'eta', name: 'Eta', x: 124, y: 140, r: 3.5 },
      { key: 'theta', name: 'Theta', x: 88, y: 100, r: 3.5 },
      { key: 'iota', name: 'Iota', x: 160, y: 120, r: 3.2 },
    ],
    links: [
      ['alpha', 'beta'],
      ['alpha', 'epsilon'],
      ['alpha', 'proxima'],
      ['epsilon', 'zeta'],
      ['epsilon', 'gamma'],
      ['gamma', 'delta'],
      ['delta', 'eta'],
      ['eta', 'theta'],
      ['theta', 'iota'],
      ['iota', 'gamma'],
      ['zeta', 'eta'],
    ],
  },
  {
    id: 'sagittarius',
    name: 'Sagitario',
    latin: 'Sagittarius',
    season: 'Invierno austral',
    visibleAllYear: false,
    accent: '#f0abfc',
    description:
      'El arquero, conocido por su “tetera”: un grupo de estrellas que realmente parece una tetera. Apunta hacia el centro de la galaxia.',
    howTo:
      'Busca la forma de tetera al sur de Escorpio, en una zona muy rica en estrellas. Es una excelente puerta de entrada a la Vía Láctea.',
    fact: 'Detrás de Sagitario está el centro de la Vía Láctea. La luz de esa zona tarda unos 26.000 años en llegar a nosotros.',
    stars: [
      { key: 'kausB', name: 'Kaus Borealis', x: 160, y: 130, r: 4 },
      { key: 'kausM', name: 'Kaus Media', x: 114, y: 210, r: 4 },
      { key: 'kausA', name: 'Kaus Australis', x: 160, y: 320, r: 5, label: true },
      { key: 'ascella', name: 'Ascella', x: 236, y: 280, r: 4 },
      { key: 'nunki', name: 'Nunki', x: 300, y: 230, r: 4.5, label: true },
      { key: 'alnasl', name: 'Alnasl', x: 130, y: 366, r: 3 },
      { key: 'rukbat', name: 'Rukbat', x: 270, y: 350, r: 3 },
      { key: 'arkab', name: 'Arkab', x: 326, y: 300, r: 3 },
    ],
    links: [
      ['kausB', 'kausM'],
      ['kausM', 'kausA'],
      ['kausA', 'ascella'],
      ['ascella', 'nunki'],
      ['nunki', 'kausB'],
      ['ascella', 'alnasl'],
      ['alnasl', 'kausA'],
      ['ascella', 'rukbat'],
      ['rukbat', 'arkab'],
      ['nunki', 'arkab'],
    ],
  },
];
