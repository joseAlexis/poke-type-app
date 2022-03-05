const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const pokemonTypesJSONFile = path.join(__dirname, '../', 'pokemon-types.json');

/**
 * Get All Pokemon Types
 */
router.get('/', (req, res) => {
    fs.readFile(pokemonTypesJSONFile, 'utf8', (err, data) => {
        if (err) throw err;

        res.send(JSON.parse(data));
    });
});

router.get('/id/:value', (req, res) => {
    const id = Number(req.params.value);
    fs.readFile(pokemonTypesJSONFile, 'utf8', (err, data) => {
        if (err) throw err;

        const pokemonTypes = JSON.parse(data.toString());

        const pokemonType = pokemonTypes.find(t => {
            return t.id === id;
        });
        return res.status(200).send(pokemonType);
    });
});

router.get('/name/:value', (req, res) => {
    const name = (req.params.value).toLowerCase();
    fs.readFile(pokemonTypesJSONFile, 'utf8', (err, data) => {
        if (err) throw err;

        const pokemonTypes = JSON.parse(data.toString());

        const pokemonType = pokemonTypes.find(t => {
            return t.name.toLowerCase() === name;
        });
        return res.status(200).send(pokemonType);
    });  
});

module.exports = router;