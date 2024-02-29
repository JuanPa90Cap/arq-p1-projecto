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
let memoryAvailableData = [];
let memoryUsedData = [];
let networkPerformanceData = [];
let computerIDData = [];

client.onMessageArrived = function (message) {
    console.log("Mensaje recibido");
    console.log(message);
    let destination = message.destinationName;
    if (destination === "prueba1") {
        let response = JSON.parse(message.payloadString);

        // Extraer todos los datos del mensaje JSON recibido
        let memoryAvailable = response.available_memory;
        let memoryUsed = response.used_memory;
        let networkPerformance = response.network_performance;
        let computerID = response.computer_id;
        let timestamp = response.timestamp;

        // Mostrar la fecha y la hora recibidas
        let formattedTimestamp = new Date(timestamp).toLocaleString();
        console.log(computerID);
        // Determinar qué computadora es y actualizar los elementos HTML correspondientes
        if (computerID === "Machine 1") {
            console.log("Estoy en la maquina 1");
            document.getElementById("computerIDValue1").textContent = computerID;
            document.getElementById("memoryAvailableValue1").textContent = memoryAvailable;
            document.getElementById("memoryUsedValue1").textContent = memoryUsed;
            document.getElementById("networkPerformanceValue1").textContent = networkPerformance;
            document.getElementById("formattedTimestamp1").textContent = formattedTimestamp;
        } else if (computerID === "Machine 2") {
            console.log("Estoy en la maquina 2");
            document.getElementById("computerIDValue2").textContent = computerID;
            document.getElementById("memoryAvailableValue2").textContent = memoryAvailable;
            document.getElementById("memoryUsedValue2").textContent = memoryUsed;
            document.getElementById("networkPerformanceValue2").textContent = networkPerformance;
            document.getElementById("formattedTimestamp2").textContent = formattedTimestamp;
        }
    }
};


// Función para calcular el porcentaje de cambio
function calculatePercentage(diff, prevValue) {
    if (prevValue === 0) {
        return "0"; // Si el valor anterior es cero, el porcentaje de cambio es cero
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
        client.subscribe("prueba1", { qos: 1 });
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
