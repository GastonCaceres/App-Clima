import React, { useState, useEffect } from "react";
import "./App.css";


function App() {

  // Estado para guardar las provincias y sus ciudades capitales
  const [provincias, setProvincias] = useState<
    { provincia: string; ciudadCapital: string }[]
  >([]);

  // useEffect para obtener las provincias y sus capitales
  useEffect(() => {
    const obtenerProvincias = async () => {
      try {
        // Llamado a la API 
        const respuesta = await fetch(
          "https://secure.geonames.org/searchJSON?country=AR&featureCode=PPLA&maxRows=1000&username=gastoncaceres"
        );
        const data = await respuesta.json();

        // Se mapea la respuesta para extraer la provincia y su ciudad capital
        const provincias = data.geonames.map((item: any) => ({
          provincia: item.adminName1,
          ciudadCapital: item.name,
        }));

        // Se actualiza el estado con los datos obtenidos
        setProvincias(provincias);

      } catch (error) {
        console.error("Error al obtener las provincias:", error);
      }
    };

    obtenerProvincias();
  }, []); // Solo se ejecuta una vez al principio


  // Estado para guardar la provincia seleccionada en el <select>
  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState<string>("");

  // Estado para guardar los datos del clima de la ciudad capital seleccionada
  const [datosClima, setDatosClima] = useState<null | {
    temperature: number;
    description: string;
    icon: string;
  }>(null);

  // useEffect que se ejecuta cada vez que cambia la provincia seleccionada
  useEffect(() => {
    if (!provinciaSeleccionada) {
      // Si se borra la selección, se limpian los datos del clima
      setDatosClima(null);
      return;
    }

    const obtenerClima = async () => {
      const apiKey = process.env.REACT_APP_OPENWEATHER_KEY;

      // Consulta a OpenWeatherMap para obtener el clima de la ciudad capital
      const respuesta = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${provinciaSeleccionada},AR&appid=${apiKey}&units=metric&lang=es`
      );
      const data = await respuesta.json();

      // Se extraen los datos que se van a mostrar
      const datosClima = {
        temperature: data.main.temp,
        description: data.weather[0].description,
        icon: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      };

      // Se actualiza el estado con la información del clima
      setDatosClima(datosClima);
    };

    obtenerClima();
  }, [provinciaSeleccionada]);



  // Renderizado del componente
  return (
    <div className="App-Header">

      <h1 className="Glass-Tittle">Selecciona una provincia</h1>

      {/* Menú desplegable */}
      <select
        className="Select-Provincia"
        value={provinciaSeleccionada}
        onChange={(e) => setProvinciaSeleccionada(e.target.value)}
      >
        <option value=""> Selecciona una provincia </option>

        {/* Opciones ordenadas alfabéticamente */}
        {provincias
          .sort((a, b) => a.provincia.localeCompare(b.provincia))
          .map((item, index) => (
            <option key={index} value={item.ciudadCapital}>
              {item.provincia} - {item.ciudadCapital}
            </option>
          ))}
      </select>

      {/* Si hay una provincia seleccionada y datos del clima, se muestra la info */}
      {provinciaSeleccionada && datosClima && (
        <div className="Glass-Tittle">
          <h2>Clima en {provinciaSeleccionada}</h2>

          <p>Temperatura: {datosClima.temperature}°C</p>

          <p>
            Descripción:{" "}
            {
              // Capitaliza solo la primera letra de la descripción
              datosClima.description.charAt(0).toUpperCase() +
              datosClima.description.slice(1)
            }

            {/* Ícono representando el estado del clima */}
            <img src={datosClima.icon} alt="Icono del clima" />
          </p>
        </div>
      )}
    </div>
  );
}

// Exportación del componente para ser usado por React
export default App;
