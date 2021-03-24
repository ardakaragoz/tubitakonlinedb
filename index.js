"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var fs = require('fs');
app.listen(3000, function () {
    console.log('Server Aktif');
});
function makeid(length) {
    /**
    @makeid(UZUNLUK)
    @Amaç Siteye Kayıt Olan kişilere özel rastgele bir kullanıcı anahtarı oluşturabilmek.
    @Örnek_Kullanım makeid(12) => Sonuç olarak 12 haneli bir Şifre/Kullanıcı Anahtarı Olarak Geri Döner
    */
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
function resSend(status, message, res) {
    /**
     * @Kullanım resSend(404, 'HATA', res)
     * @Amaç JSON TABANLI VERİ yollamada kolaylık sağlamak
    */
    res.send("{\n        \"durum:\" \"" + status + "\",\n        \"veri\": \"" + message + "\"\n    }");
    res.end();
}
app.get('/veritaban/:key', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    res.sendFile(__dirname + '/database/' + req["params"].key + '.json');
});
app.get('/yaz/:key/:variable/:value', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    dosya[req["params"].variable] = (isNaN(req["params"].value) ? req["params"].value : Number(req["params"].value));
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2));
    res.send('Başarı ile veriler eklendi.');
    res.end();
});
app.get('/sil/:key/:variable', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    if (!dosya[req["params"].variable])
        return resSend("404", "Böyle bir veri yok ki sileyim", res);
    delete dosya[req["params"].variable];
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2));
    res.send('Başarı ile yazdığınız veri silindi.');
    res.end();
});
app.get('/bul/:key/:variable', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    if (!dosya[req["params"].variable]) {
        return resSend("404", "Böyle Bir Veri Bulunamadı", res);
    }
    res.send("{\n        \"durum\": 200,\n        \"veriad\": \"" + req["params"].variable + "\",\n        \"veri\": \"" + dosya[req["params"].variable] + "\"\n    }");
    res.end();
});
app.get('/topla/:key/:variable/:value', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    if (isNaN(req["params"].value))
        return resSend("404", "Eklenecek-Çıkarılacak veri bir sayı olmalı", res);
    if (!dosya[req["params"].variable])
        return resSend("404", "Böyle bir veri yok!", res);
    if (isNaN(dosya[req["params"].variable]))
        return resSend("404", "Ekleyeceğiniz-Çıkaracağınız değer bir sayı olmalı ki onun sayı değeri değiştirilsin.", res);
    dosya[req["params"].variable] += Number(req["params"].value);
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2));
    res.send('Başarı ile ' + req["params"].variable + ' değerine ' + req["params"].value + ' eklendi.');
    res.end();
});
app.get('/cikar/:key/:variable/:value', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    if (isNaN(req["params"].value))
        return resSend("404", "Eklenecek-Çıkarılacak veri bir sayı olmalı", res);
    if (!dosya[req["params"].variable])
        return resSend("404", "Böyle bir veri yok!", res);
    if (isNaN(dosya[req["params"].variable]))
        return resSend("404", "Ekleyeceğiniz-Çıkaracağınız değer bir sayı olmalı ki onun sayı değeri değiştirilsin.", res);
    dosya[req["params"].variable] -= (isNaN(req["params"].value) ? req["params"].value : Number(req["params"].value));
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2));
    res.send('Başarı ile ' + req["params"].variable + ' değerinden ' + req["params"].value + ' çıkartıldı.');
    res.end();
});
app.get('/verilerisil/:key', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify({}, null, 2));
    res.send("{\n        \"durum\": \"200\",\n        \"veri\": \"T\u00FCm Veriler Ba\u015Far\u0131yla S\u0131f\u0131rland\u0131.\"\n        ");
    res.end();
});
app.get('/has/:key/:variable', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    var dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'));
    res.send("{\n        \"durum\": 200,\n        \"veri\": \"" + (dosya[req["params"].variable] ? true : false) + "\"\n    }");
    res.end();
});
app.get('/hepsinioku/:key', function (req, res) {
    var keys = require('./keys.json');
    if (!keys.includes(req["params"].key)) {
        res.send("{\n        \"durum\": \"404\",\n        \"veri\": \"Kullan\u0131c\u0131 Anahtar\u0131 Bulunamad\u0131\"\n        ");
        return res.end();
    }
    res.redirect('/database/' + req["params"].key);
});
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/main.html');
});
//EJS
app.set('view engine', 'ejs');
app.get('/cikisyap', function (req, res) {
    var getIP = require('ipware')().get_ip;
    var IP = getIP(req);
    var ipdata = JSON.parse(fs.readFileSync('./ip.json', 'utf8'));
    if (!ipdata.includes(IP.clientIp)) {
        return res.status(403).render('noIpFound');
    }
    ipdata = ipdata.filter(function (x) { return x !== IP.clientIp; });
    fs.writeFileSync('ip.json', JSON.stringify(ipdata, null, 2));
    res.render('LogOut');
});
app.get('/yenianahtar', function (req, res) {
    var getIP = require('ipware')().get_ip;
    var IP = getIP(req);
    var ipdata = JSON.parse(fs.readFileSync('./ip.json', 'utf8'));
    if (ipdata.includes(IP.clientIp)) {
        return res.status(403).render('alreadyCreatedIP');
    }
    var read1 = require('./ip.json');
    var read2 = require('./keys.json');
    var key;
    var KEY = makeid(12);
    key = KEY;
    while (read2.includes(KEY)) {
        KEY = makeid(12);
        key = KEY;
    }
    read1.push(IP.clientIp);
    read2.push(key);
    fs.writeFileSync('ip.json', JSON.stringify(read1, null, 2));
    fs.writeFileSync('keys.json', JSON.stringify(read2, null, 2));
    fs.writeFile(__dirname + '/database/' + key + '.json', JSON.stringify({}, null, 2), function (err) {
        if (err)
            throw err;
        console.log('File is created successfully.');
        res.render('successfullyCreatedKey', { newKey: key });
    });
});
