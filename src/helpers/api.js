    
const request = require('request');
const {setLog} = require('../helpers/log');

function parseRequest(url){
    return new Promise(function(resolve, reject){
        request(url, function (error, response, body) {
            // Lidar com os erros, salvar no log e mandar de volta
            if (error) {
                setLog(error)
                return reject(error)
            };
            try {

                resolve(JSON.parse(body));
            } catch(e) {
                reject(e);
            }
        });
    });
}

module.exports = {parseRequest}