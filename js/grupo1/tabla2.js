// Función para obtener los datos del servidor y actualizar la tabla en el HTML
function obtenerDatosYActualizarTabla() {
    fetch('http://localhost/api - copia.php') // Reemplaza la URL con la ruta correcta hacia tu archivo PHP
        .then(response => response.json())
        .then(data => {
            console.log(data);
            actualizarTabla(data);
            crearGraficaBarras(data); // Llamar a la función para crear la gráfica de barras con los datos actualizados
        })
        .catch(error => console.error('Error:', error));
}

// Función para actualizar la tabla con los datos recibidos del servidor
function actualizarTabla(data) {
    const tbody = document.getElementById('tboy-datos');
    tbody.innerHTML = ''; // Limpiar el contenido anterior del tbody

    // Iterar sobre los datos y agregar filas a la tabla
    data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.mensaje_maquina}</td>
            <td>${item.id_computadora}</td>
            <td>${item.memoria_disponible}</td>
            <td>${item.memoria_usada}</td>
            <td>${item.rendimiento_red}</td>
        `;
        tbody.appendChild(row);
    });
}