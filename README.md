# Flores para Lucía 🌼

Un regalo animado de **Jhoel — Tenitmer**: siete flores amarillas que crecen y se mecen, mensajes al tocar cada flor, una carta en cinco páginas, pétalos y la canción **golden hour — JVKE**, elegida por Jhoel, como música opcional.

## Publicarlo y conseguir tu enlace

**Repositorio público: [Txnit/flores-para-lucia](https://github.com/Txnit/flores-para-lucia)**

1. Entra a [GitHub](https://github.com/new) y crea un repositorio con ese nombre. Marca **Public**.
2. Usa **Add file → Upload files** (o **uploading an existing file** si está vacío).
3. Sube juntos `index.html`, `style.css`, `content.js`, `garden.js`, `app.js`, `.nojekyll`, `flor.svg`, `golden-hour.mp3` y `README.md`. **Todos deben quedar directamente en la raíz del repositorio**, no dentro de otra carpeta `LuFA`, `assets` o `flores-para-lucia`.
4. Pulsa **Commit changes** para guardar los archivos en la rama `main`.
5. Abre **Settings → Pages**. En **Build and deployment**, elige **Deploy from a branch**.
6. Selecciona **main** y **/ (root)**. Pulsa **Save**.
7. Espera a que GitHub termine de publicar (puede tardar hasta diez minutos). En esa misma pantalla aparecerá **Visit site** con el enlace real.

Al activar GitHub Pages, el enlace de este repositorio será:

```text
https://txnit.github.io/flores-para-lucia/
```

GitHub confirma la publicación en **Settings → Pages → Visit site**.

No hay nada que instalar ni compilar para GitHub Pages. Todas las rutas son relativas y funcionan dentro de la carpeta del repositorio. No necesita API, contraseñas, servidores, imágenes externas ni servicios de pago.

Instrucciones oficiales: [Crear un sitio de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site) y [Configurar la publicación desde una rama](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Verlo antes de regalarlo

Abre `index.html` con Chrome, Edge, Firefox o Safari. También funciona sin conexión. Para previsualizarlo como en GitHub Pages, si tienes Node.js instalado:

```text
npm run preview
```

Después abre `http://127.0.0.1:4173/flores-para-lucia/`.

## Personalizar las palabras

- **`content.js`**: carta completa y los siete mensajes de las flores.
- **`index.html`**: nombre, dedicatoria de portada y firma.
- **`style.css`**: colores y presentación.
- **`garden.js`**: ramo dibujado y animación.
- **`app.js`**: carta, controles y reproducción de la canción.
- **`golden-hour.mp3`**: canción **golden hour — JVKE**, copiada del archivo proporcionado por Jhoel.

La música empieza únicamente cuando Lucía pulsa **Música**, se repite a volumen suave y se pausa con el mismo botón. Al cambiar de pestaña se pausa; al regresar continúa si estaba activada. Si el navegador bloquea el audio, el botón permite reintentarlo. El botón de pausa detiene el movimiento. El regalo respeta la preferencia del dispositivo de reducir animaciones, permite recorrer las flores con el teclado y adapta la carta a pantallas pequeñas.
