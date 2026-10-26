# Tienda RPG — La tienda de los mundos habitados

**Proyecto:** El mundo jugando al mismo tiempo

Versión 1 del prototipo interactivo. Lira, la mercadera de mundos, presenta reliquias que representan videojuegos y explica cuántas personas están conectadas en Steam. Incluye diálogos RPG, cambios animados de objetos, sección conceptual, historia de Mats Steen/Ibelin, voz (síntesis del navegador) y reconocimiento de gestos opcional con la cámara.

## Ejecutarlo en tu computadora

Requiere Node.js 22.13+.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Publicar con Vercel

1. Sube esta carpeta a un repositorio de GitHub.
2. En [Vercel](https://vercel.com/new), inicia sesión con GitHub y elige **Add New > Project**.
3. Selecciona el repositorio **Tienda-RPG** y usa el preset **Next.js**.
4. **Root Directory**: `./`, **Build Command**: `npm run build`, **Install Command**: `npm install`.
5. Pulsa **Deploy**. Los siguientes commits a `main` producirán nuevos despliegues automáticamente si mantienes la integración GitHub/Vercel.

No requiere API key para consultar el endpoint público de Steam usado aquí.

## Importante sobre los datos

- El endpoint `/api/steam` consulta un **catálogo seleccionado** de videojuegos de Steam, no todos los videojuegos de todas las plataformas. El ranking es relativo a esa selección.
- Si no hay al menos 3 consultas válidas, se activa el **modo demostración** (cifras ficticias señaladas en pantalla).
- Los datos de pico de 24 horas y máximo histórico **todavía no están integrados**.
- La interacción por voz y cámara es experimental y requiere permiso del navegador, HTTPS y compatibilidad. La alternativa por clic funciona sin esos permisos.
- El modelo de gestos de MediaPipe y algunos recursos externos se cargan cuando el usuario habilita la cámara.

## Estructura

- `app/page.tsx`: interfaz e interacciones.
- `app/relic.tsx`: arte vectorial de reliquias.
- `app/game-data.ts`: catálogo de videojuegos, metadatos y cifras de ejemplo.
- `app/api/steam/route.ts`: consulta de jugadores concurrentes desde Steam.
- `app/globals.css`: diseño visual y animaciones.
- `public/assets/`: ilustraciones del entorno y de Lira.

El código y los recursos son un prototipo académico, no un producto oficial de ninguna franquicia.
