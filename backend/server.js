/**
 * ================================================================
 * PROYECTO COLABORATIVO: Librería App
 * Desarrollador Backend: David
 * Integrantes del equipo:
 *  - Matías: Project Manager & Tech Writer (Documentación, PRs)
 *  - David: Backend Developer (Servidor Express, API REST)
 *  - Carlos: Frontend Developer (Interfaz de usuario)
 * ================================================================
 */

const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Inicializamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// ================================================================
// MIDDLEWARES
// ================================================================

// 1. CORS: Permite que el Frontend de Carlos (que correrá en otro puerto/origen)
//    pueda hacer peticiones a este Backend sin bloqueos del navegador.
app.use(cors());

// 2. express.json: Permite al servidor entender cuerpos de petición en formato JSON
app.use(express.json());

// ================================================================
// RUTAS / ENDPOINTS
// ================================================================

/**
 * Ruta raíz (Bienvenida / Estado del servicio)
 * GET /
 */
app.get('/', (req, res) => {
  res.json({
    mensaje: '📚 Servidor Backend de Librería App activo y funcionando',
    desarrollador: 'David',
    endpoint_libros: 'http://localhost:3000/api/libros'
  });
});

/**
 * Ruta principal para obtener el catálogo de libros
 * GET /api/libros
 * 
 * Consume la API pública de Open Library y devuelve una lista simplificada
 * para que Carlos (Frontend) pueda pintarla fácilmente en sus tarjetas.
 * 
 * Parámetros opcionales vía query:
 *   ?q=termino_busqueda (por defecto: 'javascript')
 *   ?limit=cantidad      (por defecto: 8)
 */
app.get('/api/libros', async (req, res) => {
  try {
    const query = req.query.q || 'javascript';
    const limit = req.query.limit || 8;

    console.log(`[API] Consultando libros con tema: "${query}" (límite: ${limit})...`);

    // Petición HTTP a la API pública de Open Library
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'LibreriaApp/1.0 (ProyectoEstudiantilBackend)'
      },
      timeout: 10000 // 10 segundos de timeout
    });

    // Validamos que existan documentos en la respuesta
    const docs = response.data.docs || [];

    // Mapeamos y simplificamos los datos para Carlos (Frontend)
    // Solo enviamos los campos necesarios: id, título, autor, año y portada (opcional)
    const libros = docs.map((doc, index) => {
      const coverId = doc.cover_i;
      return {
        id: doc.key ? doc.key.replace('/works/', '') : `libro-${index + 1}`,
        titulo: doc.title || 'Título no disponible',
        autor: (doc.author_name && doc.author_name.length > 0)
          ? doc.author_name.join(', ')
          : 'Autor desconocido',
        anio: doc.first_publish_year || (doc.publish_year ? doc.publish_year[0] : 'Desconocido'),
        portada: coverId 
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
          : null
      };
    });

    console.log(`[API] Se obtuvieron ${libros.length} libros correctamente.`);

    // Retornamos la respuesta JSON estructurada
    return res.status(200).json({
      exito: true,
      total: libros.length,
      categoria: query,
      datos: libros
    });

  } catch (error) {
    console.error('[API ERROR] Error al consumir Open Library:', error.message);

    // Manejo de errores claro en caso de que falle la conexión externa
    return res.status(500).json({
      exito: false,
      error: 'Error al consultar la API externa de Open Library',
      detalle: error.message
    });
  }
});

// ================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ================================================================
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 Servidor Backend corriendo en: http://localhost:${PORT}`);
  console.log(`📚 Endpoint de libros: http://localhost:${PORT}/api/libros`);
  console.log(`👤 Desarrollador: David (Rama: david)`);
  console.log(`====================================================`);
});
