const cookieJar = {}; // Shared Cookie Storage
const axios = require('axios');
const https = require('https');


module.exports = {


    // Helper Functions
    createOptions: function (config, requestBody) {
        const agent = new https.Agent({ rejectUnauthorized: config.sslVerify === 'true' });
        let url = config.url

        if(!url.startsWith('http://') && !url.startsWith('https://')){
            //assuming https
            url = `https://${url}`
        }
        
        const endpoint = new URL(url);
        endpoint.port = endpoint.port || 443; //use default port if not specified

        console.log(endpoint.href)

        const optionsBase = {
            method: 'post',
            url: endpoint.href,
            data: requestBody,
            httpsAgent: agent
        }

        const optionsToken = {
            headers: {
                'X-Auth-Token': "xxxx",
                'Content-Type': 'application/json'
            }
        };

        const optionsAuth = {
            auth: {
                username: config.user,
                password: config.password
            },
            headers: {
                'Content-Type': 'application/json'
            }
        };
        return { optionsToken: { ...optionsBase, ...optionsToken }, optionsAuth: { ...optionsBase, ...optionsAuth } };
    },

    performRequest: async function (node, requestOptions) {

        console.log(requestOptions)
        node.status({
            fill: 'blue',
            shape: 'dot',
            text:'Requesting with credentials'
        });
        try {
            const response = await axios(requestOptions);
            node.status({ fill: 'green', shape: 'dot', text: `${response.statusText} ${response.status}` });
            console.log(response)
            return response;
        } catch (error) {
            if (error.response) {
                // The request was executed, and the server provided a response
                const status = error.response.status;
                const statusText = error.response.statusText;
                const message = error.response.data[0]?.message || 'Unknown error';

                node.status({ fill: 'red', shape: 'dot', text: `${statusText} ${status}` });

                return { message, status, statusText };
            } else {
                // Error that was not returned by the server
                const message = error.message;

                node.status({ fill: 'red', shape: 'dot', text: message });
                return message;
            }
        }
    }
};
