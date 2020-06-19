/**
 *
 */
var AbstractWebService = function() {
    this.header = {};
    this.finalCallback = undefined;

    this.httpRequest = function(method, apiUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open(method, apiUrl, true);
        xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        Object.keys(this.header).forEach((k) => {
            xhr.setRequestHeader(k, this.header[k]);
        });
        // xhr.withCredentials = true;
        return xhr;
    }
}

AbstractWebService.prototype.finally = function(f) {
    this.finalCallback = f;
    return this;
}

AbstractWebService.prototype.batch = function(funcAndArgsList, responseCallback, failedCallback) {
    var flag = 0;
    var all = {};
    var bad = null;
    funcAndArgsList.forEach(fa => {
        var name = fa[0]; // alias name
        var self = fa[1]; // this
        var func = fa[2]; // function
        var args = fa.slice(3); // arguments
        args.push(result => { // responseCallback
            all[name] = result;
            flag++;
            if(flag >= funcAndArgsList.length) {
                if(bad) {
                    failedCallback(bad);
                } else {
                    responseCallback(all);
                }
            }
        });
        args.push(failed => { // failedCallback
            all[name] = null;
            bad = failed;
            flag++;
            if(flag >= funcAndArgsList.length) {
                failedCallback(bad);
            }
        });

        func.apply(self, args);
    })
}

/**
 *
 */
AbstractWebService.prototype.jsonPost = function(apiUrl, apiRequest, responseCallback, failedCallback) {
    var xhr = this.httpRequest("POST", apiUrl);
    var self = this;
    xhr.onload = function() {
        if(self.finalCallback) {
            self.finalCallback();
        }
        var status = xhr.status;
        if(status >= 400 && failedCallback) {
            var message = xhr.responseText;
            var e = message.indexOf("<");
            if(e >= 0) {
                message = message.substring(0, e)
            }
            if(!message) {
                message = "failed to call " + xhr.responseURL
            }
            failedCallback({
                "status": xhr.status,
                "reason": message
            });
        } else if(status >= 200 && status < 300 && responseCallback) {
            if(xhr.responseText) {
                responseCallback(JSON.parse(xhr.responseText));
            } else {
                responseCallback(null);
            }
        }
    }
    if(apiRequest) {
        xhr.send(JSON.stringify(apiRequest));
    } else {
        xhr.send();
    }
}

/**
 *
 */
AbstractWebService.prototype.jsonPut = function(apiUrl, apiRequest, responseCallback, failedCallback) {
    var xhr = this.httpRequest("PUT", apiUrl);
    var self = this;
    xhr.onload = function() {
        if(self.finalCallback) {
            self.finalCallback();
        }
        var status = xhr.status;
        if(status >= 400 && failedCallback) {
            var e = message.indexOf("<");
            if(e >= 0) {
                message = message.substring(0, e)
            }
            if(!message) {
                message = "failed to call " + xhr.responseURL
            }
            failedCallback({
                "status": xhr.status,
                "reason": message
            });
        } else if(status >= 200 && status < 300 && responseCallback) {
            if(xhr.responseText) {
                responseCallback(JSON.parse(xhr.responseText));
            } else {
                responseCallback(null);
            }
        }
    }
    if(apiRequest) {
        xhr.send(JSON.stringify(apiRequest));
    } else {
        xhr.send();
    }
}


/**
 *
 */
AbstractWebService.prototype.jsonDelete = function(apiUrl, apiRequest, responseCallback, failedCallback) {
    var xhr = this.httpRequest("DELETE", apiUrl);
    var self = this;
    xhr.onload = function() {
        if(self.finalCallback) {
            self.finalCallback();
        }
        var status = xhr.status;
        if(status >= 400 && failedCallback) {
            var message = xhr.responseText;
            var e = message.indexOf("<");
            if(e >= 0) {
                message = message.substring(0, e)
            }
            if(!message) {
                message = "failed to call " + xhr.responseURL
            }
            failedCallback({
                "status": xhr.status,
                "reason": message
            });
        } else if(status >= 200 && status < 300 && responseCallback) {
            if(xhr.responseText) {
                responseCallback(JSON.parse(xhr.responseText));
            } else {
                responseCallback(null);
            }
        }
    }
    if(apiRequest) {
        xhr.send(JSON.stringify(apiRequest));
    } else {
        xhr.send();
    }
}

/**
 *
 */
AbstractWebService.prototype.jsonGet = function(apiUrl, responseCallback, failedCallback) {
    var xhr = this.httpRequest("GET", apiUrl);
    var self = this;
    xhr.onload = function() {
        if(self.finalCallback) {
            self.finalCallback();
        }
        var status = xhr.status;
        if(status >= 400 && failedCallback) {
            var message = xhr.responseText;
            var e = message.indexOf("<");
            if(e >= 0) {
                message = message.substring(0, e)
            }
            if(!message) {
                message = "failed to call " + xhr.responseURL
            }
            failedCallback({
                "status": xhr.status,
                "reason": message
            });
        } else if(status >= 200 && status < 300 && responseCallback) {
            if(xhr.responseText) {
                responseCallback(JSON.parse(xhr.responseText));
            } else {
                responseCallback(null);
            }
        }
    }
    xhr.send();
}
