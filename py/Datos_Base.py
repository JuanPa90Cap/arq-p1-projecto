import psutil
import paho.mqtt.client as mqtt
import json
import time
import platform
from datetime import datetime

# Configuración de MQTT
MQTT_BROKER = "mqtt-dashboard.com"  # Puedes cambiarlo al broker MQTT que estés utilizando
MQTT_TOPIC = "base1"

# Variables para almacenar los datos
datos_maquina_local = {}

# Función de conexión al broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"Conectado con el código de resultado {rc}")

# Configuración del cliente MQTT
client = mqtt.Client()
client.on_connect = on_connect

# Conexión al broker MQTT
client.connect(MQTT_BROKER, 1883, 60)

# Iniciar el bucle de mensajes MQTT
client.loop_start()

while True:
    # Obtener la cantidad de memoria disponible para la máquina local
    memoria_disponible_local = round(psutil.virtual_memory().available / (1024 * 1024), 2)
    memoria_usada_local = round(psutil.virtual_memory().percent, 2)
    rendimiento_red_local = round(psutil.net_io_counters().bytes_sent / (1024 * 1024), 2)

    # Obtener el ID de la computadora local
    id_computadora_local = platform.node()

    # Obtener la fecha y hora actual una vez para todas las máquinas
    fecha_actual = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # Actualizar los datos de la máquina local
    datos_maquina_local = {
        "fecha": fecha_actual,
        "mensaje_maquina": "Maquina 40",
        "id_computadora": id_computadora_local,
        "memoria_disponible": memoria_disponible_local,
        "memoria_usada": memoria_usada_local,
        "rendimiento_red": rendimiento_red_local
    }

    # Convertir el diccionario a una cadena JSON
    mensaje_json_local = json.dumps(datos_maquina_local)

    # Publicar el mensaje JSON en el tema MQTT
    client.publish(MQTT_TOPIC, mensaje_json_local)

    # Imprimir los datos de la máquina local
    print("Maquina 40")
    print(mensaje_json_local)

    # Esperar segundos antes de la próxima actualización
    time.sleep(5)
