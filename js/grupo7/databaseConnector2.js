// Importar los módulos necesarios
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

// Crear una instancia de Express
const app = express();

// Configurar el puerto al que escuchará el servidor
const port = 3000;

// Configurar CORS para permitir solicitudes desde cualquier origen
app.use(cors());

// Configuración de la conexión a la base de datos MySQL
const conexion = mysql.createConnection({
    host: 'mysql-arquitectura1.alwaysdata.net',
    user: '349016_jj',
    password: '0987074675',
    database: 'arquitectura1_uce'
});

// Conectar a la base de datos
conexion.connect((error) => {
    if (error) {
        console.error('Error de conexión:', error);
    } else {
        console.log('Conexión exitosa a la base de datos');
    }
});

// Definir una ruta para acceder a los datos de rendimiento según el número de máquina
app.get('/datos_rendimiento/:maquina', (req, res) => {
    // Obtener el parámetro "maquina" de la URL
    const maquina = req.params.maquina;

    // Verificar si el número de máquina es válido
    const numeroMaquina = parseInt(maquina.substring(7)); // Extraer el número de la cadena 'maquinaX'
    if (isNaN(numeroMaquina) || numeroMaquina < 3 || numeroMaquina > 6) {
        return res.status(400).json({ error: 'Número de máquina no válido' });
    }

    // Construir la consulta SQL en función del número de máquina
    const consultaSQL = `SELECT * FROM rendimientopc WHERE MachineID = 'maquina${numeroMaquina}' ORDER BY FECHA DESC LIMIT 10`;

    // Realizar la consulta SQL a la base de datos
    conexion.query(consultaSQL, (error, resultados) => {
        if (error) {
            console.error('Error al ejecutar la consulta:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            // Configurar encabezados de la respuesta
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            // Enviar los resultados como respuesta en formato JSON
            res.json(resultados);
        }
    });
});

// Escuchar en todas las interfaces de red en el puerto especificado
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://0.0.0.0:${port}`);
});
