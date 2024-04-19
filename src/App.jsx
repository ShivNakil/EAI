import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
    const [stocks, setStocks] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStockData = async () => {
            try {
                const response = await axios.get(`/api/stock/${inputValue}`);
                const updatedStocks = stocks.map(stock =>
                    stock.symbol === response.data.symbol ? { ...stock, price: response.data.price } : stock
                );
                setStocks(updatedStocks);
            } catch (error) {
                setError('Stock not found');
            }
        };

        const interval = setInterval(() => {
            fetchStockData();
        }, 1000);

        return () => clearInterval(interval);
    }, [inputValue]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (inputValue.trim() === '') {
            setError('Please enter a stock symbol');
            return;
        }
        setInputValue(inputValue.toUpperCase());
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter stock symbol"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button type="submit">Fetch Stock</button>
            </form>
            {error && <p>{error}</p>}
            <ul>
                {stocks.map((stock, index) => (
                    <li key={index}>
                        <strong>{stock.symbol}</strong>: ${stock.price}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;
