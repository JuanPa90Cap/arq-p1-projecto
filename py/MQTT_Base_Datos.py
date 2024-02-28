import psutil
import paho.mqtt.client as mqtt
import json
import time
import platform
import mysql.connector

# Configuración de MQTT
MQTT_BROKER = "mqtt-dashboard.com"  # Puedes cambiarlo al broker MQTT que estés utilizando
MQTT_TOPIC = "grupo1"

# Variables para almacenar los datos
datos_maquina_local = {}
datos_maquina_remota = {}

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
    global datos_maquina_remota
    print(f"Mensaje recibido en el tema {msg.topic}: {msg.payload}")
    datos_maquina_remota = json.loads(msg.payload)
    print("Datos de la máquina remota recibidos y guardados correctamente.")

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

    # Actualizar los datos de la máquina local
    datos_maquina_local = {
        "mensaje_maquina": "Maquina 2",
        "id_computadora": id_computadora_local,
        "memoria_disponible": memoria_disponible_local,
        "memoria_usada": memoria_usada_local,
        "rendimiento_red": rendimiento_red_local
    }

    # Convertir el diccionario a una cadena JSON
    mensaje_json_local = json.dumps(datos_maquina_local)

    # Insertar los datos de la máquina local en la base de datos MySQL
    cursor_mysql.execute('''INSERT INTO datos_mqtt 
                      (mensaje_maquina, id_computadora, memoria_disponible, memoria_usada, rendimiento_red)
                      VALUES (%s, %s, %s, %s, %s)''',
                    (datos_maquina_local["mensaje_maquina"], datos_maquina_local["id_computadora"],
                     datos_maquina_local["memoria_disponible"], datos_maquina_local["memoria_usada"],
                     datos_maquina_local["rendimiento_red"]))
    conexion_mysql.commit()

    # Publicar el mensaje JSON en el tema MQTT
    client.publish(MQTT_TOPIC, mensaje_json_local)

    # Imprimir los datos de la máquina local
    print("Maquina 2 (Local)")
    print(mensaje_json_local)

    # Esperar segundos antes de la próxima actualización
    time.sleep(5)

    # Actualizar los datos de la máquina remota si están disponibles
    if datos_maquina_remota:
        # Insertar los datos de la máquina remota en la base de datos MySQL
        cursor_mysql.execute('''INSERT INTO datos_mqtt 
                          (mensaje_maquina, id_computadora, memoria_disponible, memoria_usada, rendimiento_red)
                          VALUES (%s, %s, %s, %s, %s)''',
                        (datos_maquina_remota["mensaje_maquina"], datos_maquina_remota["id_computadora"],
                         datos_maquina_remota["memoria_disponible"], datos_maquina_remota["memoria_usada"],
                         datos_maquina_remota["rendimiento_red"]))
        conexion_mysql.commit()

        # Imprimir los datos de la máquina remota
        print("Maquina 1 (Remota)")
        print(f"ID: {datos_maquina_remota['id_computadora']}, Memoria disponible: {datos_maquina_remota['memoria_disponible']}, Memoria usada: {datos_maquina_remota['memoria_usada']}, Rendimiento de red: {datos_maquina_remota['rendimiento_red']}")

    # Esperar segundos antes de la próxima actualización
    time.sleep(15)

# Cerrar la conexión con la base de datos MySQL al finalizar
conexion_mysql.close()
