import Time from './util/date'

export default {
    data () {
        return {
            reloading: false,
            trigger: null,

			refreshing: false,
            toast: false,

            routeName: ''
		}
	},

    mounted () {
        this.trigger = this.$el;

        this.routeName = this.$route.name;

        this.initialize(true);
    },

    watch: {
        '$route' (to, from){  
            if (to.name == this.routeName) {
                this.initialize(false);
            }
        }
    },

    methods: {
        initialize(first) {
            console.log("Initialize " + this.$route.name + " " + first);

            this.reloading = false;
            this.refreshing = false;
            this.toast = false;
            
            this.routeName = this.$route.name;

            this.share();

            if (first) {
                this.onInitialize();
            } else {
                this.onUpdate();
            }
        },

        onInitialize() {
        },

        onUpdate() {
        },

        onBack() {
            this.back();
        },

        back() {
            if (this.$route.query && this.$route.query.redirect) {
                this.$router.replace(this.$route.query.redirect);
            } else {
                this.$router.back();
            }
        },

        goto(url) {
            this.$router.push({path: url});
        },

        gotoWith(url, redirect) {
            this.$router.push({path: url, query: {redirect: redirect}});
        },

        pretty(day) {
            return Time.pretty(day);
        },

        wait(promise) {
            let self = this;

			self.refreshing = true;
            self.reloading = true;
		    promise.then(function(){
				self.refreshing = false;
                self.reloading = false;
			}, function(err){
                if (err && err.message.length > 0) {
                    self.showToast(err.message);
                }

				self.refreshing = false;
                self.reloading = false;
			});

            return promise;
        },

        share() {
            if (this.$store.state.customers.me) {
                var referee = "?referee=" + this.$store.state.customers.me.id;
            } else {
                var referee = "";
            }

            this.$channel.setShareContent(
                '消拼', // 分享标题
                '乐享惠生活，拉近消费者之间的距离，让消费变得有热度。', // 分享描述
                'https://www.xpin1.com/shopping/#/home' + referee, // 分享链接
                'https://www.xpin1.com/shopping/images/logo.png' // 分享图标
            );
        },

        payShopping(product, price, quantity) {
            return this.$channel.pay({customer_id: this.$store.state.customers.me.id, product: product, price: price, quantity: quantity});
        },

        showToast (toast) {
            this.toast = toast

            if (this.toastTimer) {
                clearTimeout(this.toastTimer);
            }

            this.toastTimer = setTimeout(() => { this.toast = false }, 2000)
        },

        hideToast () {
            this.toast = false

            if (this.toastTimer) {
                clearTimeout(this.toastTimer)
            }
        }
    }
}