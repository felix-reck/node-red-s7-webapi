const s7webapiclient = require('./s7-webapi-client.js');

module.exports = function (RED) {
    function httpNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.on('input', async function (msg, send, done) {

            // Input parameters
            const server = RED.nodes.getNode(config.server);
            const service = (config.service || msg.service || '').replace(/\./g, '/');
            const requestBody = msg.payload;

            console.log(requestBody)


                  // Create options for the request using the mip-client helper
                  const options = s7webapiclient.createOptions({
                    url: server.url,
                    user: server.user,
                    password: server.password,
                    sslVerify: server.sslVerify,
                    service: service
                }, requestBody);


            let response = await s7webapiclient.performRequest(node, options.optionsAuth);

            if (response.status === 401) {
                //response = await mipclient.performRequest(node, options.optionsAuth);
            }
            if (response.status === 200) {
                //const result = mipclient.handleResponse(response, format, servicetype);
                //msg.payload = result.data;
                //msg.status = result.status;
                //msg.statusText = result.statusText;
                msg.payload = response


                send(msg);
                done();
            } else {

                done(response.message)

                //do nothing!

            }


        });
    }

    RED.nodes.registerType('s7-webapi', httpNode);
};
