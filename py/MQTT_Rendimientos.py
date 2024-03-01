import psutil
import paho.mqtt.client as mqtt
import json
import time
import platform
from datetime import datetime  # Importa el módulo datetime

# Configuración de MQTT
MQTT_BROKER = "mqtt-dashboard.com"  # Puedes cambiarlo al broker MQTT que estés utilizando
MQTT_TOPIC = "maquina1"

# Función de conexión al broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"Conectado con el código de resultado {rc}")
    client.subscribe(MQTT_TOPIC)

# Función de manejo de mensajes MQTT
def on_message(client, userdata, msg):
    print(f"Mensaje recibido en el tema {msg.topic}: {msg.payload}")

# Configuración del cliente MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

# Conexión al broker MQTT
client.connect(MQTT_BROKER, 1883, 60)

while True:
    # Obtener la fecha y hora actual
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Obtener la cantidad de memoria disponible
    memoria_disponible = round(psutil.virtual_memory().available / (1024 * 1024), 2)

    # Obtener el porcentaje de uso de la memoria
    memoria_usada = round(psutil.virtual_memory().percent, 2)

    # Obtener el rendimiento de la red
    rendimiento_red = round(psutil.net_io_counters().bytes_sent / (1024 * 1024), 2)

    # Obtener el ID de la computadora
    id_computadora = platform.node()

    maquina="Maquina 1"

    # Crear un diccionario con los datos
    datos = {
        "identificador": maquina,
        "fecha_hora": fecha_actual,  # Agrega la fecha y hora actual
        "id_computadora": id_computadora,
        "memoria_disponible": memoria_disponible,
        "memoria_usada": memoria_usada,
        "rendimiento_red": rendimiento_red
    }

    # Convertir el diccionario a una cadena JSON
    mensaje_json = json.dumps(datos)

    # Publicar el mensaje JSON en el tema MQTT
    client.publish(MQTT_TOPIC, mensaje_json)

    # Imprimir los datos
    print("Maquina 1")
    print(mensaje_json)

    # Esperar segundos antes de la próxima actualización
    time.sleep(3)
