/*################################################################################################*/
/*####################################### CLIENTE MQTT ###########################################*/
/*################################################################################################*/

//var wsbroker = "0.tcp.sa.ngrok.io";
var wsbroker = "mqtt-dashboard.com";
//var wsbroker = "localhost";

//var wsport = 14792; // port for above
var wsport = 8884; // port for above
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

function addData(chart, newData) {
  chart.data.labels.push(new Date().toLocaleTimeString());
  chart.data.datasets.forEach((dataset) => {
    dataset.data.push(newData);
  });
  chart.update();
}

function sendDataToServer(cpu_usage, memory_usage, bytes_sent, bytes_recv, host) {
    // Actualizar los valores en los elementos HTML correspondientes
    document.getElementById("CpuUsage").textContent = cpu_usage;
    document.getElementById("memoryUsage").textContent = memory_usage;
    document.getElementById("bytesSent").textContent = bytes_sent;
    document.getElementById("bytesRecv").textContent = bytes_recv;
    document.getElementById("temperature").textContent = host;

    // Enviar los datos al servidor
    fetch('http://localhost:5000/api/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            cpu_usage: cpu_usage,
            memory_usage: memory_usage,
            bytes_sent: bytes_sent,
            bytes_recv: bytes_recv,
            host: host
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Datos guardados en el servidor:', data);
    })
    .catch(error => {
        console.error('Error al enviar los datos al servidor:', error);
    });
}

client.onMessageArrived = function (message) {
    console.log("Mensaje recibido");
    console.log(message);
    let destination = message.destinationName;
    if (destination === "grupo6") {
        let response = JSON.parse(message.payloadString);

        // Extraer el host del mensaje JSON recibido
        let host = response.host;

        // Enviar los datos al servidor
        sendDataToServer(response.cpu_usage, response.memory_usage, response.bytes_sent, response.bytes_recv, host);
    }
};

var options = {
  timeout: 3,
  onSuccess: function () {
    console.log("mqtt connected");
    // Connection succeeded; subscribe to our topic, you can add multile lines of these
    client.subscribe("grupo6", { qos: 1 });
  },
  onFailure: function (message) {
    console.log("Connection failed: " + message.errorMessage);
  },
};

function testMqtt() {
  console.log("hi");
}
function initMqtt() {
  client.connect(options);
}
function actualizarTabla(){
fetch('http://localhost/api.php')
  .then(response => response.json())
  .then(data => {
   
    const tbody = document.getElementById('tbody-datos');
    tbody.innerHTML = '';
    data.forEach(rowData => {
      // Crear una nueva fila
      const row = document.createElement('tr');

      // Iterar sobre las columnas de cada fila
        Object.keys(rowData).forEach(key => {
        // Omitir la columna que deseas omitir
        if (key !== 'timestamp') {
          // Crear una celda para cada valor y agregarla a la fila
          const cell = document.createElement('td');
          cell.textContent = rowData[key];
          row.appendChild(cell);
        }
      });

      // Agregar la fila al tbody
      tbody.appendChild(row);
    });
  })
  .catch(error => console.error('Error:', error));
}

actualizarTabla();
setInterval(actualizarTabla, 10000);