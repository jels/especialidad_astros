# Cosmos 101 · El cielo no es el límite

Sitio web educativo e interactivo de astronomía para adolescentes, desarrollado con **Angular 22** y **Tailwind CSS 4**.

Responde de forma visual los diez puntos del trabajo práctico de Astronomía con simuladores, diagramas SVG, mapas estelares, animaciones y un test final.

La portada funciona como centro de misiones. Cada punto tiene su propia URL y su propia página, con un botón **Empezar misión** desde el inicio y navegación anterior/siguiente al final de cada recorrido.

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
- **Carga diferida** de la portada y de las páginas de misión.
- **Tailwind CSS 4** mediante `@tailwindcss/postcss`.
- **SVG a mano** para todos los diagramas astronómicos y constelaciones.
- **Canvas 2D** para el cielo estrellado global y la lluvia de meteoros.
- **Router con scroll al inicio** y restauración de posición; títulos de página dinámicos.
- **IntersectionObserver** para revelar secciones y pausar animaciones fuera de pantalla.
- **Diseño responsive** probado en 320, 390 y 1440 px, sin scroll horizontal.
- **Accesibilidad**: controles nativos, etiquetas ARIA, foco visible, textos alternativos y respeto por `prefers-reduced-motion`.
- Tipografías: Unbounded y Space Grotesk (Google Fonts).

## Estructura

```text
src/app/
├── app.ts / app.html          # shell: header, índice, footer y router-outlet
├── app.routes.ts              # portada y páginas de misión
├── pages/
│   ├── home/                  # portada con hero, pasos y las 11 tarjetas de misión
│   └── mission-page/          # layout de misión y navegación anterior/siguiente
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
- Las gafas para eclipses solares deben estar certificadas ISO 12312-2. Nunca mires al Sol directamente.
