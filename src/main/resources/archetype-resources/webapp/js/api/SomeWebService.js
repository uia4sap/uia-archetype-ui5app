/**
 */
var SomeWebService = function(webapi) {
    this.url = webapi + "/some/";
};

/**
 */
SomeWebService.prototype = new AbstractWebService();

/**
 */
SomeWebService.prototype.insert = function(data, handler, failed) {
    this.jsonPost(this.url, data, handler, failed);
}

/**
 */
SomeWebService.prototype.update = function(data, handler, failed) {
    this.jsonPut(this.url, data, handler, failed);
}

/**
 */
SomeWebService.prototype.queryAll = function(handler, failed) {
    this.jsonGet(this.url, handler, failed);
}

/**
 */
SomeWebService.prototype.queryOne = function(id, handler, failed) {
    this.jsonGet(this.url + id, handler, failed);
}
