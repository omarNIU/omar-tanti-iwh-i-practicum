const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please include the private app access token in your repo BUT only an access token built in a TEST ACCOUNT. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = 'pat-eu1-1f763e98-4ad3-4c1a-95f8-4c1dbff9b660';

// * Route for homepage
app.get('/', async ( req, res) => {
    const certifications = 'https://api.hubspot.com/crm/v3/objects/2-115626276/?properties=name,issued_by,price,level';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(certifications, { headers });
        const data = resp.data.results;
        res.render('homepage', { title: 'Certifications | HubSpot APIs', data });
    } catch (error) {
        console.error(error);
    }
});

// * Route to Render Form in a pug template for Custom Object
app.get('/update-cobj', async (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// * Route to send the data captured by the form to hubspot
app.post('/update-cobj', async (req, res) => {
    const create = {
        properties: {
            "name": req.body.name,
            "issued_by": req.body.issued_by,
            "price": req.body.price,
            "level": req.body.level,
        }
    }

    const createCertification = `https://api.hubapi.com/crm/v3/objects/2-115626276`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(createCertification, create, { headers } );
        res.redirect('/');
    } catch(err) {
        console.error(err);
    }

});


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
