// const axios = require('axios');
// const dotenv = require('dotenv');
// dotenv.config();

// module.exports.chatgptResponse = async (req, res) => {
//     const { prompt } = req.body;
//     if (!prompt) {
//         return res.status(400).send({ error: 'Prompt is required' });
//     }
//     try {
//         const response = await axios.post(
//             'https://api.openai.com/v1/chat/completions',
//             {
//                 model: 'gpt-3.5-turbo',  // You can use 'gpt-3.5-turbo' or other available models
//                 messages: [{ role: 'user', content: prompt }],
//             },
//             {
//                 headers: {
//                     'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//                     'Content-Type': 'application/json',
//                 },
//             }
//         );

//         const message = response.data.choices[0].message.content;
//         res.send({ message });
//     } catch (error) {
//         console.error('Error communicating with OpenAI:', error);
//         res.status(500).send({ error: 'Error communicating with OpenAI' });
//     }
// }