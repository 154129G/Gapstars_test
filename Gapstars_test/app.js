
let axios = require('axios');
let { writeFile } = require('fs');
let blend = require('@mapbox/blend');
let argv = require('minimist')(process.argv.slice(2));

let {
    greeting = 'Hello', who = 'You',
    width = 400, height = 500, color = 'Pink', size = 100,
} = argv;

function callCat(says) {
    return axios.get(`https://cataas.com/cat/says/${says}`, { responseType: 'arraybuffer', params: { width, height, color, s: size } });
}

function blendImages(b1, b2) {
    return new Promise((resolve, reject) => {
        blend([
            { buffer: b1, x: 0, y: 0 },
            { buffer: b2, x: width, y: 0 }
        ],
            { width: width * 2, height, format: 'jpeg', },
            (err, data) => {
                if (err) reject(err);
                else resolve(data);

            });
    })
}

function writeToImage(fileOut, data) {
    return new Promise((resolve, reject) => {
        writeFile(fileOut, data, 'binary', (err) => {
            if (err) reject(err);
            else {
                console.log("The file was saved!");
                resolve();
            }
            
        });
    });
}

async function main() {
    try {
        const res1 = await callCat(greeting);
        const res2 = await callCat(who);

        const data = await blendImages(res1, res2);
        
        await writeToImage(join(process.cwd(), `/cat-card.jpg`), data)

    } catch (e) {
        console.log(e);
    }

}

main();