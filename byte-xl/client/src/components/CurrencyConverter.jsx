import React, { useState } from 'react';
import axios from 'axios';

const CurrencyConverter = () => {
    const [amount, setAmount] = useState(100);
    const [conversionData, setConversionData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleConvert = async () => {
        setIsLoading(true);
        setError('');
        setConversionData(null);
        
        if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount (INR).');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get(`/api/convert?amount=${amount}`);
            setConversionData(response.data.data);
        } catch (err) {
            console.error('Fetch Currency Error:', err);
            const errMsg = err.response?.data?.error || 'Could not connect to the conversion service.';
            setError(errMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-green-50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">INR Currency Converter</h3>
            
            <div className="flex space-x-3 mb-4">
                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter INR amount"
                    className="flex-grow p-2 border border-green-300 rounded focus:ring-green-500 focus:border-green-500"
                />
                <button
                    onClick={handleConvert}
                    disabled={isLoading}
                    className="px-6 py-2 bg-green-500 text-white font-medium rounded hover:bg-green-600 transition duration-150 disabled:opacity-50"
                >
                    {isLoading ? 'Converting...' : 'Convert'}
                </button>
            </div>

            {error && <p className="text-red-500 font-bold mb-4">{error}</p>}
            
            {conversionData && (
                <div className="space-y-3 p-4 bg-white border border-green-200 rounded">
                    <p className="text-lg font-medium">🇮🇳 INR: <span className="text-xl font-bold">{conversionData.converted_amount_inr}</span></p>
                    <p className="text-lg">🇺🇸 USD: <span className="font-bold text-green-700">${conversionData.converted_to_usd}</span></p>
                    <p className="text-lg">🇪🇺 EUR: <span className="font-bold text-green-700">€{conversionData.converted_to_eur}</span></p>
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;