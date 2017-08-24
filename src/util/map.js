export default {
    locate() {
        return new Promise(function(resolve, reject){
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function(r){
                if(this.getStatus() == BMAP_STATUS_SUCCESS){
                    resolve(r.point);
                } else {
                    reject(new Error("无法获得位置信息" + ':' + this.getStatus()));
                }
            },{enableHighAccuracy: true});
        });
    },

    address(point) {
        return new Promise(function(resolve, reject){
            var geoc = new BMap.Geocoder(); 
            geoc.getLocation(point, function(rs){
                var addComp = rs.addressComponents;
                var addr = addComp.city + addComp.district + addComp.street + addComp.streetNumber;
                if (addComp.province !== addComp.city) {
                    resolve(addComp.province + addr); 
                } else {
                    resolve(addr);
                }
            })
        });
    },

    point(address) {
        return new Promise(function(resolve, reject){
            var geoc = new BMap.Geocoder(); 

            geoc.getPoint(address, function(point){
                if (point) {
                    resolve(point);
                } else {
                    reject(new Error("无法解析地址：" + address));
                }
            });
        });
    },

    distance(pt1, pt2) {
        var d = BMap.Map.prototype.getDistance(pt1, pt2);
        if (d > 1000) {
            return (new Number(d / 1000)).toFixed(1) + 'km';
        } else {
            return Math.round(d) + 'm';
        }
    }
}