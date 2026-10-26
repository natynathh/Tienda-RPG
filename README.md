# La Tienda de los Mundos
### El mundo jugando al mismo tiempo · Visualización interactiva de datos

**[Explorar la experiencia en vivo](https://tienda-rpg.vercel.app)** · [Repositorio en GitHub](https://github.com/natynathh/Tienda-RPG)

> **¿Cuántas personas están habitando un mismo mundo virtual en este preciso momento?**  
> Una experiencia interactiva de estética RPG que transforma las cifras de jugadores simultáneos en un encuentro con las comunidades que dan vida a los videojuegos.

## Sobre el proyecto

**La Tienda de los Mundos** es un prototipo académico de diseño de interacción y visualización de datos. Investiga el fenómeno de las personas que juegan simultáneamente y plantea que los videojuegos no son únicamente productos digitales: también pueden ser espacios de convivencia, colaboración, pertenencia y experiencias compartidas.

La propuesta abandona la representación convencional de estadísticas en paneles para adoptar la metáfora de una **tienda de fantasía**. Su anfitriona, **Lira, la mercadera de mundos**, recibe al visitante y presenta videojuegos como reliquias expuestas sobre un mostrador. Cada objeto es una puerta simbólica a una comunidad de personas conectadas.

El proyecto explora la diferencia entre **contar presencias** y **comprender las historias detrás de ellas**: las cifras ofrecen una imagen de la actividad simultánea, pero no miden por sí mismas la calidad de los vínculos.

## Recorrido interactivo

1. **Bienvenida.** Lira introduce el funcionamiento de la tienda mediante diálogos de estilo RPG y una grabación de voz.
2. **Explorar reliquias.** El mostrador presenta tres objetos relacionados con videojuegos de un catálogo consultado en Steam. El visitante puede seleccionar uno o pedir **Otros mundos** para recorrer más opciones.
3. **Descubrir un mundo.** Al elegir una reliquia, las demás se retiran con una transición animada y se abre una ficha del juego.
4. **Interpretar los datos.** La ficha muestra jugadores conectados, posición dentro de la selección consultada y participación porcentual respecto al total de jugadores de esa misma selección.
5. **Conocer el concepto.** Una sección explica el origen de la propuesta, la metáfora de los mundos habitados y los límites de la visualización.
6. **Escuchar una historia.** Lira presenta en cuatro capítulos la historia real de Mats Steen, conocido como **Ibelin** en *World of Warcraft*. El cierre invita a recordar que detrás de cada cifra hay una persona.

El recorrido permite volver al mostrador y explorar otros juegos sin reiniciar toda la experiencia.

## Recursos sonoros e interacción

La interfaz incorpora una **voz narrada, música ambiental y sonidos de transición** para reforzar la sensación de estar dentro de una tienda de videojuego:

| Recurso | Función |
| --- | --- |
| Voz de Lira | Bienvenida y cuatro capítulos de la historia de Ibelin; grabaciones generadas con Adobe Firefly |
| Música ambiental | Pista `blue-harbor-ambient.mp3`, reproducida en bucle con control de volumen |
| Efecto *whoosh* | Transiciones al seleccionar una reliquia o cambiar de colección |
| Diálogos en pantalla | Texto disponible como alternativa o complemento a la voz |

La música **no se reproduce automáticamente al abrir la web**: debe activarse con el botón musical, de acuerdo con las restricciones habituales de reproducción de los navegadores. El volumen inicial configurado es **8 %** y se reduce mientras Lira narra. El usuario puede ajustar el volumen desde el panel de sonido.

También incluye interacciones experimentales y **opcionales**: comandos de voz, reconocimiento de gestos mediante cámara (MediaPipe), mouse y teclado. La cámara requiere autorización expresa del navegador; se puede explorar la tienda sin activarla. Su disponibilidad y precisión varían según el dispositivo y navegador.

## Datos y metodología

**Fuente de actividad concurrente:** [Steam Web API · GetNumberOfCurrentPlayers](https://partner.steamgames.com/doc/webapi/ISteamUserStats), consultada desde el endpoint interno `/api/steam`.

- El prototipo consulta un **catálogo curado de ocho títulos de Steam**. No representa la totalidad de Steam ni a jugadores de otras plataformas.
- Los juegos obtenidos se ordenan según su cantidad de jugadores simultáneos en el momento de la consulta; la tienda muestra tres objetos por colección.
- La interfaz solicita datos aproximadamente cada **90 segundos**, y registra la fecha/hora de actualización.
- **Participación en la muestra:** `jugadores del título / suma de jugadores de los títulos consultados × 100`. Es una proporción dentro de la muestra, **no** una cuota del mercado global.
- El **ranking** corresponde únicamente a los títulos consultados. No debe interpretarse como un ranking mundial.
- Si se obtienen menos de tres consultas válidas, se utiliza un **modo demostración**, claramente identificado, con cifras ficticias para mantener la experiencia navegable.
- El **pico de 24 horas y el máximo histórico** no están implementados: requieren una fuente histórica independiente. No se estiman ni se inventan.

Para ampliar el contexto, se enlaza al [ranking público de juegos más jugados de Steam](https://store.steampowered.com/charts/mostplayed).

## Reflexión: la vida de Ibelin

El último capítulo retoma la historia de **Mats Steen**, un joven noruego con distrofia muscular de Duchenne que construyó amistades y relaciones significativas a través de *World of Warcraft*. La historia se aborda como ejemplo de cómo un entorno virtual puede convertirse en un espacio real de convivencia para quienes lo habitan.

El relato está dividido en cuatro páginas, con narración de Lira y diálogos legibles. Referencia documental: *La extraordinaria vida de Ibelin* (*The Remarkable Life of Ibelin*, 2024).

**Idea central:** *una persona conectada es más que una cifra: también tiene una historia.*

## Diseño y tecnología

- **Diseño visual:** fantasía ilustrada, tienda RPG frontal, mostrador de reliquias, diálogos estilo videojuego y paleta nocturna con acentos dorados.
- **Frontend:** Next.js 16, React 19, TypeScript y CSS.
- **Iconografía de interfaz:** Lucide React.
- **Datos:** Steam Web API, a través de una ruta de servidor Next.js.
- **Gestos:** MediaPipe Tasks Vision (experimental).
- **Audio:** archivos MP3 alojados en `public/audio/` y reproducción mediante las capacidades del navegador.
- **Publicación:** GitHub + Vercel, con despliegues vinculados a la rama `main`.

## Ejecutar el proyecto localmente

Requisitos: **Node.js 22.13 o superior** y npm.

```bash
git clone https://github.com/natynathh/Tienda-RPG.git
cd Tienda-RPG
npm install
npm run dev
```

Abre **http://localhost:3000**. Para verificar el proyecto antes de publicarlo:

```bash
npm run typecheck
npm run build
```

El endpoint de Steam utilizado no necesita una clave API privada. Para activar cámara y micrófono, el navegador solicitará los permisos correspondientes; en producción se utiliza HTTPS.

## Archivos principales

| Ruta | Contenido |
| --- | --- |
| `app/page.tsx` | Navegación, escenas, estadísticas, diálogos y controles |
| `app/globals.css` | Estilos, composición y animaciones |
| `app/relic.tsx` | Representación gráfica de las reliquias |
| `app/game-data.ts` | Catálogo de videojuegos y datos de demostración |
| `app/api/steam/route.ts` | Consulta de jugadores conectados en Steam |
| `public/assets/` | Ilustraciones y recursos visuales |
| `public/audio/` | Grabaciones, música y efectos de sonido |
| `LIRA-GUIONES-FIREFLY.md` | Guiones y notas de interpretación de Lira |

## Publicación y actualizaciones

El proyecto **ya está publicado** en [tienda-rpg.vercel.app](https://tienda-rpg.vercel.app). El repositorio está conectado con Vercel: los nuevos commits a `main` generan despliegues de producción según la configuración del proyecto. No es necesario volver a importar el repositorio para cada cambio.

## Alcance y créditos

Este es un **prototipo académico e independiente**, sin afiliación oficial con Steam, los estudios de los videojuegos representados o los responsables del documental. Las referencias a títulos, objetos e historias se utilizan con fines de investigación, diseño y visualización de datos.

Los audios narrados se produjeron utilizando **Adobe Firefly** y los recursos visuales forman parte del desarrollo artístico del prototipo. La música y los efectos deben utilizarse de acuerdo con sus correspondientes condiciones de licencia y atribución.
