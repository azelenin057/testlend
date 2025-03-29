const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

app.post('/api/submit-order', async (req, res) => {
    const { formData, formId, testAnswers } = req.body;
    const apiUrl = 'https://ecohealth-crm.voiptime.app/api/v2/admin/order';
    const adminToken = process.env.ADMIN_TOKEN || 'qTrnYsKRx7TL';

    try {
        let phone = formData.phone;
        let comment = '';
        if (formId === 'modal-order-form' && testAnswers.length > 0) {
            comment = testAnswers.map(answer => `${answer.question} - ${answer.answer}`).join('\n');
        }

        const requestId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': adminToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                full_name: formData.full_name,
                phone: phone,
                shop_id: 4,
                project_id: 2,
                price: 0,
                status_id: 1,
                cart: [{ good_id: 26, quantity: 1 }],
                comment: comment,
                requestId: requestId
            })
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));