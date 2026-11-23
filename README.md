# Cosmos 101 · El cielo no es el límite

Sitio web educativo e interactivo de astronomía para adolescentes, desarrollado con **Angular 22** y **Tailwind CSS 4**.

Responde de forma visual los diez puntos del trabajo práctico de Astronomía con simuladores, diagramas SVG, mapas estelares, animaciones y un test final.

La portada funciona como centro de misiones. Cada punto tiene su propia URL y su propia página, con un botón **Empezar misión** desde el inicio y navegación anterior/siguiente al final de cada recorrido.

También incluye un **modo presentación** pensado para proyectar en clase: 14 diapositivas con controles interactivos, tres datos clave por tema, navegación por teclado y pantalla completa.

## Cómo ejecutar

```bash
npm install
npm start
```

Abrir `http://localhost:4200`.

Para generar la versión de producción:

```bash
npm run build
```

Los archivos quedan en `dist/exploradores-del-cielo/browser`.

## Modo presentación

Disponible en `/presentacion` desde el botón **Presentación** del header o desde el menú Índice.

- 14 diapositivas: portada, 11 temas, ronda “Mito o dato” y cierre.
- Cada diapositiva ocupa el ancho y alto disponibles: el panel visual se estira para llenar la pantalla.
- Cada diapositiva tiene un interactivo y un panel con tres datos puntuales.
- Las visuales dinámicas arrancan automáticamente al entrar: los simuladores de **eclipses**, **mareas** y **danza cósmica** de las misiones (con sus órbitas, sombras y controles), lluvia de meteoros, órbita de la luz, sistema solar, amanecer/atardecer de Venus y movimiento del cenit y el nadir. Todas tienen botón de pausa.
- El sistema solar conserva el **mapa orbital en movimiento** de la misión: toca un planeta y se abre su ficha con foto real; al cerrar, el sistema vuelve a moverse.
- **Cinco estrellas fijas** usa el mapa estelar interactivo de la misión.
- **Constelaciones** recorre automáticamente las seis constelaciones, en orden; se puede pausar y elegir una manualmente.
- La Vía Láctea incluye las dos vistas de la misión: **cielo a simple vista** con contaminación lumínica y **galaxia vista desde arriba**.
- El sistema solar usa fotografías reales de NASA/JPL y un botón **Escala con la Tierra** para comparar tamaños relativos.
- Constelaciones muestra los esquemas grandes, con etiquetas y estrellas principales.
- Navegación con `←`, `→`, `Espacio`, `PageUp`, `PageDown`, `Home` y `End`.
- `F` activa o desactiva pantalla completa.
- En móvil se puede deslizar horizontalmente para cambiar de diapositiva.
- El header y el footer del sitio se ocultan durante la presentación para dejar todo el espacio al contenido.
- Los botones de la presentación permiten salir o volver al inicio.

## Rutas principales

| Ruta | Vista |
| --- | --- |
| `/` | Portada: hero y ruta de las 11 misiones |
| `/misiones/eclipses` | Misión 01 · Eclipses |
| `/misiones/estrellas-fugaces` | Misión 02 · Estrellas fugaces |
| `/misiones/velocidad-de-la-luz` | Misión 03 · Velocidad de la luz |
| `/misiones/luna-y-mareas` | Misión 04 · La Luna y las mareas |
| `/misiones/danza-cosmica` | Misión 05 · La danza cósmica |
| `/misiones/sistema-solar` | Misión 06 · El sistema solar |
| `/misiones/estrellas-fijas` | Misión 07 · Estrellas fijas |
| `/misiones/constelaciones` | Misión 08 · Constelaciones |
| `/misiones/via-lactea` | Misión 09 · Vía Láctea |
| `/misiones/lucero-venus` | Misión 10 · El lucero |
| `/misiones/cenit-y-nadir` | Misión 11 · Cenit y nadir |
| `/misiones/test-final` | Test final de 13 preguntas |
| `/test-final` | Redirección al test final |
| `/presentacion` | Presentación interactiva para proyectar |

## Contenido y recorrido

