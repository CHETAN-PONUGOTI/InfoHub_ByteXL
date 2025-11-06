import React, { useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';
// NOTE: Ensure your main CSS file is imported in main.jsx

const App = () => {
    const [activeTab, setActiveTab] = useState('weather'); 

    const renderModule = () => {
        switch (activeTab) {
            case 'weather':
                return <WeatherModule />;
            case 'currency':
                return <CurrencyConverter />;
            case 'quote':
                return <QuoteGenerator />;
            default:
                return <WeatherModule />;
        }
    };

    const tabs = [
        { id: 'weather', name: 'Weather' },
        { id: 'currency', name: 'Converter' },
        { id: 'quote', name: 'Quotes' },
    ];

    return (
        <div className="app-container"> {/* Main content container */}
            <header className="app-header">
                <h1 className="app-title">🌐 InfoHub SPA</h1>
                <p className="app-subtitle">A unified platform for daily utilities.</p>
            </header>

            <div className="tab-navigation">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="module-container">
                {renderModule()}
            </div>

            <footer className="app-subtitle" style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.8rem' }}>
                Built to demonstrate React, Node.js/Express, and External API Integration.
            </footer>
        </div>
    );
};

export default App;