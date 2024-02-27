// Función para obtener los datos del servidor y actualizar la tabla en el HTML
function obtenerDatosYActualizarTabla() {
    fetch('http://localhost/api.php') // Reemplaza la URL con la ruta correcta hacia tu archivo PHP
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

// Función para crear una gráfica de barras con los datos de rendimiento, memoria usada y memoria disponible
function crearGraficaBarras(data) {
    const nombres = data.map(item => item.mensaje_maquina);
    const memoriaDisponible = data.map(item => item.memoria_disponible);
    const memoriaUsada = data.map(item => item.memoria_usada);
    const rendimientos = data.map(item => item.rendimiento_red);

    const ctx = document.getElementById('grafica-ojiva').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: nombres,
            datasets: [{
                label: 'Memoria Disponible',
                data: memoriaDisponible,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Memoria Usada',
                data: memoriaUsada,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            },
            {
                label: 'Rendimiento de Red',
                data: rendimientos,
                backgroundColor: 'rgba(255, 206, 86, 0.5)',
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Valores'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Mensaje de la Máquina'
                    }
                }
            }
        }
    });
}

// Obtener los datos del servidor y actualizar la tabla y la gráfica cada 5 segundos
obtenerDatosYActualizarTabla();
setInterval(obtenerDatosYActualizarTabla, 5000);
