
const express = require('express');
const axios = require('axios');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const clusterName = "clusterparking";
const username = "hoangduong";
const password = "0yD9IMEUIXRthyM8";

const mongoose = require('mongoose');
const { Schema } = mongoose;
const uri = `mongodb+srv://${username}:${password}@${clusterName}.8fhobdz.mongodb.net/parking_log?retryWrites=true&w=majority`;

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a model
const Parking = mongoose.model('Parking', new Schema({ request: Object, response: Object, timestamp: Date, error: String }), 'parking');
console.log("Test");


app.post('/api/ValidateListing', async (req, res) => {
    const intervalTime = 30000;
    const licensePlate = req.body.licensePlate;
    const email = req.body.email;
    const currentDate = new Date().toISOString();
    const currentDateWithoutMilliseconds = currentDate.slice(0, 19) + 'Z';

    try {
        const response = await axios({
            method: 'post',
            url: 'https://app.parkon.ch/api/VehicleListing/ValidateListing',
            data: {
                "$type": "Parkon.Shared.Dto.VehicleListingDto, Parkon.Bridge",
                "EmailToSendConfirmation": "",
                "EstateId": "e1100e0e-97b1-4d30-85e3-5373ce2b7003",
                "Notes": "",
                "SelectetTimelimit": 2,
                "Source": null,
                "SourcePortalId": "057385c9-c569-40ea-86a8-d34a5e342f94",
                "SourcePortalPublicTitle": null,
                "Type": 0,
                "ValidFrom": currentDateWithoutMilliseconds,
                "ValidUntil": null,
                "VehicleCanton": null,
                "VehicleFullPlate": licensePlate,
                "VehicleId": null,
                "VehicleNumber": null,
                "VehicleOwnerAddressCity": null,
                "VehicleOwnerAddressStreet": null,
                "VehicleOwnerAddressZip": null,
                "VehicleOwnerName": null,
                "Id": "00000000-0000-0000-0000-000000000000"
            },
            headers: {
                'authority': 'app.parkon.ch',
                'accept': 'application/json, text/javascript, */*; q=0.01',
                'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
                'content-type': 'application/json; charset=UTF-8',
                'origin': 'https://app.parkon.ch',
                'referer': 'https://app.parkon.ch/Portal/29wlwq',
                'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                'x-requested-with': 'XMLHttpRequest',
            },

        }
        );
        const data = response.data;
        console.log(data);
        // Daten vorbereiten
        const dataToInsert = {
            response: response.data,
            timestamp: new Date()
        };

        // Daten einfügen
        const parking = new Parking(dataToInsert);

        await parking.save();
        console.log("Response data saved to MongoDB");

    } catch (error) {
        console.log(error);
        // Fehler in der Datenbank speichern
        const errorData = {
            error: error.toString(),
            timestamp: new Date()
        };
        const parking = new Parking(errorData);
        await parking.save();
        console.log("Error data saved to MongoDB");
    }

    res.send(email);
});


app.post('/api/CreateOrUpdateVehicleListing', async (req, res) => {
    const intervalTime = 18000000;



    async function makeRequest() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Monate beginnen bei 0 in JavaScript
        const day = String(now.getDate()).padStart(2, '0');
        const hour = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const second = String(now.getSeconds()).padStart(2, '0');
        const currentDateWithoutMilliseconds = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
        const licensePlate = req.body.licensePlate;
        const email = req.body.email;

        const requestBody = {
            "$type": "Parkon.Shared.Dto.VehicleListingDto, Parkon.Bridge",
            "EmailToSendConfirmation": email,
            "EstateId": "e1100e0e-97b1-4d30-85e3-5373ce2b7003",
            "Notes": "",
            "SelectetTimelimit": 6,
            "Source": null,
            "SourcePortalId": "057385c9-c569-40ea-86a8-d34a5e342f94",
            "SourcePortalPublicTitle": null,
            "Type": 0,
            "ValidFrom": currentDateWithoutMilliseconds,
            "ValidUntil": null,
            "VehicleCanton": null,
            "VehicleFullPlate": licensePlate,
            "VehicleId": null,
            "VehicleNumber": null,
            "VehicleOwnerAddressCity": null,
            "VehicleOwnerAddressStreet": null,
            "VehicleOwnerAddressZip": null,
            "VehicleOwnerName": null,
            "Id": "00000000-0000-0000-0000-000000000000"
        };
        try {
            const response = await axios({
                method: 'post',
                url: 'https://app.parkon.ch/api/VehicleListing/CreateOrUpdateVehicleListing',
                data: requestBody,
                headers: {
                    'authority': 'app.parkon.ch',
                    'accept': 'application/json, text/javascript, */*; q=0.01',
                    'accept-language': 'de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7',
                    'content-type': 'application/json; charset=UTF-8',
                    'origin': 'https://app.parkon.ch',
                    'referer': 'https://app.parkon.ch/Portal/29wlwq',
                    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'empty',
                    'sec-fetch-mode': 'cors',
                    'sec-fetch-site': 'same-origin',
                    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
                    'x-requested-with': 'XMLHttpRequest',
                },
            });

            const data = response.data;
            console.log(data);

            // Connection to MongoDB and saving data
            const humanReadableTimestamp = new Date().toLocaleString();
            const dataToInsert = {
                request: requestBody,
                response: data,
                timestamp: humanReadableTimestamp
            };

            try {
                await Parking.create(dataToInsert);
                console.log("Response data saved to MongoDB");

            } catch (mongoError) {
                console.error('An error occurred saving to MongoDB: ', mongoError);

            }

        } catch (error) {
            console.log(error);
            // Fehler in der Datenbank speichern
            const errorData = {
                error: error.toString(),
                timestamp: new Date()
            };
            const parking = new Parking(errorData);
            await parking.save();
            console.log("Error data saved to MongoDB");
        }
    }

    await makeRequest();

    // Starten Sie den Interval
    setInterval(makeRequest, intervalTime);

    res.send(email);

});

app.delete('/api/clearData', async (req, res) => {
    try {
        await Parking.deleteMany({});
        res.status(200).send('Alle Daten wurden erfolgreich gelöscht.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Es gab einen Fehler beim Löschen der Daten.');
    }
});

app.get('/api/readData', async (req, res) => {
    try {
        const parkingData = await Parking.find({});
        res.status(200).json(parkingData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

const port = process.env.POdsRT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));


