import React, { useState, useEffect } from 'react';
import Timezone from './timezone';
import Loader from './loader';
import 'bootstrap/dist/css/bootstrap.min.css';
import './weather.css';
const Weather = ()=> {
    const [city, setCity] = useState("hisar");
    const [search, setSearch] = useState("hisar");
    useEffect(() => {
        const fetchApi = async () =>{
            const url = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=0338409921a1c1c559e930b80c50409a`;
            let response = await fetch(url);
            let jsonData = await response.json();
            console.log(jsonData);
            setCity(jsonData);
        }
        fetchApi(); 
    }, [search]);
    let ico="http://openweathermap.org/img/wn/";
    return (
        <div className="main">
                <div className="d-flex ml-1">  
                    <input type="search" placeholder="Search City" 
                className="mt-2 ml-3 sea col-10 col-sm-10 col-md-11 col-lg-11 col-xl-11"  
                    onChange={
                        (e)=>{
                            setSearch(e.target.value);
                        }
                    }
                    />
                    <i className="fas fa-search col-1 mt-3 mr-0"/>    
                </div>
           { 
               (!city.wind) ? (
                   <div className="minHeight flex-box flex-column">
                    <Loader/><br/>
                    <b>Enter City</b>
                    </div>
                    ) : 
               ( <>                
                <div>
                <div className="mt-3 ml-3 d-flex justify-content-center">
                    <b className="s1">{city.name}, {city.sys.country }</b>
                    <Timezone name={city.timezone}/>
                          
                </div>
                <div className="flex-box">
                    <div className="mt-4 temp">
                        <div className="flex-column ml-3 mt-3">
                            <h2>{city.main.temp} °C</h2>
                            <p className="text-capitalize">{city.weather[0].description}</p>
                        </div>
                        
                        
                        {
                            !(ico=ico+ `${city.weather[0].icon}` + "@2x.png") ? 
                            null: <img src={ico} alt="img"/>
                        }
                        
                    </div>
                </div>
                <p className="mt-4 ml-3 text-capitalize s2">
                    <hr/>
                    <span>Feels:</span> {city.main.feels_like} °C<br/>
                    <span>Min Temp:</span> {city.main.temp_min} °C<br/>
                    <span>Max Temp:</span> {city.main.temp_max} °C <hr/>
                </p>
                <p className="mt-4 ml-3 s3">
                <span>Wind:</span> {city.wind.speed} m/s<br/>
                <span>Pressure:</span> {city.main.pressure} hPa<br/>
                <span>Humidity:</span> {city.main.humidity} %<br/>
                </p>
            </div>  
            </>
               )
           } 
            
        </div>
        
    )
            
}
export default Weather;