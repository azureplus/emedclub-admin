export default {
    setCookie(key, value, days) {
		days = days || 7;
		
		var expire = new Date();
		expire.setDate(expire.getDate() + days);

		document.cookie = key + '=' + escape(value) + '; expires=' + expire + ';path=/';
    },

    getCookie(key, defval) {
        var coo = unescape(document.cookie);//解码

        var arr1 = coo.split('; ');//第一次分解后是数组
        for (var i = 0; i < arr1.length; i++) {//第二次循环拆分数组
            var arr2 = arr1[i].split('=');

            if (arr2[0] === key) {
                return arr2[1];
            }
        }

        return defval;
    },

    require(uri) {
    	return new Promise(function(resolve, reject) {
	    	let filenode;
	    	let jsfile_extension  = /(.js)$/i;
	    	let cssfile_extension = /(.css)$/i;
	
	    	if (jsfile_extension.test(uri)) {
				let timer = setTimeout(function(){
                    let message = "load uri timeout " + uri;
					console.error(message);
					reject(message);
                }, 60 * 1000);
	    		
	        	filenode = document.createElement('script');
	        	filenode.src = uri;
	        	
	        	// IE
	        	filenode.onreadystatechange = function () {
	            	if (filenode.readyState === 'loaded' || filenode.readyState === 'complete') {
	                	clearTimeout(timer);
	                	
	                	filenode.onreadystatechange = null;
                        resolve("");
	            	}
	        	};
	        	
	        	// others
	        	filenode.onload = function () {
	        		clearTimeout(timer);
                    resolve("");
	        	};
	        	
	        	document.head.appendChild(filenode);
	    	} else if (cssfile_extension.test(uri)) {
	        	filenode = document.createElement('link');
	        	filenode.rel = 'stylesheet';
	        	filenode.type = 'text/css';
	        	filenode.href = uri;
	        	document.head.appendChild(filenode);

                resolve("");
	    	} else {
	    		let message = "unknown uri type to load " + uri;
	    		console.error(message);
	        	reject(message);
	    	}
    	});
	}
}