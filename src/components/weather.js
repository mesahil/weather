import React, { useState, useEffect } from "react";
import Timezone from "./timezone";
import Loader from "./loader";
import "bootstrap/dist/css/bootstrap.min.css";
import "./weather.css";

//component starts here

const Weather = (prop) => {
  //states
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("Hisar");
  const [data, setData] = useState([]);

  //functions
  const datahandler = (cityData) => {
    setSearch(cityData.name);
    hide(true);
    getData(cityData.coord.lat, cityData.coord.lon);
  };
  const getDefaultData = async (city = "Hisar") => {
    let response = await fetch(
      `${process.env.REACT_APP_URL}q=${city}&units=metric&appid=${process.env.REACT_APP_API_ID}`
    );
    let jsonData = await response.json();
    setCity(jsonData);
  };
  const getData = async (lat, lon) => {
    let response = await fetch(
      `${process.env.REACT_APP_URL}lat=${lat}&lon=${lon}&units=metric&appid=${process.env.REACT_APP_API_ID}`
    );
    let jsonData = await response.json();
    setCity(jsonData);
  };
  useEffect(() => {
    getDefaultData();
  }, []);

  //Geolocation api functions
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      alert("Location not supported!!");
    }
  }
  async function success(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    getData(lat, lon);
  }

  function error() {
    alert("Could not get location!");
  }

  //Geolocation api functions ends here

  //Search Dropdown funcitons
  const resultBox = document.getElementById("searchResults");
  const hide = (value) => {
    if (resultBox != null) {
      if (value === true) {
        resultBox.classList.remove("d-block");
        resultBox.classList.add("d-none");
      } else if (value === false) {
        resultBox.classList.remove("d-none");
        resultBox.classList.add("d-block");
      }
    }
  };
  const blurhandle = () => {
    const interval = setInterval(() => {
      hide(true);
      clearInterval(interval);
    }, 500);
  };

  useEffect(() => {
    let timer;
    timer = setTimeout(() => {
      const getSearchedData = async () => {
        try {
          if (search) {
            let response = await fetch(`${process.env.REACT_APP_API}${search}`);
            let jsonData = await response.json();
            setData(jsonData);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      getSearchedData();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [search]);

  //Search Dropdown funcitons ends here

  let ico = "https://openweathermap.org/img/wn/";

  return (
    <div className="main">
      <div className="d-flex ml-1">
        {/* icon and input field */}
        <i
          className="fa fa-location-arrow mt-3 ml-3"
          style={{ cursor: "pointer" }}
          onClick={getLocation}
        />
        <input
          type="search"
          placeholder="Search City"
          className="mt-2 ml-3 sea col-9 col-sm-9 col-lg-11"
          onFocus={() => hide(false)}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={() => {
            blurhandle();
          }}
          value={search}
        />
        <i className="fas fa-search col-1 mt-3 mr-0" />
      </div>
      <div className=" ml-5 col-9 col-sm-9 col-lg-11" id="searchResults">
        {!search ? null : (
          <ul className=" border-1">
            {data?.map((item) => (
              <li key={item.id} onClick={() => datahandler(item)}>
                {item.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* icon and input field ends here*/}

      {/* Weather information starts here */}
      {!city.wind ? (
        <div className="minHeight flex-box flex-column">
          <Loader />
          <br />
          <b>Enter City</b>
        </div>
      ) : (
        <>
          <div>
            <div className="mt-3 ml-3 d-flex justify-content-center">
              <b className="s1">
                {city.name}, {city.sys.country}
              </b>
              <Timezone name={city.timezone} />
            </div>
            <div className="flex-box">
              <div className="mt-4 temp">
                <div className="flex-column ml-3 mt-3">
                  <h2>{city.main.temp} °C</h2>
                  <p className="text-capitalize">
                    {city.weather[0].description}
                  </p>
                </div>

                {!(ico = `${ico}${city.weather[0].icon}@2x.png`) ? null : (
                  <img src={ico} alt="img" />
                )}
              </div>
            </div>
            <hr />
            <p className="mt-4 ml-3 text-capitalize s2">
              <span>Feels:</span> {city.main.feels_like} °C
              <br />
              <span>Min Temp:</span> {city.main.temp_min} °C
              <br />
              <span>Max Temp:</span> {city.main.temp_max} °C
            </p>
            <hr />
            <p className="mt-4 ml-3 s3">
              <span>Wind:</span> {city.wind.speed} m/s
              <br />
              <span>Pressure:</span> {city.main.pressure} hPa
              <br />
              <span>Humidity:</span> {city.main.humidity} %<br />
            </p>
          </div>
        </>
      )}
    </div>
  );
};
export default Weather;
