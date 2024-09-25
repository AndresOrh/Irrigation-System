// Definir el ID del Template y el Auth Token de Blynk
#define BLYNK_TEMPLATE_ID "TMPL2hJ-OLi1K"  // Template ID obtenido en la imagen
#define BLYNK_TEMPLATE_NAME "Automated Irrigation System"
#define BLYNK_AUTH_TOKEN "soFrN_So6dtxBMZXSHFq6JuXH7vjKAwA"  // Auth Token de Blynk

// Incluir las librerías necesarias
#include <WiFi.h>  // Para ESP32
#include <BlynkSimpleEsp32.h>  // Para la conexión con Blynk

// Configuración de la red WiFi
char ssid[] = "Tu_SSID";  // Tu nombre de red WiFi
char pass[] = "Tu_Contraseña";  // Tu contraseña WiFi

// Pines virtuales en Blynk donde enviarás los datos de los sensores
#define PIN_HUMEDAD V1  // Pin virtual para humedad (en Blynk)
#define PIN_TEMPERATURA V2  // Pin virtual para temperatura (en Blynk)

// Crear un temporizador para enviar los datos periódicamente
BlynkTimer timer;

// Función para enviar los datos de los sensores a Blynk
void sendSensorData() {
  // Simular lecturas de sensores; puedes cambiar esto por el código real de tus sensores
  int humedad = analogRead(34);  // Suponiendo que el sensor de humedad está en el pin 34
  float temperatura = analogRead(35);  // Sensor de temperatura en el pin 35

  // Enviar los valores a los pines virtuales de Blynk
  Blynk.virtualWrite(PIN_HUMEDAD, humedad);  // Enviar humedad al pin V1
  Blynk.virtualWrite(PIN_TEMPERATURA, temperatura);  // Enviar temperatura al pin V2
}

// Configuración inicial del ESP32
void setup() {
  // Iniciar el monitor serie para ver mensajes
  Serial.begin(115200);

  // Conectar a Blynk con el Auth Token, y a la red WiFi
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);

  // Configurar el temporizador para que envíe los datos cada 10 segundos
  timer.setInterval(10000L, sendSensorData);
}

// Bucle principal
void loop() {
  Blynk.run();  // Ejecutar la conexión con Blynk
  timer.run();  // Ejecutar el temporizador
}
