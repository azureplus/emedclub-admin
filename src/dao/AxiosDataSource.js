import Axios from 'axios'

export default class AxiosDataSource {
    post(url, data) {
        return new Promise(function(resolve, reject){
            Axios.post(url, data).then(function (response) {
                resolve(response.data);
            }).catch(function (error) {
                console.error(error.config);
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    reject(new Error(error.response.data));
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    reject(new Error('服务器暂时连接不上，请请稍后再再试'));
                } else {
                    // Something happened in setting up the request that triggered an Error
                    reject(new Error(error.message));
                }
            });
		});
    }

    upload(url, file) {
        return new Promise(function(resolve, reject){
            var data = new FormData();
            data.append('file', file);

            var config = {
                onUploadProgress: function(progressEvent) {
                    var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                },

                headers: { 'content-type': 'multipart/form-data' }
            };

            Axios.post(url, data, config).then(function (res) {
                resolve(res.data);
            }).catch(function (err) {
                reject(new Error('上传失败，请稍后再试'));
            });
        })
    }
}