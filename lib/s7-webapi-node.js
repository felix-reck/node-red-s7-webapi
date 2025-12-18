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
            const configId = server.id;
  
            /*
            const loginOptions = s7webapiclient.loginOptions({
                url: server.url,
                user: server.user,
                password: server.password
            });
            */

            //const requestOptions = s7webapiclient.tokenOptions(server.url,configId);


            await s7webapiclient.performLogin(node, server);
            const response = await s7webapiclient.performRequest(node, server)

            //console.log(response)



             //const response2 = await s7webapiclient.performRequest(node, requestOptions, configId)

             //console.log(response2)



            //  if (response.data.error.code === 2) {
            //      response = await s7webapiclient.performRequest(node, options.optionsAuth);
            //  }
            if (response.status === 200) {
                //const result = mipclient.handleResponse(response, format, servicetype);
                //msg.payload = result.data;
                //msg.status = result.status;
                //msg.statusText = result.statusText;
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
