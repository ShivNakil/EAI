const axios = require('axios');

// Function to fetch stock data from Polygon API
async function fetchStockData() {
    try {
        // Replace 'YOUR_API_KEY' with your actual Polygon API key
        const apiKey = 'eU4vVUHI2NFJzXfoyJnPC2uwTr8ltqhp';
        const response = await axios.get(`https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${apiKey}&limit=20`);

        if (response.data && response.data.tickers) {
            // Extract relevant data from the response
            const stocks = response.data.tickers.map(ticker => ({
                symbol: ticker.ticker,
                openPrice: ticker.day.open,
                refreshInterval: Math.floor(Math.random() * 5) + 1 // Random refresh interval
            }));
            
            return stocks;
        } else {
            console.error('Error fetching stock data from Polygon API');
            return [];
        }
    } catch (error) {
        console.error('Error fetching stock data:', error.message);
        return [];
    }
}

module.exports = fetchStockData;
