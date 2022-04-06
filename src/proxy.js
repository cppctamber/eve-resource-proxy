const request = require("request");

/**
 * Creates a proxy handler
 * @param {String} baseURL
 * @param {Array<String>} [supportedVerbs=["GET"]]
 * @returns {function(*, *)}
 */
module.exports = function createProxyHandler(baseURL, supportedVerbs= [ "GET" ])
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