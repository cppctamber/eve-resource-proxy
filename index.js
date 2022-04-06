const
    express = require('express'),
    app = express(),
    createProxyHandler = require("./src/proxy");

app.set('port', process.env.PORT || 5000);
app.all('/res/*', createProxyHandler("http://resources.eveonline.com"));
app.all('/app/*', createProxyHandler("http://binaries.eveonline.com"));
app.all("*", (req, res) => res.status(404).send({ error: "Not found" }));

const
    msg = `ccpwgl2-proxy listening on port ${app.get('port')}`,
    bdr = "=".repeat(msg.length);

app.listen(app.get('port'), function () {
    console.log(bdr);
    console.log(msg);
    console.log(bdr);
});

