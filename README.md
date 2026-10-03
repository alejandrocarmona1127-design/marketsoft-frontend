# MarketSoft - Frontend SPA (Sistema de Supermercado)

Este es el frontend de una aplicación web completa (Full-Stack) desarrollada para la gestión y administración de un supermercado. Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre las entidades principales del sistema.

## Nombres de integrantes
**Jhon Alejandro Carmona Gaviria**


## Tecnologías Utilizadas

*   **Frontend:** React, Vite, CSS (Estilos modulares y variables CSS).
*   **Backend (API):** Node.js, Express (conectado vía proxy de Vite).
*   **Base de Datos:** PostgreSQL, ORM Sequelize.

## Descripción de la arquitectura

### El proyecto está estructurado bajo una arquitectura de Single Page Application (SPA) basada en componentes de React, dividiendo las responsabilidades de la siguiente manera:

* Enrutamiento Dinámico: Se implementó react-router-dom para navegar entre los diferentes módulos (Productos, Usuarios, proveedores y ventas.) sin necesidad de recargar la página web.

* Capa de Servicios (Consumo de API): Se centralizó la comunicación con el backend en archivos de servicio (ej. product.service.js). Utilizamos Axios para ejecutar las peticiones HTTP (GET, POST, PUT, DELETE) hacia los endpoints correspondientes.

* Manejo de Estado y UI: Utilizamos Hooks de React (useState, useEffect) para cargar los datos de la base de datos y actualizar las tablas en la vista en tiempo real tras cada operación CRUD. Las interfaces (tablas y ventanas modales) fueron estilizadas usando el framework Bootstrap para garantizar que sean responsivas.

## Módulos Principales

El sistema está compuesto por 4 módulos totalmente funcionales:
1.  **Products (Productos):** Gestión de inventario con control de stock, precio y asociación a proveedores.
2.  **Providers (Proveedores):** Registro de proveedores.
3.  **Users (Usuarios):** Administración del personal (Cajeros, Administradores).
4.  **Sales (Ventas):** Registro de ventas con calculo total.

## Configuración e Instalación

### 1. Requisitos Previos
*   Tener instalado Node.js (v14 o superior).
*   Tener el servidor Backend en ejecución localmente (por defecto en el puerto `3000`).

### 2. Instalación del Frontend
Clona este repositorio y navega hasta la carpeta del proyecto. Luego instala las dependencias:

```bash
npm install
npm start
```

## Declaración sobre el uso de Inteligencia Artificial

En cumplimiento con los lineamientos del curso y por transparencia académica, declaro que utilicé un asistente de Inteligencia Artificial (Gemini) como herramienta de apoyo para entender y resolver bloqueos técnicos específicos durante el desarrollo:

*   **Configuración de CORS y Proxy:** Al principio el frontend no lograba conectarse con la API de ninguna manera. Como no quería modificar el código del backend que ya estaba completamente funcional, la IA me explicó cómo configurar un proxy local en el archivo `vite.config.js` para evitar los bloqueos de seguridad del navegador.
*   **Depuración de Tipos de Datos (Error 400 Bad Request):** Me ayudó a identificar que los inputs numéricos de React enviaban texto en lugar de números a la base de datos (generando conflictos con Sequelize). Con su guía, implementé `parseInt()` y `parseFloat()` para limpiar los datos antes de enviarlos por Axios.
*   **Ajustes de Interfaz (Scroll en Modales):** Me asesoró para corregir un problema visual donde el formulario se cortaba en la parte inferior, enseñándome a aplicar `maxHeight` y `overflowY: 'auto'` para habilitar una barra de desplazamiento interna.
*   **Lógica de auto-cálculo en Ventas:** Le pedí ayuda para estructurar la lógica matemática dentro de la función `handleChange`, permitiendo que el sistema multiplicara automáticamente la "cantidad" por el "precio unitario" y actualizara el "Total" en tiempo real usando el estado de React.
*   **Depuración del ciclo de vida en React (ReferenceError):** En el módulo de Productos, la aplicación colapsaba completamente al intentar escribir en los cajones de texto. La IA me asistió leyendo el rastro del error (handleChange is not defined), ayudándome a identificar que al construir el formulario olvidé declarar y enlazar la función responsable de capturar los eventos del teclado (onChange) para actualizar el estado del componente.