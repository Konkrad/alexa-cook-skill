var request = require('request');
var fs = require('fs');

const cookie = 'insert Cookie attribute of an alexa.amazon.de request'

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');
mongoose.Promise = global.Promise
const Schema = mongoose.Schema;
const AlexaSchema = new Schema({
	id: { type: String, unique: true },
	alexa: String,
	body: Object
});
const Alexa = mongoose.model('Alexa', AlexaSchema);

var headers = {
	'DNT': '1',
	'Accept-Encoding': 'identity;q=1, *;q=0',
	'Accept-Language': 'en-US,en;q=0.8,de;q=0.6',
	'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/56.0.2924.76 Chrome/56.0.2924.76 Safari/537.36',
	'Accept': '*/*',
	'Referer': 'http://alexa.amazon.de/spa/index.html',
	'Connection': 'keep-alive',
	'Range': 'bytes=0-',
	'Cookie': cookie
};

var Activityoptions = {
	encoding: 'utf8',
	gzip: true,
	json: true,
	url: `https://layla.amazon.de/api/activities?startTime=&size=50&offset=1&_=${new Date().getTime()}`,
	headers: headers
};

function callback(error, response, body) {
	if (!error && response.statusCode == 200) {
		const AlexaEntry = [];
		Promise.all(body.activities.map((val) => {
			const entry = new Alexa({
				id: val.id,
				alexa: JSON.parse(val.description).summary,
				body: val
			})
			AlexaEntry.push({
				id: val.id,
				utteranceId: val.utteranceId
			})
			return entry.save()
			.catch(() => {
				return Promise.resolve();
			})
		}))
			.then(() => {
				return Promise.all(AlexaEntry
					.filter((entry) => {
						return !fs.existsSync(`./utterances/${entry.id}`);
					})
					.map((entry) => {
						const options = {
							url: `https://layla.amazon.de/api/utterance/audio/data?id=${entry.utteranceId}`,
							headers: headers
						};
						const downloadPipe = request(options)
							.on('error', function (err) {
								console.log("Fehler", err)
							})
							.pipe(fs.createWriteStream(`./utterances/${entry.id}.wave`));

						return new Promise((resolve) => {
							downloadPipe.on('close', () => {
								resolve();
							})
						})
					})
				)
			})
			.then(() => {
				mongoose.disconnect();
				console.log("Fertig mit allem")
			})
	}
}

request(Activityoptions, callback);
