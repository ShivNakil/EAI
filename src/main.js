import express from 'express';
import fs from 'fs';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3001;

const stocksDataFile = 'stocksData.json';

// Function to fetch stock data from Polygon API
async function fetchStockData() {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'INTC', 'AMD', 'PYPL', 'NFLX', 'ADBE', 'CRM', 'CSCO', 'TSM', 'BABA', 'ASML', 'CMCSA', 'SAP', 'ORCL']; // Example symbols
    const apiKey = 'eU4vVUHI2NFJzXfoyJnPC2uwTr8ltqhp'; // Replace with your actual API key

    let stocksData = [];

    // Divide symbols into batches of 5
    const symbolBatches = [];
    for (let i = 0; i < symbols.length; i += 5) {
        symbolBatches.push(symbols.slice(i, i + 5));
    }

    // Iterate over symbol batches
    for (const batch of symbolBatches) {
        // Iterate over symbols in the batch
        for (const symbol of batch) {
            try {
                const response = await axios.get(`https://api.polygon.io/v1/open-close/${symbol}/2023-01-09?adjusted=true&apiKey=${apiKey}`);

                if (response.status === 200 && response.data && response.data.status === 'OK') {
                    const { open, close } = response.data;
                    stocksData.push({ symbol, open, close });
                } else {
                    console.error(`Error fetching data for ${symbol}:`, response.status);
                }
            } catch (error) {
                console.error(`Error fetching data for ${symbol}:`, error.message);
            }

            // Wait for 15 seconds before making the next request
            await new Promise(resolve => setTimeout(resolve, 15000));
        }
    }

    return stocksData;
}







// Function to update stock prices randomly
function updateStockPrices(stockData) {
    stockData.forEach(stock => {
        setInterval(() => {
            stock.price = stock.openPrice + (Math.random() * 10 - 5); // Random price update
        }, stock.refreshInterval * 1000);
    });
}

(async () => {
    // Initialize stocks data
    let stocksData = await fetchStockData();
    stocksData.forEach(stock => {
        stock.refreshInterval = Math.floor(Math.random() * 5) + 1; // Random refresh interval
    });
    updateStockPrices(stocksData);

    // Save stocks data to file
    fs.writeFile(stocksDataFile, JSON.stringify(stocksData), (err) => {
        if (err) {
            console.error('Error saving stocks data to file:', err);
        } else {
            console.log('Stocks data saved to file');
        }
    });

    // API endpoint to fetch stock prices
    app.get('/api/stock/:symbol', (req, res) => {
        const symbol = req.params.symbol.toUpperCase();
        const stock = stocksData.find(stock => stock.symbol === symbol);
        if (stock) {
            res.json({ symbol: stock.symbol, price: stock.price });
        } else {
            res.status(404).json({ error: 'Stock not found' });
        }
    });

    // Start the server
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})();
