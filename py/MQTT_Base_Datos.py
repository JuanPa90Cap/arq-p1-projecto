import psutil
import paho.mqtt.client as mqtt
import json
import time
import platform
import mysql.connector
from datetime import datetime

# Configuración de MQTT
MQTT_BROKER = "mqtt-dashboard.com"  # Puedes cambiarlo al broker MQTT que estés utilizando
MQTT_TOPIC = "base1"

# Variables para almacenar los datos
datos_maquina_local = {}
datos_maquina_remotas = {}  # Cambio a un solo diccionario para todas las máquinas remotas

# Configuración de la base de datos MySQL
MYSQL_HOST = "mysql-milisen.alwaysdata.net"
MYSQL_USER = "milisen_uce"
MYSQL_PASSWORD = "mili123"
MYSQL_DATABASE = "milisen_uce"

# Conexión a la base de datos MySQL
conexion_mysql = mysql.connector.connect(
    host=MYSQL_HOST,
    user=MYSQL_USER,
    password=MYSQL_PASSWORD,
    database=MYSQL_DATABASE
)
cursor_mysql = conexion_mysql.cursor()

# Función de conexión al broker MQTT
def on_connect(client, userdata, flags, rc):
    print(f"Conectado con el código de resultado {rc}")
    client.subscribe(MQTT_TOPIC)

# Función de manejo de mensajes MQTT
def on_message(client, userdata, msg):
    global datos_maquina_remotas
    print(f"Mensaje recibido en el tema {msg.topic}: {msg.payload}")
    datos_maquina_remota = json.loads(msg.payload)
    if "mensaje_maquina" in datos_maquina_remota:
        # Utilizamos el mensaje_maquina como clave en el diccionario
        datos_maquina_remotas[datos_maquina_remota["mensaje_maquina"]] = datos_maquina_remota
        print("Datos de la máquina remota recibidos y guardados correctamente.")
    else:
        print("El mensaje recibido no contiene la clave 'mensaje_maquina'.")

# Configuración del cliente MQTT
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

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
        "fecha": fecha_actual,  # Cambio de 'fecha_hora' a 'timestamp'
        "mensaje_maquina": "Maquina 1",
        "id_computadora": id_computadora_local,
        "memoria_disponible": memoria_disponible_local,
        "memoria_usada": memoria_usada_local,
        "rendimiento_red": rendimiento_red_local
    }

    # Convertir el diccionario a una cadena JSON
    mensaje_json_local = json.dumps(datos_maquina_local)

    # Insertar los datos de la máquina local en la base de datos MySQL
    cursor_mysql.execute('''INSERT INTO base
                      (fecha, mensaje_maquina, id_computadora, memoria_disponible, memoria_usada, rendimiento_red)
                      VALUES (%s, %s, %s, %s, %s, %s)''',
                    (datos_maquina_local["fecha"], datos_maquina_local["mensaje_maquina"], datos_maquina_local["id_computadora"],
                     datos_maquina_local["memoria_disponible"], datos_maquina_local["memoria_usada"],
                     datos_maquina_local["rendimiento_red"]))
    conexion_mysql.commit()

    # Publicar el mensaje JSON en el tema MQTT
    client.publish(MQTT_TOPIC, mensaje_json_local)

    # Imprimir los datos de la máquina local
    print("Maquina 1 (Local)")
    print(mensaje_json_local)

    # Esperar segundos antes de la próxima actualización
    time.sleep(5)

    # Actualizar los datos de las máquinas remotas si están disponibles
    if len(datos_maquina_remotas) >= 1:  # Si hay datos de al menos 1 máquina remota
        # Insertar los datos de las máquinas remotas en la base de datos MySQL
        try:
            for mensaje_maquina, datos_maquina_remota in datos_maquina_remotas.items():
                # Utilizar la misma fecha que la máquina local para las demás máquinas
                datos_maquina_remota["fecha"] = fecha_actual
                cursor_mysql.execute('''INSERT INTO base 
                                  (fecha, mensaje_maquina, id_computadora, memoria_disponible, memoria_usada, rendimiento_red)
                                  VALUES (%s, %s, %s, %s, %s, %s)''',
                                (datos_maquina_remota.get("fecha", ""), mensaje_maquina, datos_maquina_remota.get("id_computadora", ""),
                                 datos_maquina_remota.get("memoria_disponible", ""), datos_maquina_remota.get("memoria_usada", ""),
                                 datos_maquina_remota.get("rendimiento_red", "")))
            conexion_mysql.commit()
            print("Datos de las máquinas remotas insertados en la base de datos MySQL correctamente.")
            # Limpiar el diccionario de datos de máquinas remotas después de insertarlos en la base de datos
            datos_maquina_remotas = {}
        except mysql.connector.Error as error:
            print("Error al insertar datos de las máquinas remotas en la base de datos MySQL:", error)

    # Esperar segundos antes de la próxima actualización
    time.sleep(5)

# Cerrar la conexión con la base de datos MySQL al finalizar
conexion_mysql.close()
