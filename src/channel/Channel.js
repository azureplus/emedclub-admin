import Window from '../util/window'
import Document from '../util/document'

export default class Channel {
	constructor(name) {
        this._name = name;

		this._deferred = null;
        this._resolve  = null;
        this._reject   = null;
    }

    get name() {
        return this._name;
    }

    promise() {
        let self = this;

    	self.reject(new Error());

        self._resolve  = null;
        self._reject   = null;

        self._deferred = new Promise(function(resolve, reject) {
            var interval = setInterval(function() {
                if (self._resolve != null) {
                    resolve(self._resolve);
                    clearInterval(interval);
                } else if (self._reject != null) {
                    reject(self._reject);
                    clearInterval(interval);
                }
            }, 500);
        });

        return self._deferred;    	
    }
	
	resolvedPromise(data) {
        var promise = this.promise();
		this._resolve = data;
        return promise;
	}
	
	rejectedPromise() {
        var promise = this.promise();
		this._reject = "当前平台暂时不支持该功能";
        return promise;
	}
    
    resolve(data) {
        if (this._deferred) {
        	this._resolve = data;
        }
        
        this._deferred = null;
    }

    reject(error) {
        if(this._deferred) {
            this._reject = error;
        }

        this._deferred = null;
    }

    isAuthenticated() {
        return null != this._me;
    }
    
    loginQuietly() {
    	var self = this;
    	
    	return self.rejectedPromise();
    }
    
    login() {
        return this.rejectedPromise();
	}
	
    pay(options) {
        console.error("pay failed " + JSON.stringify(options))
        return this.rejectedPromise();
	}

    useSystemShare() {
        return false;
    }

    setShareContent(title, description, link, imgUrl) {
        console.log("share " + link);
        console.log("share " + description);
    }
	
    share(options) {
        return this.rejectedPromise();
    }

    paramOf(name) {
        return Window.getParameter(name);
    }

    chooseImage() {
        var promise = this.promise();

        promise.then(function(f){
            document.getElementById("image-file-form").reset();
        }, function(err){
            document.getElementById("image-file-form").reset();
        })
        
        setTimeout(function(){
            document.getElementById("image-file-input").click();
        }, 1)

        return promise;
    }

    require(uri) {
        return Document.require(uri);
	}
}
