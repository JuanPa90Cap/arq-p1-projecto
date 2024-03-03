//Grupo 3
var wsbroker = "broker.hivemq.com";

var wsport = 1883;
var client = new Paho.MQTT.Client(
	wsbroker,
	Number(8000),
	"myclientid_" + parseInt(Math.random() * 100, 10)
);

client.onConnectionLost = function (responseObject) {
	console.log("connection lost: " + responseObject.errorMessage);
};

client.onMessageArrived = function (message) {
    try {
        // Parsea el mensaje JSON recibido
        let response = JSON.parse(message.payloadString);

        // Verifica si el mac_address es igual a '92:25:4b:97:2f:5f'
        if (response.mac_address === '92:25:4b:97:2f:5f') {
            // Actualiza los elementos HTML solo si el mac_address coincide
            document.getElementById("macAdressValue").innerHTML = response.mac_address;
            document.getElementById("cpuValue").innerHTML = response.rendimiento_cpu + '%';
            document.getElementById("memoriaValue").innerHTML = response.rendimiento_memoria + '%';
            document.getElementById("redValue").innerHTML = response.rendimiento_red.toFixed(2) + ' GB';
        }

        // Verifica si el mac_address es igual a '00:00:01:03:06:0c'
        if (response.mac_address === '00:00:01:03:06:0c') {
            // Actualiza los elementos HTML solo si el mac_address coincide
            document.getElementById("macAdressValue2").innerHTML = response.mac_address;
            document.getElementById("cpuValue2").innerHTML = response.rendimiento_cpu + '%';
            document.getElementById("memoriaValue2").innerHTML = response.rendimiento_memoria + '%';
            document.getElementById("redValue2").innerHTML = response.rendimiento_red.toFixed(2) + ' GB';
        }

		if (Array.isArray(response) && response.length === 10) {
            // Verifica si todos los registros tienen la misma mac_address
            var mismaMacAddress = response.every(function(registro) {
                return registro.mac_address === '92:25:4b:97:2f:5f';
            });
        
            if (mismaMacAddress) {
                var tabla = document.getElementById("miTabla");
                // Elimina todas las filas existentes en la tabla
                while (tabla.rows.length > 0) {
                    tabla.deleteRow(0);
                }
                var filaEncabezado = tabla.insertRow(0);
                var encabezados = ["Fecha", "Mac Address", "Rendimiento CPU", "Rendimiento Memoria", "Rendimiento Red", "Sistema Operativo"];
                for (var i = 0; i < encabezados.length; i++) {
                    var encabezado = filaEncabezado.insertCell(i);
                    encabezado.innerHTML = "<b>" + encabezados[i] + "</b>";
                }
                // Agrega las filas con los datos recibidos
                for (let i = 0; i < response.length; i++) {
                    var fila = tabla.insertRow(i+1);
                    var registro = response[i];
                    // Agrega las celdas con los datos del registro
                    fila.insertCell(0).innerHTML = registro.fecha_hora;
                    fila.insertCell(1).innerHTML = registro.mac_address;
                    fila.insertCell(2).innerHTML = registro.rendimiento_cpu + '%';
                    fila.insertCell(3).innerHTML = registro.rendimiento_memoria + '%';
                    fila.insertCell(4).innerHTML = registro.rendimiento_red.toFixed(2) + ' GB';
                    fila.insertCell(5).innerHTML = registro.sistema_operativo;
                }
            }
        }
        if (Array.isArray(response) && response.length === 10) {
            // Verifica si todos los registros tienen la misma mac_address
            var mismaMacAddress = response.every(function(registro) {
                return registro.mac_address === '00:00:01:03:06:0c';
            });
        
            if (mismaMacAddress) {
                var tabla = document.getElementById("miTabla2");
                // Elimina todas las filas existentes en la tabla
                while (tabla.rows.length > 0) {
                    tabla.deleteRow(0);
                }
                var filaEncabezado = tabla.insertRow(0);
                var encabezados = ["Fecha", "Mac Address", "Rendimiento CPU", "Rendimiento Memoria", "Rendimiento Red", "Sistema Operativo"];
                for (var i = 0; i < encabezados.length; i++) {
                    var encabezado = filaEncabezado.insertCell(i);
                    encabezado.innerHTML = "<b>" + encabezados[i] + "</b>";
                }
                // Agrega las filas con los datos recibidos
                for (let i = 0; i < response.length; i++) {
                    var fila = tabla.insertRow(i+1);
                    var registro = response[i];
                    // Agrega las celdas con los datos del registro
                    fila.insertCell(0).innerHTML = registro.fecha_hora;
                    fila.insertCell(1).innerHTML = registro.mac_address;
                    fila.insertCell(2).innerHTML = registro.rendimiento_cpu + '%';
                    fila.insertCell(3).innerHTML = registro.rendimiento_memoria + '%';
                    fila.insertCell(4).innerHTML = registro.rendimiento_red.toFixed(2) + ' GB';
                    fila.insertCell(5).innerHTML = registro.sistema_operativo;
                }
            }
        }
        if (Array.isArray(response) && response.length === 10) {
            // Verifica si todos los registros tienen la misma mac_address
            var mismaMacAddress = response.every(function(registro) {
                return registro.mac_address === '10:20:40:80:01:02';
            });
        
            if (mismaMacAddress) {
                var tabla = document.getElementById("miTabla3");
                // Elimina todas las filas existentes en la tabla
                while (tabla.rows.length > 0) {
                    tabla.deleteRow(0);
                }
                var filaEncabezado = tabla.insertRow(0);
                var encabezados = ["Fecha", "Mac Address", "Rendimiento CPU", "Rendimiento Memoria", "Rendimiento Red", "Sistema Operativo"];
                for (var i = 0; i < encabezados.length; i++) {
                    var encabezado = filaEncabezado.insertCell(i);
                    encabezado.innerHTML = "<b>" + encabezados[i] + "</b>";
                }
                // Agrega las filas con los datos recibidos
                for (let i = 0; i < response.length; i++) {
                    var fila = tabla.insertRow(i+1);
                    var registro = response[i];
                    // Agrega las celdas con los datos del registro
                    fila.insertCell(0).innerHTML = registro.fecha_hora;
                    fila.insertCell(1).innerHTML = registro.mac_address;
                    fila.insertCell(2).innerHTML = registro.rendimiento_cpu + '%';
                    fila.insertCell(3).innerHTML = registro.rendimiento_memoria + '%';
                    fila.insertCell(4).innerHTML = registro.rendimiento_red.toFixed(2) + ' GB';
                    fila.insertCell(5).innerHTML = registro.sistema_operativo;
                }
            }
        }
        if (Array.isArray(response) && response.length === 10) {
            // Verifica si todos los registros tienen una mac_address diferente a las especificadas
            var macAddressDiferente = response.every(function(registro) {
                var macAddressesProhibidas = ['92:25:4b:97:2f:5f', '10:20:40:80:01:02', '00:00:01:03:06:0c'];
                return !macAddressesProhibidas.includes(registro.mac_address);
            });
        
            if (macAddressDiferente) {
                var tabla = document.getElementById("miTabla4");
                // Elimina todas las filas existentes en la tabla
                while (tabla.rows.length > 0) {
                    tabla.deleteRow(0);
                }
                var filaEncabezado = tabla.insertRow(0);
                var encabezados = ["Fecha", "Mac Address", "Rendimiento CPU", "Rendimiento Memoria", "Rendimiento Red", "Sistema Operativo"];
                for (var i = 0; i < encabezados.length; i++) {
                    var encabezado = filaEncabezado.insertCell(i);
                    encabezado.innerHTML = "<b>" + encabezados[i] + "</b>";
                }
                // Agrega las filas con los datos recibidos
                for (let i = 0; i < response.length; i++) {
                    var fila = tabla.insertRow(i+1);
                    var registro = response[i];
                    // Agrega las celdas con los datos del registro
                    fila.insertCell(0).innerHTML = registro.fecha_hora;
                    fila.insertCell(1).innerHTML = registro.mac_address;
                    fila.insertCell(2).innerHTML = registro.rendimiento_cpu + '%';
                    fila.insertCell(3).innerHTML = registro.rendimiento_memoria + '%';
                    fila.insertCell(4).innerHTML = registro.rendimiento_red.toFixed(2) + ' GB';
                    fila.insertCell(5).innerHTML = registro.sistema_operativo;
                }
            }
        }
        
        // Imprime el mensaje recibido en la consola si es necesario
		console.log("Mensaje recibido:", response);
    } catch (error) {
        console.error("Error al procesar el mensaje:", error);
    }
};



var options = {
	timeout: 3,
	onSuccess: function () {
		console.log("mqtt connected");
		// Connection succeeded; subscribe to our topic, you can add multile lines of these
		client.subscribe("grupo3", { qos: 1 });
	},
	onFailure: function (message) {
		console.log("Connection failed: " + message.errorMessage);
	},
};


function testMqtt(){
	console.log("hi");
}
function initMqtt() {
	client.connect(options);
}