import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuoteGenerator = () => {
    const [quoteData, setQuoteData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchQuote = async () => {
        setIsLoading(true);
        setError('');
        try {
            // API calls are proxied from /api/ to http://localhost:5000/api/
            const response = await axios.get('/api/quote');
            setQuoteData(response.data.data);
        } catch (err) {
            console.error('Fetch Quote Error:', err);
            setError('Failed to load quote. The server may be down.');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch a quote on initial load
    useEffect(() => {
        fetchQuote();
    }, []);

    return (
        <div className="p-6 bg-yellow-50 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Motivational Quote</h3>
            {isLoading && <p className="text-yellow-600">Loading new wisdom...</p>}
            {error && <p className="text-red-500 font-bold">{error}</p>}

            {!isLoading && !error && quoteData && (
                <blockquote className="border-l-4 border-yellow-400 pl-4">
                    <p className="text-xl italic text-gray-700">"{quoteData.quote}"</p>
                    <footer className="mt-2 text-right text-yellow-700">— {quoteData.author}</footer>
                </blockquote>
            )}

            <button
                onClick={fetchQuote}
                disabled={isLoading}
                className="mt-4 px-4 py-2 bg-yellow-500 text-white font-medium rounded hover:bg-yellow-600 transition duration-150 disabled:opacity-50"
            >
                {isLoading ? 'Fetching...' : 'Get New Quote'}
            </button>
        </div>
    );
};

export default QuoteGenerator;