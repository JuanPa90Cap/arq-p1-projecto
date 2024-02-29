/*################################################################################################*/
/*####################################### CLIENTE MQTT ###########################################*/
/*################################################################################################*/

//var wsbroker = "0.tcp.sa.ngrok.io";
var wsbroker = "mqtt-dashboard.com";
//var wsbroker = "localhost";

//var wsport = 14792; // port for above
var wsport = 1883; // port for above
var client = new Paho.MQTT.Client(
    wsbroker,
    //Number(wsport),
    Number(8000),
    "myclientid_" + parseInt(Math.random() * 100, 10)
);

client.onConnectionLost = function (responseObject) {
    console.log("connection lost: " + responseObject.errorMessage);
};

/*################################################################################################*/
/*####################################### LLEGA EL MENSAJE########################################*/
/*################################################################################################*/
let prevCPUValue = 0;
let prevMemoryValue = 0;
let prevRecepcionValue = 0;

let prevCPUValueMachine1 = 0;
let prevMemoryValueMachine1 = 0;
let prevRecepcionValueMachine1 = 0;

let prevCPUValueMachine2 = 0;
let prevMemoryValueMachine2 = 0;
let prevRecepcionValueMachine2 = 0;

client.onMessageArrived = function (message) {
    console.log("Mensaje recibido");
    console.log(message);
    let destination = message.destinationName;
    if (destination === "maquina1" || destination === "maquina2") { 
        let response = JSON.parse(message.payloadString);

        // Extraer los datos necesarios del mensaje JSON recibido
        let memoryAvailable = response.memoria_disponible;
        let memoryUsed = response.memoria_usada;
        let networkPerformance = response.rendimiento_red;
        let computerID = response.id_computadora; 

        // Actualizar los valores en tiempo real en la página según la máquina
        if (destination === "maquina1") {
            document.getElementById("memoryAvailableValueMachine1").textContent = memoryAvailable;
            document.getElementById("memoryUsedValueMachine1").textContent = memoryUsed;
            document.getElementById("networkPerformanceValueMachine1").textContent = networkPerformance;
            document.getElementById("computerIDValueMachine1").textContent = computerID; 

            // Guardar valores previos para calcular cambios porcentuales
            prevMemoryValueMachine1 = memoryUsed;
            // Actualizar otros valores previos si es necesario
        } else if (destination === "maquina2") {
            document.getElementById("memoryAvailableValueMachine2").textContent = memoryAvailable;
            document.getElementById("memoryUsedValueMachine2").textContent = memoryUsed;
            document.getElementById("networkPerformanceValueMachine2").textContent = networkPerformance;
            document.getElementById("computerIDValueMachine2").textContent = computerID; 

            // Guardar valores previos para calcular cambios porcentuales
            prevMemoryValueMachine2 = memoryUsed;
            // Actualizar otros valores previos si es necesario
        }
    }
};

// Función para calcular el porcentaje de cambio
function calculatePercentage(diff, prevValue) {
    if (prevValue === 0) {
        return "0"; 
    }

    let percentage = ((diff / prevValue) * 100).toFixed(2);
    if (isFinite(percentage)) {
        return percentage >= 0 ? "+" + percentage : percentage;
    } else {
        return "No Disponible";
    }
}
// Función para obtener el porcentaje coloreado
function getColoredPercentage(percentage) {
    if (parseFloat(percentage) > 0) {
        return '<span style="color: green;">' + percentage + '%</span>';
    } else if (parseFloat(percentage) < 0) {
        return '<span style="color: red;">' + percentage + '%</span>';
    } else {
        return percentage + '%';
    }
}

var options = {
    timeout: 3,
    onSuccess: function () {
        console.log("mqtt connected");
        // Connection succeeded; subscribe to our topic, you can add multile lines of these
        client.subscribe("maquina1", { qos: 1 });
        client.subscribe("maquina2", { qos: 1 }); 
    },
    onFailure: function (message) {
        console.log("Connection failed: " + message.errorMessage);
    },
};


function testMqtt(){
    console.log("hi");
}
function initMqtt() {
    console.log
    client.connect(options);
}
