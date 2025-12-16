module.exports = function(RED) {
    function s7webApiServerNode(n) {
        RED.nodes.createNode(this,n);
     
        this.name = n.name;
        this.url = n.url;
        this.user = n.user;
        this.password = this.credentials.password; // aus credentials store
        this.sslVerify = n.sslVerify
        
    }
    RED.nodes.registerType('s7-webapi-server',s7webApiServerNode,{
        credentials: {
            password: {type:'password'}
        }
    });
}