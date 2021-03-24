import * as express from 'express'
const app = express()
const fs = require('fs')
app.listen(3000, () => {
    console.log('Server Aktif')
})

//TYPESCRIPT

function makeid(length:number) : string {
    /** 
    @makeid(UZUNLUK)
    @Amaç Siteye Kayıt Olan kişilere özel rastgele bir kullanıcı anahtarı oluşturabilmek.
    @Örnek_Kullanım makeid(12) => Sonuç olarak 12 haneli bir Şifre/Kullanıcı Anahtarı Olarak Geri Döner
    */
    var result = ''! as string;
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'! as string;
    var charactersLength = characters.length! as number;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function resSend(status:string, message:string, res:any) : void {
    /** 
     * @Kullanım resSend(404, 'HATA', res)
     * @Amaç JSON TABANLI VERİ yollamada kolaylık sağlamak
    */
    res.send(`{
        "durum:" "${status}",
        "veri": "${message}"
    }`)
    res.end()
}

app.get('/veritaban/:key', (req:object, res:any) : void => {
    /** 
    * @amaç İnsanların DATABASE'lerin Kullanıcı Anahtarı sayesinde ulaşabilmeleri
    */
   type req = {
       params: {
           key: string
       }
   }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    res.sendFile(__dirname + '/database/' + req["params"].key + '.json')
})

app.get('/yaz/:key/:variable/:value', (req:object, res:any) : void => {
    /**
    * @amaç Veritabanına Yeni Veriler Ekleyebilmek
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    dosya[req["params"].variable] = (isNaN(req["params"].value) ? req["params"].value : Number(req["params"].value))
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2))
    res.send('Başarı ile veriler eklendi.')
    res.end()
})

app.get('/sil/:key/:variable', (req:object, res:any) : void => {
    /**
    * @amaç Veritabanından bazı verileri silebilmek
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    if (!dosya[req["params"].variable]) return resSend("404", "Böyle bir veri yok ki sileyim", res)
    delete dosya[req["params"].variable]
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2))
    res.send('Başarı ile yazdığınız veri silindi.')
    res.end()
})

app.get('/bul/:key/:variable', (req:object, res:any) : void => {
    /**
    * @amaç Veritabanından veri çekmek
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    if (!dosya[req["params"].variable]) {
        return resSend("404", "Böyle Bir Veri Bulunamadı", res)
    }
    res.send(`{
        "durum": 200,
        "veriad": "${req["params"].variable}",
        "veri": "${dosya[req["params"].variable]}"
    }`)
    res.end()
})

app.get('/topla/:key/:variable/:value', (req:object, res:any) : void => {
    /**
    * @amaç Veritabanına Bir Değere Sayı Eklemek
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    if (isNaN(req["params"].value)) return resSend("404", "Eklenecek-Çıkarılacak veri bir sayı olmalı", res)
    if (!dosya[req["params"].variable]) return resSend("404", "Böyle bir veri yok!", res)
    if (isNaN(dosya[req["params"].variable])) return resSend("404", "Ekleyeceğiniz-Çıkaracağınız değer bir sayı olmalı ki onun sayı değeri değiştirilsin.", res)
    dosya[req["params"].variable] += Number(req["params"].value)
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2))
    res.send('Başarı ile ' + req["params"].variable + ' değerine ' + req["params"].value + ' eklendi.')
    res.end()
})

app.get('/cikar/:key/:variable/:value', (req: object, res: any): void => {
    /**
    * @amaç Veritabanından Bir Değerden Sayı Çıkarmak
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    if (isNaN(req["params"].value)) return resSend("404", "Eklenecek-Çıkarılacak veri bir sayı olmalı", res)
    if (!dosya[req["params"].variable]) return resSend("404", "Böyle bir veri yok!", res)
    if (isNaN(dosya[req["params"].variable])) return resSend("404", "Ekleyeceğiniz-Çıkaracağınız değer bir sayı olmalı ki onun sayı değeri değiştirilsin.", res)
    dosya[req["params"].variable] -= (isNaN(req["params"].value) ? req["params"].value : Number(req["params"].value))
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify(dosya, null, 2))
    res.send('Başarı ile ' + req["params"].variable + ' değerinden ' + req["params"].value + ' çıkartıldı.')
    res.end()
})

app.get('/verilerisil/:key', (req: object, res: any): void => {
    /**
    * @amaç Veritabanındaki tüm verileri silme
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    fs.writeFileSync(__dirname + '/database/' + req["params"].key + '.json', JSON.stringify({}, null, 2))
    res.send(`{
        "durum": "200",
        "veri": "Tüm Veriler Başarıyla Sıfırlandı."
        `)
    res.end()
})

app.get('/has/:key/:variable', (req: object, res: any): void => {
    /**
    * @amaç Veritabanında Bir veriyi kontrol etme
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    const dosya = JSON.parse(fs.readFileSync(__dirname + '/database/' + req["params"].key + '.json', 'utf8'))
    res.send(`{
        "durum": 200,
        "veri": "${dosya[req["params"].variable] ? true : false}"
    }`)
    res.end()
})

app.get('/hepsinioku/:key', (req: object, res: any): void => {
    /**
    * @amaç Veritabanındaki değerleri bulma
    */
    type req = {
        params: {
            key: string
        }
    }
    const keys = require('./keys.json')
    if (!keys.includes(req["params"].key)) {
        res.send(`{
        "durum": "404",
        "veri": "Kullanıcı Anahtarı Bulunamadı"
        `)
        return res.end()
    }
    res.redirect('/database/' + req["params"].key)
})

app.get('/', (req : object, res : any) : void => {
    res.sendFile(__dirname + '/main.html')
})

//EJS
app.set('view engine', 'ejs');

app.get('/cikisyap', (req: object, res: any): void => {
    /**
    * @amaç IP Sıfırlamak
    */
    type req = {
        params: {
            key: string
        }
    }
    var getIP = require('ipware')().get_ip;
    const IP = getIP(req)
    let ipdata = JSON.parse(fs.readFileSync('./ip.json', 'utf8'))
    if (!ipdata.includes(IP.clientIp)) {
        return res.status(403).render('noIpFound')
    }
    ipdata = ipdata.filter(x => x !== IP.clientIp)
    fs.writeFileSync('ip.json', JSON.stringify(ipdata, null, 2))
    res.render('LogOut')
})

app.get('/yenianahtar', (req: object, res: any): void => {
    /**
    * @amaç Yeni Kullanıcı Anahtarı oluşturmak
    */
    type req = {
        params: {
            key: string
        }
    }
    var getIP = require('ipware')().get_ip;
    const IP = getIP(req)
    const ipdata = JSON.parse(fs.readFileSync('./ip.json', 'utf8'))
    if (ipdata.includes(IP.clientIp)) {
        return res.status(403).render('alreadyCreatedIP')
    }
    const read1 = require('./ip.json')
    const read2 = require('./keys.json')
    var key;
    var KEY = makeid(12)
    key = KEY
    while (read2.includes(KEY)) {
        KEY = makeid(12)
        key = KEY
    }
    read1.push(IP.clientIp)
    read2.push(key)
    fs.writeFileSync('ip.json', JSON.stringify(read1, null, 2))
    fs.writeFileSync('keys.json', JSON.stringify(read2, null, 2))
    fs.writeFile(__dirname + '/database/' + key + '.json', JSON.stringify({}, null, 2), function (err) {
        if (err) throw err;
        console.log('File is created successfully.');
        res.render('successfullyCreatedKey', { newKey: key })
    })
})

