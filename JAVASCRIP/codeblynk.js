// Tu Auth Token de Blynk
const authToken = "soFrN_So6dtxBMZXSHFq6JuXH7vjKAwA";
const apiUrl = `https://blynk.cloud/external/api/get?token=${authToken}`;

// Pines virtuales de Blynk
const moisturePin = "V0";    // Pin para la humedad del suelo
const waterPumpPin = "V1"; 
const temperaturePin = "V2"; // Pin para la temperatura
const humidityPin = "V3";    // Pin para la humedad del aire


let moistureChart, temperatureChart, humidityChart;  // Variables para almacenar los gráficos

// Función para obtener datos de Blynk
async function getDataFromBlynk(pin) {
  try {
    const response = await fetch(`${apiUrl}&${pin}`);
    const data = await response.text();
    return parseFloat(data);
  } catch (error) {
    console.error("Error al obtener los datos de Blynk:", error);
    return null;
  }
}

// Función para crear un gráfico de dona
function createDoughnutChart(ctx, value, color) {
  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      datasets: [{
        data: [value, 100 - value],
        backgroundColor: [color, '#e0e0e0'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },  // Sin leyenda
        tooltip: { enabled: true }   // Tooltips habilitados
      },
      cutout: '70%' // Espacio en el centro
    }
  });
}

// Inicializar los gráficos
async function initCharts() {
  // Inicializar el gráfico de humedad del suelo
  const moisture = await getDataFromBlynk(moisturePin);
  const ctxMoisture = document.getElementById('moistureChart').getContext('2d');
  if (moisture !== null) {
    moistureChart = createDoughnutChart(ctxMoisture, moisture, '#94ab6f');  // Verde para humedad
    document.getElementById('moistureValue').innerText = moisture;  // Mostrar valor
  }

  // Inicializar el gráfico de temperatura
  const temperature = await getDataFromBlynk(temperaturePin);
  const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
  if (temperature !== null) {
    temperatureChart = createDoughnutChart(ctxTemperature, temperature, '#f44336');  // Rojo para temperatura
    document.getElementById('temperatureValue').innerText = temperature;  // Mostrar valor
  }

  // Inicializar el gráfico de humedad del aire
  const humidity = await getDataFromBlynk(humidityPin);
  const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
  if (humidity !== null) {
    humidityChart = createDoughnutChart(ctxHumidity, humidity, '#00d5f3');  // Azul para humedad del aire
    document.getElementById('humidityValue').innerText = humidity;  // Mostrar valor
  }
}

// Función para actualizar los gráficos con nuevos datos de Blynk
async function updateCharts() {
  // Actualizar gráfico de humedad del suelo
  const moisture = await getDataFromBlynk(moisturePin);
  if (moisture !== null) {
    moistureChart.data.datasets[0].data = [moisture, 100 - moisture];
    moistureChart.update();  // Refrescar el gráfico
    document.getElementById('moistureValue').innerText = moisture;  // Mostrar valor actualizado
  }

  // Actualizar gráfico de temperatura
  const temperature = await getDataFromBlynk(temperaturePin);
  if (temperature !== null) {
    temperatureChart.data.datasets[0].data = [temperature, 100 - temperature];
    temperatureChart.update();  // Refrescar el gráfico
    document.getElementById('temperatureValue').innerText = temperature;  // Mostrar valor actualizado
  }

  // Actualizar gráfico de humedad del aire
  const humidity = await getDataFromBlynk(humidityPin);
  if (humidity !== null) {
    humidityChart.data.datasets[0].data = [humidity, 100 - humidity];
    humidityChart.update();  // Refrescar el gráfico
    document.getElementById('humidityValue').innerText = humidity;  // Mostrar valor actualizado
  }
}

// Llamar a la función de inicialización al cargar la página
initCharts();

// Actualizar los gráficos cada 100 ms (0.1 segundos)
setInterval(() => {
  updateCharts();
}, 100);  // Actualización rápida

// --- Control de la bomba de agua ---

// Obtener el elemento del interruptor de la bomba de agua
const waterPumpSwitch = document.getElementById('waterPumpSwitch');

// Función para enviar el estado del interruptor a Blynk
async function setWaterPumpState(state) {
  const url = `https://blynk.cloud/external/api/update?token=${authToken}&${waterPumpPin}=${state}`;
  try {
    const response = await fetch(url, {
      method: 'GET', 
    });
    
    if (!response.ok) {
      console.error('Error en la respuesta de Blynk:', response.status, response.statusText);
      throw new Error('Error al enviar el estado de la bomba de agua a Blynk');
    } else {
      console.log(`Estado de la bomba de agua enviado exitosamente: ${state}`);
    }
  } catch (error) {
    console.error("Error al actualizar la bomba de agua en Blynk:", error);
  }
}



// Manejar el cambio de estado del interruptor
waterPumpSwitch.addEventListener('change', () => {
  const pumpState = waterPumpSwitch.checked ? 1 : 0;  // 1 es encendido, 0 es apagado
  setWaterPumpState(pumpState);
});

// Inicializar el estado del interruptor basado en los datos de Blynk
async function initWaterPumpState() {
  const pumpState = await getDataFromBlynk(waterPumpPin);
  if (pumpState !== null) {
    waterPumpSwitch.checked = pumpState === 1;  // Si Blynk devuelve 1, se activa el interruptor
  }
}

// Llamar a la función de inicialización del interruptor al cargar la página
initWaterPumpState();
