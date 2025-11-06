import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherModule = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchWeather = async () => {
            setIsLoading(true);
            setError('');
            try {
                const response = await axios.get('/api/weather');
                setWeatherData(response.data.data);
            } catch (err) {
                console.error('Fetch Weather Error:', err);
                // Check for a server-side custom error message
                const errMsg = err.response?.data?.error || 'Could not connect to the weather service.';
                setError(errMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div className="p-6 bg-blue-50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Real-Time Weather</h3>
            {isLoading && <p className="text-blue-600">Loading weather data...</p>}
            {error && <p className="text-red-500 font-bold">{error}</p>}

            {!isLoading && !error && weatherData && (
                <div className="flex items-center space-x-4">
                    {/* Placeholder for icon - you could integrate OpenWeatherMap icons */}
                    <div className="text-5xl text-blue-500">
                        {/* Simple emoji representation of conditions */}
                        {weatherData.condition.includes('cloud') ? '☁️' : weatherData.condition.includes('rain') ? '🌧️' : '☀️'}
                    </div>
                    <div>
                        <p className="text-4xl font-bold text-blue-700">{weatherData.temperature}</p>
                        <p className="text-lg text-gray-600">{weatherData.condition}</p>
                        <p className="text-sm text-gray-500">in {weatherData.city}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeatherModule;