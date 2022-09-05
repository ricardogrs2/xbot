const qrcode = require('qrcode-terminal');
const express = require('express');
const { Client, LocalAuth } = require('whatsapp-web.js');
const router = express();
function apenasNumeros(str) {
    str = typeof str.toString();
    return str.replace(/\D+/g, "");
}
//
function soNumeros(string) {
    var numsStr = String(string).replace(/\D+/g, "");
    return parseInt(numsStr);
}
const client = new Client({
    authStrategy: new LocalAuth()
});
const port = 3000;
const app = express();
var clientQrcode;
client.on('qr', qr => {
    clientQrcode = qr;
    qrcode.generate(qr, {small: true});
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.initialize();

router.post('/send-message', async (req, res) => {
  console.log(req);
  const number = req.body.number;
  const message = req.body.message;
  const numberDDI = number.substr(0, 2);
  const numberDDD = number.substr(2, 2);
  const numberUser = number.substr(-8, 8);

  if (numberDDI !== "55") {
    const numberZDG = number + "@c.us";
    client.sendMessage(numberZDG, message).then(response => {
    res.status(200).json({
      status: true,
      message: 'BOT-ZDG Mensagem enviada',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'BOT-ZDG Mensagem não enviada',
      response: err.text
    });
    });
  }
  else if (numberDDI === "55" && parseInt(numberDDD) <= 30) {
    const numberZDG = "55" + numberDDD + "9" + numberUser + "@c.us";
    client.sendMessage(numberZDG, message).then(response => {
    res.status(200).json({
      status: true,
      message: 'BOT-ZDG Mensagem enviada',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'BOT-ZDG Mensagem não enviada',
      response: err.text
    });
    });
  }
  else if (numberDDI === "55" && parseInt(numberDDD) > 30) {
    const numberZDG = "55" + numberDDD + numberUser + "@c.us";
    client.sendMessage(numberZDG, message).then(response => {
    res.status(200).json({
      status: true,
      message: 'BOT-ZDG Mensagem enviada',
      response: response
    });
    }).catch(err => {
    res.status(500).json({
      status: false,
      message: 'BOT-ZDG Mensagem não enviada',
      response: err.text
    });
    });
  }
});

router.get("/validacel", async (req, res, next) => {
    let chatId = req.query.numero;
    var result = await client.isRegisteredUser(chatId + '@c.us');
    if (!result) {
	    return res.json(result);
    }
    return res.json(result);

});
router.get("/status", async (req, res, next) => {
    var result = await client.getState();
    if (!result) {
            return res.json(result);
    }
    return res.json(result);

});
router.get("/qrcode", async (req, res, next) => {
    var result = await client.getState();
    if (!result) {
	res.json("QRCODENAOEXPORTADO");
    }
	res.json("QRCODELIDO");
});

router.listen(port, () => {
        console.log(`Api started at the port: ${port}`);
});
