/**
 * ================================================================
 * PROYECTO COLABORATIVO: Librería App
 * Desarrollador Frontend: Carlos
 * Conecta con la API REST de David y renderiza el catálogo dinámicamente.
 * ================================================================
 */

// 1. Configuración y Constantes
const API_URL = 'http://localhost:3000/api/libros';

// 2. Elementos del DOM
const librosGrid = document.getElementById('libros-grid');
const statusContainer = document.getElementById('status-container');
const btnRecargar = document.getElementById('btn-recargar');
const formBusqueda = document.getElementById('form-busqueda');
const inputBusqueda = document.getElementById('input-busqueda');

/**
 * 
 * Muestra el estado de carga (Spinner + texto)
 */
function mostrarCargando() {
  statusContainer.innerHTML = `
    <div class="status-box">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-text">Cargando catálogo de libros desde el backend...</p>
    </div>
  `;
  librosGrid.innerHTML = '';
}

/**
 * Muestra un mensaje de error si la petición falla o el backend está apagado
 */
function mostrarError(mensajeDetallado) {
  statusContainer.innerHTML = `
    <div class="status-box status-error">
      <span style="font-size: 2rem;">⚠️</span>
      <p class="error-title">Error al conectar con el servidor</p>
      <p class="error-message">
        No se pudo obtener la información desde <code>${API_URL}</code>. 
        Asegúrate de que el backend de Node/Express esté encendido en el puerto 3000.
      </p>
      <small style="color: #991b1b; margin-top: 0.5rem;">Detalle: ${escapeHTML(mensajeDetallado)}</small>
    </div>
  `;
  librosGrid.innerHTML = '';
}

/**
 * Muestra un aviso cuando el servidor responde pero no hay libros
 */
function mostrarEstadoVacio(termino = '') {
  statusContainer.innerHTML = `
    <div class="status-box">
      <span style="font-size: 2rem;">📭</span>
      <p style="font-weight: 600; font-size: 1.1rem; margin-top: 0.5rem;">No se encontraron libros</p>
      <p style="color: #64748b;">${termino ? `No hubo resultados para "${escapeHTML(termino)}". Intenta con otra búsqueda.` : 'El catálogo se encuentra vacío en este momento.'}</p>
    </div>
  `;
  librosGrid.innerHTML = '';
}

function limpiarEstado() {
  statusContainer.innerHTML = '';
}

/**
 * Sanitiza valores de texto para prevenir inyección HTML
 */
function escapeHTML(str) {
  if (typeof str !== 'string') return String(str ?? '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Itera el array de libros y genera dinámicamente las tarjetas (cards)
 * Admite tanto el array directo de libros como el objeto de respuesta { datos: [...] }
 */
function renderizarLibros(libros, meta = null) {
  limpiarEstado();

  // Soporte defensivo: si se pasa el objeto completo en vez del array
  let lista = libros;
  if (!Array.isArray(lista) && lista && typeof lista === 'object') {
    if (Array.isArray(lista.datos)) lista = lista.datos;
    else if (Array.isArray(lista.libros)) lista = lista.libros;
    else if (Array.isArray(lista.data)) lista = lista.data;
  }

  if (!Array.isArray(lista) || lista.length === 0) {
    const termino = meta?.categoria || '';
    mostrarEstadoVacio(termino);
    return;
  }

  // Barra informativa con los resultados recibidos
  const total = meta?.total ?? lista.length;
  const categoria = meta?.categoria ?? '';
  if (categoria) {
    statusContainer.innerHTML = `
      <div class="info-bar">
        <span>Mostrando <strong>${total}</strong> libros para el tema "<strong>${escapeHTML(categoria)}</strong>"</span>
      </div>
    `;
  }

  const cardsHTML = lista.map(libro => {
    // Lectura flexible de propiedades (es / en)
    const titulo = libro.titulo || libro.title || 'Título desconocido';
    const autor = libro.autor || libro.author || 'Autor desconocido';
    const anio = libro.anio || libro.año || libro.year || 'N/A';
    const portada = libro.portada || libro.cover || null;

    return `
      <article class="libro-card">
        <div class="libro-card-header"></div>
        <div class="libro-cover-container">
          ${portada 
            ? `<img src="${escapeHTML(portada)}" alt="${escapeHTML(titulo)}" class="libro-cover" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` 
            : ''
          }
          <div class="libro-cover-placeholder" style="${portada ? 'display: none;' : 'display: flex;'}">
            <span class="placeholder-icon">📖</span>
            <span class="placeholder-text">Sin portada</span>
          </div>
        </div>
        <div class="libro-card-body">
          <span class="libro-year-badge">${escapeHTML(String(anio))}</span>
          <h2 class="libro-title" title="${escapeHTML(titulo)}">${escapeHTML(titulo)}</h2>
          <div class="libro-author">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            <span>${escapeHTML(autor)}</span>
          </div>
        </div>
      </article>
    `;
  }).join('');

  librosGrid.innerHTML = cardsHTML;
}

/**
 * Realiza la petición asíncrona mediante fetch()
 * Permite buscar por término y límite de resultados
 */
async function obtenerLibros(query = null) {
  mostrarCargando();

  // Si no se especifica query, tomar del input o usar 'javascript' por defecto
  const termino = (query !== null) 
    ? query 
    : (inputBusqueda && inputBusqueda.value.trim() ? inputBusqueda.value.trim() : 'javascript');

  try {
    const url = new URL(API_URL);
    if (termino) {
      url.searchParams.set('q', termino);
    }

    const respuesta = await fetch(url.toString());

    // Valida código de respuesta HTTP (200-299)
    if (!respuesta.ok) {
      throw new Error(`Código de estado HTTP ${respuesta.status} (${respuesta.statusText})`);
    }

    const data = await respuesta.json();

    // El backend de David responde con:
    // { exito: true, total: 8, categoria: "javascript", datos: [...] }
    // Extraemos la lista de libros de forma segura:
    let libros = [];
    if (Array.isArray(data)) {
      libros = data;
    } else if (data && Array.isArray(data.datos)) {
      libros = data.datos;
    } else if (data && Array.isArray(data.libros)) {
      libros = data.libros;
    } else if (data && Array.isArray(data.data)) {
      libros = data.data;
    }

    renderizarLibros(libros, data);

  } catch (error) {
    console.error('Error al obtener libros:', error);
    mostrarError(error.message);
  }
}

// 3. Inicialización y Eventos
document.addEventListener('DOMContentLoaded', () => {
  obtenerLibros();
});

if (btnRecargar) {
  btnRecargar.addEventListener('click', () => {
    const termino = inputBusqueda && inputBusqueda.value.trim() ? inputBusqueda.value.trim() : 'javascript';
    obtenerLibros(termino);
  });
}

if (formBusqueda) {
  formBusqueda.addEventListener('submit', (e) => {
    e.preventDefault();
    const termino = inputBusqueda && inputBusqueda.value.trim() ? inputBusqueda.value.trim() : 'javascript';
    obtenerLibros(termino);
  });
}