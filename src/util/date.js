export default {
    pretty(date) {
        if (date) {
            var timestamp = Date.parse(date);
            if (isNaN(timestamp) == true) {
                date.replace(/-/g, '/');
            }

            timestamp = Date.parse(date);
            if (isNaN(timestamp) == true) {
                return date;
            }

            date = new Date(date);
            var now  = new Date();

            var hours = date.getHours();
            var minutes = date.getMinutes();
            if (minutes > 0) {
                minutes = minutes < 10 ? '0' + minutes : minutes;
                var strTime = hours + '点' + minutes;
            } else {
                var strTime = hours + '点整';
            }

            var strDay = (date.getMonth() + 1) + "月" + date.getDate() + "号" + strTime;
            if (date.getFullYear() == now.getFullYear()) {
                return strDay;
            } else {
                return date.getFullYear() + "年" + strDay;
            }
        } else {
            return "";
        }
    },

    day(date) {
        var timestamp = Date.parse(date);
        if (isNaN(timestamp) == true) {
            date.replace(/-/g, '/');
        }

        date = new Date(date);

        var month = date.getMonth() + 1;
        if (month < 10) {
            var strMonth = "0" + month;
        } else {
            var strMonth = "" + month;
        }

        var day = date.getDate();
        if (day < 10) {
            var strDay = "0" + day;
        } else {
            var strDay = "" + day;
        }        
        return date.getFullYear() + "-" + strMonth + "-" + strDay;
    },

    time(date) {
        var timestamp = Date.parse(date);
        if (isNaN(timestamp) == true) {
            date.replace(/-/g, '/');
        }

        date = new Date(date);

        return date.getHours() + ":" + date.getMinutes();
    }
}