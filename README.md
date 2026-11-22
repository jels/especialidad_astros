# Cosmos 101 · El cielo no es el límite

Sitio web educativo e interactivo de astronomía para adolescentes, desarrollado con **Angular 22** y **Tailwind CSS 4**.

Responde de forma visual los diez puntos del trabajo práctico de Astronomía con simuladores, diagramas SVG, mapas estelares, animaciones y un test final.

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

- **Angular standalone** con signals y control flow (`@if`, `@for`).
- **Tailwind CSS 4** mediante `@tailwindcss/postcss`.
- **SVG a mano** para todos los diagramas astronómicos y constelaciones.
- **Canvas 2D** para el cielo estrellado global y la lluvia de meteoros.
- **IntersectionObserver** para revelar secciones y pausar animaciones fuera de pantalla.
- **Diseño responsive** probado en 320, 390 y 1440 px, sin scroll horizontal.
- **Accesibilidad**: controles nativos, etiquetas ARIA, foco visible, textos alternativos y respeto por `prefers-reduced-motion`.
- Tipografías: Unbounded y Space Grotesk (Google Fonts).

## Estructura

```text
src/app/
├── app.ts / app.html          # shell, hero, navegación, índice, footer
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
│   ├── planets.ts
│   └── constellations.ts
└── directives/reveal.ts
```

## Notas

- Las distancias y tamaños de los cuerpos no están a escala; cada simulador lo aclara.
- Las constelaciones son esquemas orientativos: el cielo cambia según fecha, hora y latitud.
- Los datos astronómicos son aproximaciones educativas actualizadas a 2026.
- Las gafas para eclipses solares deben estar certificadas ISO 12312-2. Nunca mires al Sol directamente.
