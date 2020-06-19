var api = {

    abstractWebService: function() {
        return new AbstractWebService();
    },

    someWebService: function(url) {
        return new SomeWebService(url);
    }
}