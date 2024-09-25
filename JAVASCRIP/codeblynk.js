 // Tu Auth Token de Blynk
 const authToken = "soFrN_So6dtxBMZXSHFq6JuXH7vjKAwA";
 const apiUrl = `https://blynk.cloud/external/api/get?token=${authToken}`;

 // Pines virtuales de Blynk
 const moisturePin = "V0";    // Pin para la humedad del suelo
 const temperaturePin = "V2"; // Pin para la temperatura
 const humidityPin = "V3";    // Pin para la humedad del aire

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
         legend: { display: true },  // Sin leyenda
         tooltip: { enabled: true}  // Deshabilitar tooltip
       },
       cutout: '70%' // Para dejar espacio en el centro
     }
   });
 }

 // Crear gráficos y actualizar con datos de Blynk
 async function updateMoistureChart() {
   const moisture = await getDataFromBlynk(moisturePin);
   if (moisture !== null) {
     const ctx = document.getElementById('moistureChart').getContext('2d');
     createDoughnutChart(ctx, moisture, '#4caf50');  // Verde para humedad del suelo
     document.getElementById('moistureValue').innerText = moisture;  // Mostrar el valor de humedad
   }
 }

 async function updateTemperatureChart() {
   const temperature = await getDataFromBlynk(temperaturePin);
   if (temperature !== null) {
     const ctx = document.getElementById('temperatureChart').getContext('2d');
     createDoughnutChart(ctx, temperature, '#f44336');  // Rojo para temperatura
     document.getElementById('temperatureValue').innerText = temperature;  // Mostrar el valor de temperatura
   }
 }

 async function updateHumidityChart() {
   const humidity = await getDataFromBlynk(humidityPin);
   if (humidity !== null) {
     const ctx = document.getElementById('humidityChart').getContext('2d');
     createDoughnutChart(ctx, humidity, '#ffeb3b');  // Amarillo para humedad del aire
     document.getElementById('humidityValue').innerText = humidity;  // Mostrar el valor de humedad del aire
   }
 }

 // Actualizar los gráficos cada 10 segundos
 setInterval(() => {
   updateMoistureChart();
   updateTemperatureChart();
   updateHumidityChart();
 }, 100);

 // Llamar a las funciones al cargar la página
 updateMoistureChart();
 updateTemperatureChart();
 updateHumidityChart();