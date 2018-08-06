const fs = require('fs');

const file = '/home/DNAenv.json';

const data = fs.readFileSync(file, 'utf8');
const jsonData = JSON.parse(data);

module.exports = jsonData;