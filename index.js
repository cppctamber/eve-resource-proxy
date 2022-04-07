const
    express = require('express'),
    app = express(),
    request = require("request");

const
    APP_PATH = "http://binaries.eveonline.com",
    RES_PATH = "http://resources.eveonline.com";

function createProxyHandler(baseURL, supportedVerbs= [ "GET" ])
{
    return function(req, res)
    {
        // Restrict http verbs
        if (req.method !== "OPTIONS" && !supportedVerbs.includes(req.method))
        {
            res.status(405).send({ error: `Unsupported http verb ${req.method}` })
            return;
        }

        // Ensure a resource is provided
        const hashPath = req.params[0];
        if (!hashPath)
        {
            res.status(400).send({ error: `Invalid resource (undefined)` });
            return;
        }

        // Add cors headers
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", supportedVerbs.join(", "));
        res.header("Access-Control-Allow-Headers", req.header('access-control-request-headers'));

        // CORS Preflight
        if (req.method === 'OPTIONS')
        {
            res.send();
            return;
        }

        // Resulting url
        const url = `${baseURL}/${hashPath}`;

        // Outputs responses
        function onRequest(err, response, body)
        {
            console.log(`${response.statusCode} - ${url}`);
        }

        // Forward request
        request({ url, method: req.method }, onRequest).pipe(res);
    }
}

app.set('port', process.env.PORT || 5000);
app.all('/res/*', createProxyHandler(RES_PATH));
app.all('/app/*', createProxyHandler(APP_PATH));
app.all("*", (req, res) => res.status(404).send({ error: "Not found" }));

const
    msg = `ccpwgl2-proxy listening on port ${app.get('port')}`,
    bdr = "=".repeat(msg.length);

app.listen(app.get('port'),  () =>
{
    console.log(bdr);
    console.log(msg);
    console.log(bdr);
});

