/* ################################################################################################ */
/* ####################################### CLIENTE MQTT ########################################### */
/* ################################################################################################ */

// Configuración del broker MQTT
var wsbroker = "broker.hivemq.com";
var wsport = 8000;
var client = new Paho.MQTT.Client(wsbroker, wsport, "/mqtt", "clientId_" + Math.random().toString(16).substr(2, 8));

// Función para manejar la pérdida de conexión
client.onConnectionLost = function (responseObject) {
    console.log("Connection lost: " + responseObject.errorMessage);
};

// Función para manejar la llegada de mensajes
client.onMessageArrived = function (message) {
    console.log("Message Arrived: " + message.payloadString);
    let topic = message.destinationName;
    if (topic === "grupo_7") {
        let data = JSON.parse(message.payloadString);
        let machineId = data.id_maquina;

        // Asumiendo que estos IDs existen en tu HTML
        updateElement(`${machineId}_machineId`, `ID: ${machineId}`);
        updateElement(`${machineId}_cpuValue`, `CPU: ${data.datos.CPU}%`);
        updateElement(`${machineId}_memoryValue`, `Memoria: ${data.datos.RAM}%`);
        updateElement(`${machineId}_diskValue`, `Disco: ${data.datos.ROM}%`);
        updateElement(`${machineId}_System`, formatSystemInfo(data.datos.Info_Sistema));
        updateElement(`${machineId}_fecha`, `Última actualización: ${data.datos.fecha}`);

        // Asumiendo que tienes funciones para actualizar gráficas o cualquier otro elemento visual
        // addData(chart, data.datos.CPU), etc.
    }
};

// Función para actualizar un elemento HTML si existe
function updateElement(elementId, value) {
    let element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
    } else {
        console.log(`Element with id '${elementId}' not found.`);
    }
}

// Función para formatear la información del sistema
function formatSystemInfo(info) {
    return `Sistema: ${info.Sistema}, Release: ${info.Release}, Procesador: ${info.Procesador}, SO: ${info.Nombre_Sistema_Operativo}, Arquitectura: ${info.Arquitectura}`;
}

// Opciones de conexión MQTT
var options = {
    timeout: 3,
    useSSL: false,
    onSuccess: function () {
        console.log("Connected to MQTT");
        client.subscribe("grupo_7", { qos: 1 });
    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    }
};

// Inicialización de la conexión MQTT
function initMqtt() {
    client.connect(options);
}

// Se ejecuta cuando la página se carga completamente
window.onload = function () {
    initMqtt();
};
