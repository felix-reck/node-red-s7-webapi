const s7webapiclient = require('./s7-webapi-client.js');

module.exports = function (RED) {
    function httpNode(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        node.on('input', async function (msg, send, done) {

            // Input parameters
            const server = RED.nodes.getNode(config.server);
            const requestParams = msg.payload?.params;
            const method = config.method;

            let requestBody = {
                jsonrpc: "2.0",
                id: 1,
                method: method
            };

            if (requestParams !== undefined) {
                requestBody.params = requestParams;
            }

            if (method === 'DefinedByPayload') {
                //console.log('using payload')
                requestBody = msg.payload;
            }

            if (method === 'PlcProgram.Browse' && requestParams == undefined) {
                requestBody.params = {
                    "mode": "children"
                }
            }


            msg.requestBody = requestBody

            //await s7webapiclient.performLogin(node, server)
            
            const response = await s7webapiclient.performRequest(node, server, requestBody)


            if (response.status === 200) {

                msg.payload = response.data


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
