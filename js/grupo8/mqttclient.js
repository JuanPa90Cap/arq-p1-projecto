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

        // Actualizar el contenido de los elementos HTML con los valores recibidos
        document.getElementById("memoryAvailableValue").textContent = memoryAvailable;
        document.getElementById("memoryUsedValue").textContent = memoryUsed;
        document.getElementById("networkPerformanceValue").textContent = networkPerformance;
        document.getElementById("computerIDValue").textContent = computerID;
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
