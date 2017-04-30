var fs = require('fs')
const exec = require('child_process').exec;
const path = require('path')
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
const folder = `./person${process.argv[2]}`;
const files = fs.readdirSync(folder)
.filter((file) => {
  return path.extname(file) === '.wave'
})
.map((file) => {
    return file.slice(0,-5)
})
.map((file) => {
    return Alexa.findOne({id: file});
})

const shortCluster = new Map();
let counter = 0;

Promise.all(files)
    .then((documents) => {
        mongoose.disconnect();
        const maped = documents.map((document) => {
            let cluster = document.body.utteranceId
            if (cluster.lastIndexOf("/") > cluster.length - 5) {
                cluster = cluster.substr(0, cluster.lastIndexOf("/"));
            }
            return {
                alexa: document.alexa,
                transkript: document.transkript,
                id: document.id,
                dialekt: document.dialekt,
                skill: document.body.providerInfoDescription || "",
                date: new Date(document.body.creationTimestamp).toISOString(),
                cluster
            }
        })
        .map((document) => {
            if(!shortCluster.has(document.cluster)) {
                shortCluster.set(document.cluster, counter);
                document.cluster = counter;
                counter++;
            } else {
                document.cluster = shortCluster.get(document.cluster);
            }
            return document
            
        })
        maped.sort((a, b) => {
            a = Number(a.cluster)
            b = Number(b.cluster)
            if (a == b) {
                return 0
            }

            if (a > b) {
                return 1
            }
            return -1
        })
        return Promise.all(maped.map((document) => {
            return new Promise((res) => {
                exec(`asr align -s1 "${document.transkript}" -s2 "${document.alexa}"`, (error, stdout, stderr) => {
                    res(stdout)
                });
            })
            .then((wer) => {
                document.wer = wer.trim();
                return document;
            })
            
        }))
    })
    .then((documents) => {
        console.log('id\tzeit\tcluster\treference\thypothese\tdialekt\twer\tlänge_ref\tsended')
        documents.forEach((entry) => {
        console.log(`${entry.id.split('#')[1]}\t${entry.date}\t${entry.cluster}\t${entry.transkript}\t${entry.alexa}\t${(entry.dialekt || "")}\t${entry.wer}\t${(entry.transkript || "").split(' ').length}\t${entry.skill}`)
        })
    })