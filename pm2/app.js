const express = require('express');
const cors = require('cors');

const app = express();

const env = require('dotenv').config().parsed;
const fs = require('fs');
const pm2 = require("pm2");

app.use(cors());

pm2.start({
    script: 'app.js',
    name: 'api'
}, function (err, apps) {
    if (err) {
        console.error(err)
        return pm2.disconnect()
    }
});

app.get('/list', (req, res) => {
    pm2.connect(function (err) {
        if (err) {
            console.error(err)
            process.exit(2)
        }

        pm2.list((err, list) => {
            console.log(err, list)

            res.json({ list })

        });
    });
})

app.get('/restart/:name', (req, res) => {
    pm2.restart(req.params.name, (err, proc) => {
        res.send(`${req.params.name} restarted successfully`);
    })
})

app.get('/stop/:name', (req, res) => {
    pm2.stop(req.params.name, (err, proc) => {
        res.send(`${req.params.name} stopped successfully`);
    })
})

app.get('/error-log/:name', (req, res) => {

    pm2.connect(function (err) {
        if (err) {
            console.error(err)
            process.exit(2)
        }

        pm2.list((err, list) => {
            console.log(err, list)

            list.forEach((process) => {
                if (process.name == req.params.name) {

                    fs.readFile(process.pm2_env.pm_err_log_path, function read(err, data) {
                        if (err) {
                            throw err;
                        }
                        const content = data;

                        // Invoke the next step here however you like
                        console.log(content);   // Or put the next step in a function and invoke it
                        res.send(content);
                    });

                }
            });
        });
    });
});

app.get('/out-log/:name', (req, res) => {

    pm2.connect(function (err) {
        if (err) {
            console.error(err)
            process.exit(2)
        }

        pm2.list((err, list) => {
            console.log(err, list)

            list.forEach((process) => {
                if (process.name == req.params.name) {

                    fs.readFile(process.pm2_env.pm_out_log_path, function read(err, data) {
                        if (err) {
                            throw err;
                        }
                        const content = data;

                        // Invoke the next step here however you like
                        console.log(content);   // Or put the next step in a function and invoke it
                        res.send(content.toString());
                    });

                }
            });
        });
    });
})

app.listen(env.PORT, () => {
    console.log('Application running on port', env.PORT)
});