| Misión | Tema | Interacción principal |
| --- | --- | --- |
| 01 | Eclipses (1a) | Simulador Sol–Luna–Tierra con sombras y alineación |
| 02 | Estrellas fugaces (1b) | Cielo canvas para lanzar meteoros y pedir deseos |
| 03 | Velocidad de la luz (1c) | Carrera de velocidades, destinos y rayo de luz |
| 04 | La Luna y las mareas (2a–2c) | Luna orbital, mareas vivas/muertas y distancia a escala |
| 05 | La danza cósmica (3) | Orrery animado con posiciones de eclipses |
| 06 | Sistema solar (4) | Mapa orbital con los ocho planetas y fichas |
| 07 | Estrellas fijas (5) | Mapa austral con cinco estrellas y comparación planeta/estrella |
| 08 | Constelaciones (6–7) | Seis cartas, visibles todo el año y taller de esquemas |
| 09 | Vía Láctea (8) | Simulador de contaminación lumínica, vista galáctica y checklist |
| 10 | El lucero (9) | Simulador de amanecer/atardecer con Venus |
| 11 | Cenit y nadir (10) | Cúpula local interactiva y Tierra con antípoda |
| — | Test final | 13 preguntas con explicaciones, puntaje y rangos |

## Detalles técnicos

- **Angular standalone** con signals, control flow (`@if`, `@for`) y **Angular Router**.
- **Carga diferida** de la portada, de las páginas de misión y de la presentación.
- **Tailwind CSS 4** mediante `@tailwindcss/postcss`.
- **SVG a mano** para todos los diagramas astronómicos y constelaciones.
- **Canvas 2D** para el cielo estrellado global y la lluvia de meteoros.
- **Fotografías planetarias locales** de NASA/JPL (vía Wikimedia Commons) para la presentación y la ficha del sistema solar.
- **Router con scroll al inicio** y restauración de posición; títulos de página dinámicos.
- **Modo presentación** con navegación por teclado, swipe táctil, autoplay con pausa, pantalla completa y ocultamiento del shell del sitio.
- **IntersectionObserver** para revelar secciones y pausar animaciones fuera de pantalla.
- **Diseño responsive** probado en 320, 390, 700, 1024, 1366 y 1920 px, sin scroll horizontal.
- **Accesibilidad**: controles nativos, etiquetas ARIA, foco visible, textos alternativos y respeto por `prefers-reduced-motion`.
- Tipografías: Unbounded y Space Grotesk (Google Fonts).

## Estructura

```text
src/app/
├── app.ts / app.html          # shell: header, índice, footer y router-outlet
├── app.routes.ts              # portada y páginas de misión
├── pages/
│   ├── home/                  # portada con hero, pasos y las 11 tarjetas de misión
│   ├── mission-page/          # layout de misión y navegación anterior/siguiente
│   └── presentation/          # modo presentación: 14 diapositivas interactivas
├── components/
│   ├── eclipse-lab           # misión 01
│   ├── meteor-shower         # misión 02
│   ├── light-speed           # misión 03
│   ├── moon-tides            # misión 04
│   ├── cosmic-dance          # misión 05
│   ├── solar-system          # misión 06
│   ├── fixed-stars           # misión 07
│   ├── constellations        # misión 08
│   ├── constellation-diagram # esquemas SVG reutilizables
│   ├── milky-way             # misión 09
│   ├── morning-star          # misión 10
│   ├── zenith-nadir          # misión 11
│   ├── space-quiz            # test final
│   └── starfield             # fondo estrellado global
├── data/
│   ├── missions.ts           # títulos, rutas y descripciones
│   ├── planets.ts
│   └── constellations.ts
└── directives/reveal.ts
```

## Notas

- Las distancias y tamaños de los cuerpos no están a escala; cada simulador lo aclara.
- Las constelaciones son esquemas orientativos: el cielo cambia según fecha, hora y latitud.
- Los datos astronómicos son aproximaciones educativas actualizadas a 2026.
- Las fotografías de planetas provienen de NASA/JPL y están disponibles en Wikimedia Commons. Son material de dominio público o licencias compatibles; los créditos corresponden a las misiones originales.
- Las gafas para eclipses solares deben estar certificadas ISO 12312-2. Nunca mires al Sol directamente.
