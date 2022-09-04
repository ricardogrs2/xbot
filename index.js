const qrcode = require('qrcode-terminal');
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const router = express();
const client = new Client({
    authStrategy: new LocalAuth()
});
const port = 3000;
const app = express(); 
client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

router.get("/validacel", async (req, res, next) => {
    let chatId = req.query.numero;
    var result = await client.isRegisteredUser(chatId + '@c.us');
    if (!result) {
	    return res.json(result);
    }
    return res.json(result);

});

router.listen(port, () => {
        console.log(`Api started at the port: ${port}`);
});
