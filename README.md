# 📚 App Librería - Proyecto Semana 05 (sem.05.pretell)

![Estado](https://img.shields.io/badge/Estado-En%20Desarrollo-yellow)
![Versión](https://img.shields.io/badge/Versi%C3%B3n-1.0.0-blue)
![Tecnologías](https://img.shields.io/badge/Tecnolog%C3%ADas-Node.js%20|%20HTML%20|%20JS%20|%20CSS-success)

Bienvenido al repositorio oficial del proyecto **App Librería**. Esta aplicación es un desarrollo de arquitectura Full-Stack (Cliente/Servidor) diseñado para gestionar la información, el catálogo y las interacciones de una librería digital. 

Este proyecto forma parte de las entregas de la Semana 05 y demuestra la implementación de la separación de responsabilidades entre el frontend interactivo y el backend basado en el ecosistema de Node.js.

---

## 📑 Tabla de Contenidos

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [Arquitectura y Estructura de Directorios](#-arquitectura-y-estructura-de-directorios)
3. [Pila Tecnológica y Dependencias](#-pila-tecnológica-y-dependencias)
4. [Flujo de Trabajo y Control de Versiones](#-flujo-de-trabajo-y-control-de-versiones)
5. [Guía de Instalación y Despliegue](#-guía-de-instalación-y-despliegue)
6. [Próximos Pasos (Roadmap)](#-próximos-pasos-roadmap)
7. [Autores y Colaboradores](#-autores-y-colaboradores)

---

## 📖 Descripción del Proyecto

El proyecto **App Librería** tiene como objetivo crear una interfaz intuitiva y rápida para que los usuarios puedan explorar libros, mientras el servidor maneja las peticiones de datos de manera eficiente. El entorno de desarrollo está completamente modularizado: el cliente consume recursos y muestra la interfaz gráfica, mientras el servidor gestiona las dependencias, el enrutamiento y la futura conexión a bases de datos mediante clientes HTTP robustos.

---

## 🏗️ Arquitectura y Estructura de Directorios

El código fuente está estrictamente dividido en dos capas principales. A continuación, se detalla el árbol de directorios de la carpeta raíz `sem.05.pretell`:

```text
📁 sem.05.pretell/
│
├── 📁 .git/                  # Configuración local de control de versiones y hooks
│
├── 📁 appLibreria/           # 💻 ENTORNO FRONTEND (Cliente)
│   ├── 📄 index.html         # Maquetado principal, semántica HTML5 y punto de entrada UI
│   ├── 📄 styles.css         # Hojas de estilo CSS3 (Diseño responsivo y UI/UX)
│   └── 📄 app.js             # Lógica Vanilla JavaScript (Manipulación del DOM y consumo de APIs)
│
└── 📁 backend/               # ⚙️ ENTORNO BACKEND (Servidor)
    ├── 📁 node_modules/      # Módulos y dependencias instaladas de Node.js
    │   ├── 📁 axios/         # (dist/browser, dist/node, lib, etc.)
    │   ├── 📁 asynckit/      
    │   ├── 📁 agent-base/    
    │   ├── 📁 accepts/       
    │   ├── 📁 array-flatten/ 
    │   └── 📁 debug/ & ms/   
    └── 📄 package-lock.json  # Árbol de dependencias bloqueado y versiones exactas