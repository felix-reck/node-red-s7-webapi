const tokenStorage = {};
const axios = require('axios');
const https = require('https');
const agent = new https.Agent({ rejectUnauthorized: false });

function loginOptions(config) {

    let url = config.url

    const optionsToken = {
        method: 'post',
        url: url,
        data:
        {
            "jsonrpc": "2.0",
            "method": "Api.Login",
            "params": {
                "user": config.user,
                "password": config.password ? config.password : ''
            },
            "id": 999
        }
        ,
        httpsAgent: agent,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    return optionsToken

}

module.exports = {

    performLogin: async function (node, config) {

        const requestOptions = loginOptions(config)
        const configId = config.id


        try {
            const response = await axios(requestOptions);

            tokenStorage[configId] = response.data?.result?.token

            console.log(tokenStorage)

            return response;

        } catch (error) {
            if (error.response) {
                // The request was executed, and the server provided a response
                const status = error.response.status;
                const statusText = error.response.statusText;
                const message = error.response.data[0]?.message || 'Unknown error';

                //node.status({ fill: 'red', shape: 'dot', text: `${statusText} ${status}` });

                return { message, status, statusText };
            } else {
                // Error that was not returned by the server
                const message = error.message;

                //node.status({ fill: 'red', shape: 'dot', text: message });
                return message;
            }
        }

    },

    performRequest: async function (node, config, requestBody) {

        const configId = config.id

        const requestOptions = {
            method: 'post',
            url: config.url,
            data: requestBody,
            httpsAgent: agent,
            headers: {
                'X-Auth-Token': tokenStorage[configId],
                'Content-Type': 'application/json'
            }
        };

        try {

            const response = await axios(requestOptions);
            return response;

        } catch (error) {
            if (error.response) {
                // The request was executed, and the server provided a response
                const status = error.response.status;
                const statusText = error.response.statusText;
                const message = error.response.data[0]?.message || 'Unknown error';

                return { message, status, statusText };
            } else {
                // Error that was not returned by the server
                const message = error.message;


                return message;
            }
        }
    }
};
