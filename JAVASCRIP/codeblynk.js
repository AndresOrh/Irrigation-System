// Tu Auth Token de Blynk
 const authToken = "soFrN_So6dtxBMZXSHFq6JuXH7vjKAwA";
 const apiUrl = `https://blynk.cloud/external/api/get?token=${authToken}`;


 // Pines virtuales de Blynk
 const moisturePin = "V0";
 const sensorSwapPin = "V1";
 const temperaturePin = "V2";
 const humidityPin = "V3";
 const automatedIrrigationPin = "V4";
 // Variables para los gráficos
 let moistureChart, temperatureChart, humidityChart;
 let currentChartType = 'doughnut';  // Tipo de gráfico actual

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

 // Función para crear un gráfico
 function createChart(ctx, value, color, type) {
  const data = {
    datasets: [{
      data: type === 'bar' ? [value] : [value, 100 - value],
      backgroundColor: type === 'bar' ? [color] : [color, '#FFFFFF'],
      borderWidth: 2
    }],
    labels: type === 'bar' || type === 'line' ? ['Value'] : []
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    cutout: type === 'doughnut' ? '80%' : 0,
    scales: type === 'bar' || type === 'line' ? {
      y: {
        beginAtZero: true,
        max: 100,  // Aquí puedes ajustar el valor máximo según lo que necesites.
        ticks: {
          stepSize: 10 // Ajusta el tamaño de los pasos entre las marcas del eje Y
        }
      },
      x: {
        grid: {
          display: false  // Puedes ocultar las líneas de la cuadrícula del eje X si lo prefieres
        }
      }
    } : {}
  };

  return new Chart(ctx, {
    type: type === 'line' ? 'line' : type,
    data: data,
    options: options
  });
}
 

 // Inicializar los gráficos
 async function initCharts() {
   const moisture = await getDataFromBlynk(moisturePin);
   const ctxMoisture = document.getElementById('moistureChart').getContext('2d');
   if (moisture !== null) {
     moistureChart = createChart(ctxMoisture, moisture, '#94ab6f', currentChartType);
     document.getElementById('moistureValue').innerText = moisture;
   }

   const temperature = await getDataFromBlynk(temperaturePin);
   const ctxTemperature = document.getElementById('temperatureChart').getContext('2d');
   if (temperature !== null) {
     temperatureChart = createChart(ctxTemperature, temperature, '#f44336', currentChartType);
     document.getElementById('temperatureValue').innerText = temperature;
   }

   const humidity = await getDataFromBlynk(humidityPin);
   const ctxHumidity = document.getElementById('humidityChart').getContext('2d');
   if (humidity !== null) {
     humidityChart = createChart(ctxHumidity, humidity, '#00d5f3', currentChartType);
     document.getElementById('humidityValue').innerText = humidity;
   }
 }

 // Función para actualizar los gráficos con nuevos datos
 async function updateCharts() {
   const moisture = await getDataFromBlynk(moisturePin);
   if (moisture !== null) {
     moistureChart.data.datasets[0].data = currentChartType === 'bar' ? [moisture] : [moisture, 100 - moisture];
     moistureChart.update();
     document.getElementById('moistureValue').innerText = moisture;
   }

   const temperature = await getDataFromBlynk(temperaturePin);
   if (temperature !== null) {
     temperatureChart.data.datasets[0].data = currentChartType === 'bar' ? [temperature] : [temperature, 100 - temperature];
     temperatureChart.update();
     document.getElementById('temperatureValue').innerText = temperature;
   }

   const humidity = await getDataFromBlynk(humidityPin);
   if (humidity !== null) {
     humidityChart.data.datasets[0].data = currentChartType === 'bar' ? [humidity] : [humidity, 100 - humidity];
     humidityChart.update();
     document.getElementById('humidityValue').innerText = humidity;
   }
 }

 // Llamar a la función de inicialización al cargar la página
 initCharts();

 // Actualizar los gráficos cada 100 ms
 setInterval(() => {
   updateCharts();
 }, 100);

 // Función para manejar el cambio de tipo de gráfico
 document.getElementById('chartType').addEventListener('change', () => {
   currentChartType = document.getElementById('chartType').value;

   // Destruir los gráficos antiguos
   moistureChart.destroy();
   temperatureChart.destroy();
   humidityChart.destroy();

   // Volver a crear los gráficos con el nuevo tipo
   initCharts();
 });
 

 // --- Control de el Swap Button---

 const sensorSwapSwitch = document.getElementById('sensorSwapBtn');

 // Función para enviar el estado del interruptor a Blynk
 async function setSensorSwapState(state) {
   const url = `https://blynk.cloud/external/api/update?token=${authToken}&${sensorSwapPin}=${state}`;
   try {
     const response = await fetch(url);
     if (!response.ok) {
       console.error('Error en la respuesta de Blynk:', response.status, response.statusText);
       throw new Error('Error al enviar el estado del swap button');
     } else {
       console.log(`Estado de el swap button enviado exitosamente: ${state}`);
     }
   } catch (error) {
     console.error("Error al actualizar el swap button en Blynk:", error);
   }
 }

 // Manejar el cambio de estado del interruptor
