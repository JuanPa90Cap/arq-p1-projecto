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
let prevDiskValue = 0;
let prevRecepcionValue = 0;

client.onMessageArrived = function (message) {
    console.log("hola aqui")
    console.log(message)
	let destination = message.destinationName;
	if (destination === "probar_1") {
        let response = JSON.parse(message.payloadString);
        dataFormat = response;
        let dataMemoria = dataFormat.Memoria;
        let dataDisco = dataFormat.Disco;
        let dataRecepcion = dataFormat.Recepcion;
        
        //info pc
        document.getElementById("arquitecturaValue").innerText = response.Arquitectura;
        document.getElementById("sistemaValue").innerText = response.Sistema;
        document.getElementById("ramValue").innerText = response.Ram;
        document.getElementById("procesadorValue").innerText = response.Procesador;
        document.getElementById("almacenamientoValue").innerText = response.Almacenamiento;

        // Calcular la diferencia con respecto al valor anterior
        let diffCPU = dataCPU - prevCPUValue;
        let diffMemory = dataMemoria - prevMemoryValue;
        let diffDisk = dataDisco - prevDiskValue;
        let diffRecepcion = dataRecepcion - prevRecepcionValue;

        // Calcular el porcentaje de cambio
        let percentageCPU = calculatePercentage(diffCPU, prevCPUValue);
        let percentageMemory = calculatePercentage(diffMemory, prevMemoryValue);
        let percentageDisk = calculatePercentage(diffDisk, prevDiskValue);
        let percentageRecepcion = calculatePercentage(diffRecepcion, prevRecepcionValue);

        // Actualizar los valores en tiempo real en la página
        document.getElementById("cpuValue").innerText = dataCPU;
        document.getElementById("memoryValue").innerText = dataMemoria;
        document.getElementById("diskValue").innerText = dataDisco;
        document.getElementById("RecepcionValue").innerText = dataRecepcion;

        // Actualizar los porcentajes en la página
        document.getElementById("cpuPercentage").innerHTML = getColoredPercentage(percentageCPU);
        document.getElementById("memoryPercentage").innerHTML = getColoredPercentage(percentageMemory);
        document.getElementById("diskPercentage").innerHTML = getColoredPercentage(percentageDisk);
        document.getElementById("RecepcionPercentage").innerHTML = getColoredPercentage(percentageRecepcion);

        // Actualizar los valores anteriores con los nuevos valores
        prevCPUValue = dataCPU;
        prevMemoryValue = dataMemoria;
        prevDiskValue = dataDisco;
        prevRecepcionValue = dataRecepcion;

        // Cargar datos CPU, Memoria y Almacenamiento en las gráficas
        addData(myChartCPU, dataCPU);
        addData2(myChartMemory, dataMemoria);
        addData3(myChartDisk, dataDisco);
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
        return "0";
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
		client.subscribe("grupo1", { qos: 1 });
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