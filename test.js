"use strict";
const domain = require('domain');
const fs = require('fs');
const d = domain.create();

var ca = {
    //key: './ca/privatekey.pem',
    //cert: './ca/certificate.pem',
    //send: './certrequest.csr',
    //send: './ca/cacert.pem',

    key: '/Users/muzhilong/.ssh/my-private-root-ca.key.pem',
    cert: '/Users/muzhilong/.ssh/my-private-root-ca.crt.pem',

    //key: './ssl/key.pem',
    //cert: './ssl/crt.pem'
};
function StartServer() {
    let fs = require('fs');
    let hoxy = require('./lib/main');
    let proxy = hoxy.createServer({
        //certAuthority: {
        //    //key: fs.readFileSync('/Users/muzhilong/.ssh/my-private-root-ca.key.pem'),
        //    //cert: fs.readFileSync('/Users/muzhilong/.ssh/my-private-root-ca.crt.pem')
        //    key: fs.readFileSync(ca.key),
        //    cert: fs.readFileSync(ca.cert)
        //}
    }).listen(8081, function () {
        console.log('start server at 8081');
    });

    proxy.intercept('request', req => {
        //proxy.log('test');
        console.log('URL:', req.fullUrl());
        req.headers['x-unicorns'] = 'unicorns';
        // server will now see the "x-unicorns" header
    });


    proxy.intercept({
        phase: 'request',
        hostname: /^(www\.)*test\.com/
    }, function (req, resp, cycle) {
        console.log('send crt');
        resp.headers['content-type'] = 'application/x-x509-ca-cert';
        resp.headers['content-disposition'] = 'filename=certificate.pem';
        resp.string = fs.readFileSync(ca.cert);
    });
    proxy.intercept({
        phase: 'request',
        hostname: /^(www\.)*123\.com/
    }, function (req, resp, cycle) {
        console.log('send crt');
        resp.headers['content-type'] = 'application/x-x509-ca-cert';
        resp.headers['content-disposition'] = 'filename=certrequest.csr';
        resp.string = fs.readFileSync(ca.send || ca.cert);
    });
}

StartServer();
/*

d.on('error', (er) => {
    console.error('Caught error:', er);
});
d.run(() => {
    process.nextTick(() => {
        setTimeout(StartServer, 100);

        process.on('uncaughtException', function (err) {
            console.log('uncaughtException', err);

            try {
                var killTimer = setTimeout(function () {
                    process.exit(1);
                }, 30000);
                killTimer.unref();

                server.close();
            } catch (e) {
                console.log('error when exit', e.stack);
            }
        });
    });
});*/