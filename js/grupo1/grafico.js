// Variables para almacenar los datos recibidos
let timestamps = [];
let memoryAvailableValues = [];
let memoryUsedValues = [];
let networkPerformanceValues = [];

// Función para crear el gráfico de ojiva
function createOgiveChart() {
    let ctx = document.getElementById('graficoOjivaContainer').getContext('2d');
    let ojiveChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timestamps,
            datasets: [{
                label: 'Memoria Disponible',
                borderColor: 'blue',
                data: memoryAvailableValues,
                fill: false
            }, {
                label: 'Memoria Usada',
                borderColor: 'red',
                data: memoryUsedValues,
                fill: false
            }, {
                label: 'Rendimiento de Red',
                borderColor: 'green',
                data: networkPerformanceValues,
                fill: false
            }]
        },
        options: {
            title: {
                display: true,
                text: 'Gráfico de Ojiva de Datos MQTT'
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'minute' // Puedes ajustar la unidad de tiempo según tus necesidades
                    },
                    scaleLabel: {
                        display: true,
                        labelString: 'Tiempo'
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Valor'
                    }
                }]
            }
        }
    });

    return ojiveChart;
}

// Función para actualizar el gráfico con nuevos datos
function updateChart(response, ojiveChart) {
    let timestamp = new Date();
    timestamps.push(timestamp);
    memoryAvailableValues.push(response.memoria_disponible);
    memoryUsedValues.push(response.memoria_usada);
    networkPerformanceValues.push(response.rendimiento_red);

    // Limitar el historial de datos a mostrar en el gráfico
    const maxDataPoints = 20;
    if (timestamps.length > maxDataPoints) {
        timestamps.shift();
        memoryAvailableValues.shift();
        memoryUsedValues.shift();
        networkPerformanceValues.shift();
    }

    // Actualizar el gráfico
    ojiveChart.update();
}

// Configurar el cliente MQTT
var client = new Paho.MQTT.Client(wsbroker, wsport, "myclientid_" + parseInt(Math.random() * 100, 10));
client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};
client.onMessageArrived = function (message) {
    console.log("Mensaje recibido");
    console.log(message);
    let destination = message.destinationName;
    if (destination === "grupo1") {
        let response = JSON.parse(message.payloadString);
        updateChart(response, ojiveChart); // Llamar a la función para procesar y actualizar los datos
    }
};
var options = {
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");
        client.subscribe("grupo1", { qos: 1 });
    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    },
};

// Conectar al broker MQTT
client.connect(options);

// Crear el gráfico de ojiva cuando el documento esté listo
document.addEventListener("DOMContentLoaded", function() {
    let ojiveChart = createOgiveChart();
});