sensorSwapSwitch.addEventListener('change', () => {
   const swapState = sensorSwapSwitch.checked ? 1 : 0;
   setSensorSwapState(swapStateState);
 });

 // Inicializar el estado del interruptor basado en los datos de Blynk
 async function initSensorSwapState() {
   const swapState = await getDataFromBlynk(sensorSwapPin);
   if (swapState !== null) {
     sensorSwapSwitch.checked = swapState === 1;
   }
 }

 // Llamar a la inicialización del interruptor de el swap button
 initSensorSwapState();

 const sensors = ["Sensor 1", "Sensor 2", "Sensor 3"];
let currentSensorIndex = 0;  // Índice del sensor actual

// Referencia al botón de Swap
const sensorSwapBtn = document.getElementById('sensorSwapBtn');

// Función para actualizar el sensor activo en la interfaz
function updateSensorDisplay() {
    document.getElementById("sensorDisplay").innerText = sensors[currentSensorIndex];
}

// Función para cambiar al siguiente sensor y alternar el mensaje del botón
function toggleSensor() {
    // Cambiar al siguiente sensor en el ciclo
    currentSensorIndex = (currentSensorIndex + 1) % sensors.length;
    updateSensorDisplay();  // Actualizar la interfaz

    // Enviar el estado del sensor a Blynk
    setSensorSwapState(currentSensorIndex + 1);  // Ajustar el índice a partir de 1

    // Cambiar el mensaje del botón
    if (sensorSwapBtn.innerText === "Swap") {
        sensorSwapBtn.innerText = "Swapped";
    } else {
        sensorSwapBtn.innerText = "Swap";
    }
}

// Asignar el evento de clic al botón
sensorSwapBtn.addEventListener('click', toggleSensor);

// Inicializar el sensor activo al cargar la página
updateSensorDisplay();


 //Control de el boton de Automatizacion del sistema de riego

 const automatedIrrigationSwitch = document.getElementById('automatedIrrigationSwitch');

 // Función para enviar el estado del interruptor a Blynk
 async function setAutomatedIrrigationState(state) {
   const url = `https://blynk.cloud/external/api/update?token=${authToken}&${automatedIrrigationPin}=${state}`;
   try {
     const response = await fetch(url);
     if (!response.ok) {
       console.error('Error en la respuesta de Blynk:', response.status, response.statusText);
       throw new Error('Error al enviar el estado de el boton de irrigacion Automatica a Blynk');
     } else {
       console.log(`Estado de la bomba de agua enviado exitosamente: ${state}`);
     }
   } catch (error) {
     console.error("Error al actualizar la bomba de agua en Blynk:", error);
   }
 }

 // Manejar el cambio de estado del interruptor
 automatedIrrigationSwitch.addEventListener('change', () => {
   const irrigationState = automatedIrrigationSwitch.checked ? 1 : 0;
   setAutomatedIrrigationState(irrigationState);
 });

 // Inicializar el estado del interruptor basado en los datos de Blynk
 async function initAutomatedIrrigationState() {
   const irrigationState = await getDataFromBlynk(automatedIrrigationPin);
   if (irrigationState !== null) {
    automatedIrrigationSwitch.checked = irrigationState === 1;
   }
 }

 // Llamar a la inicialización del interruptor de la bomba de agua
 initAutomatedIrrigationState();
