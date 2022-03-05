const bodyParser = require("body-parser");
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { checkSchema, validationResult } = require("express-validator")

const pokemonJSONFile = path.join(__dirname, '../', 'pokemons.json');

router.use(bodyParser.json())

/**
 * Get All Pokemons
 */
router.get('/', (req, res) => {
    fs.readFile(pokemonJSONFile, 'utf8', (err, data) => {
        if (err) throw err;

        res.send(JSON.parse(data));
    });
});

/**
 * Get a pokemon by name
 */
router.get('/:name', (req, res) => {
    console.log(`/name`)
    fs.readFile(pokemonJSONFile, 'utf8', (err, data) => {
        if (err) throw err;

        const pokemons = JSON.parse(data.toString());

        const pokemon = pokemons.find(p => {
            return p.name.trim().toLowerCase() === req.params.name.trim().toLowerCase();
        });

        return res.status(200).send(pokemon);
    });
});


/**
 * Get a pokemon by id 
 */

router.get('/:id', (req, res) => {
    console.log(`/id`)
    fs.readFile(pokemonJSONFile, 'utf8', (err, data) => {
        if (err) throw err;

        const pokemons = JSON.parse(data.toString());

        console.log(`req.params.id ${req.params.id}`)
        const pokemon = pokemons.find(p => {
            return p.id.toString() === req.params.id.toString();
        });
        return res.status(200).send(pokemon);
    });
});

/**
 * Create pokemon;
 */
router.post('/',
    checkSchema({
        name: {
            isString: true,
            errorMessage: 'Invalid name, it must be a String'
        },
        types: {
            isArray: {
                errorMessage: 'Invalid type, it must be an array',
            },
            notEmpty: {
                errorMessage: 'Invalid type(s), at least 1 type must be defined'
            }
        }
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }

        fs.readFile(pokemonJSONFile, 'utf8', (err, data) => {
            if (err) throw err;

            let pokemons = JSON.parse(data.toString());
            pokemons.push({
                id: pokemons.length + 1,
                name: req.body.name,
                types: req.body.types
            });

            fs.writeFile(pokemonJSONFile, JSON.stringify(pokemons), (err) => {
                if (err) throw err;
                return res.status(201).send(pokemons[pokemons.length - 1]);
            });
        });
    });

/**
 * Update a pokemon
 */
router.put('/:id',
    checkSchema({
        id: {
            isInt: true,
            errorMessage: 'Invalid pokemon id',
            in: ["params"]
        },
        name: {
            isString: true,
            errorMessage: 'Invalid name, it must be a String'
        },
        types: {
            isArray: {
                errorMessage: 'Invalid type, it must be an array',
            },
            notEmpty: {
                errorMessage: 'Invalid type(s), at least 1 type must be defined'
            }
        }
    }),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }

        fs.readFile(pokemonJSONFile, 'utf8', (err, data) => {
            if (err) throw err;

            let pokemons = JSON.parse(data.toString());

            //Get the index based on the name
            let index = pokemons.findIndex(p => {
                return p.id.toString() === req.params.id
            });

            //Update pokemon name
            pokemons[index].name = req.body.name;

            //Remove current pokemon types
            pokemons[index].types.splice(0, pokemons[index].types.length);

            //Update pokemon type(s)
            req.body.types.forEach(type => {
                pokemons[index].types.push(type);
            });

            fs.writeFile(pokemonJSONFile, JSON.stringify(pokemons), (err) => {
                if (err) throw err;

                return res.status(200).send(pokemons[index]);
            });
        });

    });

/**
 * Delete a pokemon
 */
router.delete('/:id',
    checkSchema({
        id: {
            isInt: true,
            errorMessage: 'Invalid pokemon id',
            in: ["params"]
        }
    }), (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send({ errors: errors.array() });
        }

        fs.readFile(pokemonJSONFile, 'utf8', (err, data) => {
            if (err) throw err;

            let pokemons = JSON.parse(data.toString());

            //Get the index based on the name
            let index = pokemons.findIndex(p => {
                return p.id.toString() === req.params.id
            });

            let deletedItem = pokemons.splice(index, 1);

            fs.writeFile(pokemonJSONFile, JSON.stringify(pokemons), (err) => {
                if (err) throw err;

                res.status(200).send(deletedItem);
            });
        });
    });

module.exports = router;