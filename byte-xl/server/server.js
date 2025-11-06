// Load environment variables from .env file
// **This line is essential for loading the API keys and city!**
require('dotenv').config(); 

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MOCK QUOTE DATA (kept local as per original plan) ---
const MOCK_QUOTES = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { quote: "The mind is everything. What you think you become.", author: "Buddha" },
    { quote: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
];

// --- 1. Quote Generator Endpoint (/api/quote) ---
app.get('/api/quote', async (req, res) => {
    try {
        const randomIndex = Math.floor(Math.random() * MOCK_QUOTES.length);
        const data = MOCK_QUOTES[randomIndex];
        res.json({ data });
    } catch (error) {
        console.error('Quote API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch quote from the server.' });
    }
});

// --- 2. Weather Display Endpoint (/api/weather) ---
app.get('/api/weather', async (req, res) => {
    const API_KEY = process.env.WEATHER_API_KEY;
    const CITY = process.env.HARDCODED_CITY; // Reads 'Hyderabad'
    
    // Check if the key is available
    if (!API_KEY || !CITY) {
        return res.status(500).json({ error: 'Server configuration error: Weather API Key or City is missing.' });
    }
    
    // OpenWeatherMap API URL (using 'q' for city name and 'units=metric')
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`;

    try {
        const response = await axios.get(URL);
        
        // Simplify and extract necessary fields
        const data = {
            city: response.data.name,
            temperature: `${Math.round(response.data.main.temp)}°C`, 
            condition: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
        };
        res.json({ data });
    } catch (error) {
        console.error('Weather API Error:', error.message);
        // Return a generic error on failure
        res.status(500).json({ error: `Failed to fetch weather data for ${CITY}. Check API key and city spelling.` });
    }
});

// --- 3. Currency Converter Endpoint (/api/convert) ---
// Accepts query params: /api/convert?amount=100
app.get('/api/convert', async (req, res) => {
    const API_KEY = process.env.CURRENCY_API_KEY;
    const { amount } = req.query; // INR amount to convert
    
    if (!amount || isNaN(parseFloat(amount))) {
        return res.status(400).json({ error: 'Invalid or missing "amount" query parameter.' });
    }
    if (!API_KEY) {
        return res.status(500).json({ error: 'Server configuration error: Currency API Key is missing.' });
    }

    // ExchangeRate-API free tier often uses USD as a base. 
    const BASE_CURRENCY = 'USD';
    // Using the V6 endpoint structure
    const URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}&base_currency=INR&currencies=USD,EUR`;

    try {
        const response = await axios.get(URL);
        const rates = response.data.conversion_rates;
        
        if (!rates || !rates.INR || !rates.EUR) {
             throw new Error("Missing rate data (INR or EUR) from external API.");
        }
        
        // Logic to convert from INR to USD/EUR using the USD base rates
        const INR_per_USD = rates.INR; 
        const USD_per_INR = 1 / INR_per_USD; 
        const EUR_per_USD = rates.EUR;
        const EUR_per_INR = EUR_per_USD / INR_per_USD;

        const convertedAmount = parseFloat(amount);

        const data = {
            converted_amount_inr: convertedAmount.toFixed(2),
            converted_to_usd: (convertedAmount * USD_per_INR).toFixed(2),
            converted_to_eur: (convertedAmount * EUR_per_INR).toFixed(2),
            base_rate_usd_to_inr: INR_per_USD.toFixed(4)
        };

        res.json({ data });
    } catch (error) {
        console.error('Currency API Error:', error.message);
        res.status(500).json({ error: 'Failed to fetch currency rates. Check API key and external service status.' });
    }
});

// --- Server Start ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Weather target set to: ${process.env.HARDCODED_CITY}`);
});