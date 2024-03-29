var express = require('express')
var app = express()
var fs = require('fs')
var path = require('path')
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
mongoose.Promise = global.Promise
const Schema = mongoose.Schema;
const AlexaSchema = new Schema({
	id: { type: String, unique: true },
	alexa: String,
    transkript: String,
    dialekt: String,
	body: Object
});
const Alexa = mongoose.model('Alexa', AlexaSchema);
const folder = '../scrape/utterances';
const files = fs.readdirSync(folder)
.filter((file) => {
  return path.extname(file) === '.wave'
})
.map((file) => {
    return file.slice(0,-5)
})
app.use('/files', express.static(folder))
app.get('/', function (req, res) {
  Promise.all(files.map((file) => {
        return Alexa.findOne({id: file})
        .then((obj) => {
            return Promise.resolve({
                id: file,
                alexa: (obj || {}).alexa
            })
        })
        .then((obj) => {
            const id = obj.id.split('#').join('%23');
            return Promise.resolve(`
                <div>
                    <h1>${obj.id}</h1>
                    <audio controls>
                        <source src="/files/${id}.wave" type="audio/wave">
                    </audio>
                    <h2>was verstanden wurde</h2>
                    <p>${obj.alexa}</p>
                    <h2>transkript</h2>
                    <input id=${id} type='text' />
                    <a href="javascript: submitform.bind(this, '${id}')()">update</a>
                    <h2>dialekt</h2>
                    <input id=${id+'dia'} type='text' />
                    <a href="javascript: submitform.bind(this, '${id+'dia'}', 'dialekt')()">update</a>
                </div>
            `)
        })
    }))
    .then((htmlArray) => {
        return Promise.resolve(htmlArray.join(''));
    })
    .then((html) => {
        res.send(`
            <!DOCTYPE HTML>
            <html>
                <head>
                    <script>
                        function submitform(id, dia) {
                            id = id.split('#').join('%23')
                            let type = 'transkript'
                            if(dia) {
                                type = 'dialekt'
                            }
                            fetch("/update/" + id, {
                            method: "POST",
                            headers: {
                                'Accept': 'application/json, text/plain, */*',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                [type]: document.getElementById(id).value
                            })
                            });
                        }
                    </script>
                </head>
                <body>${html}</body>
            </html>
        `)
    })
})

app.post('/update/:id', jsonParser, function(req, res) {
    let type = 'transkript'
    let value = req.body.transkript
    if(req.body.dialekt) {
        type = 'dialekt'
        value = req.body.dialekt
    }

    let id = req.params.id
    if(id.endsWith("dia")) {
        id = id.substring(0, id.length -3)
    }
    console.log(type, value)
    Alexa.findOneAndUpdate({id: id}, {[type]: value})
    .then((obj) => {
        console.log('updated', id)
        res.send();
    })
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
