const express = require('express');

(async () => {
    // Dynamically import fetch
    const { default: fetch } = await import('node-fetch');

    const app = express();
    const PORT = process.env.PORT || 3000;

    app.use(express.json());

    app.post('/proxy/roblox', async (req, res) => {
        const { userIds } = req.body;

        try {
            const response = await fetch('https://presence.roblox.com/v1/presence/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userIds })
            });
            const data = await response.json();
            res.json(data);
        } catch (error) {
            res.status(500).send('Error fetching data');
        }
    });

    app.listen(PORT, () => {
        console.log(`Proxy server running on port ${PORT}`);
    });

    app.get('/', (req, res) => {
        res.send('Server is running');
    });

})();
