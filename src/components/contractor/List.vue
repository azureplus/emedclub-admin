<template>
	<div v-if="contractors.length > 0">
        <mu-list style="background:white;">
            <mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>
            <mu-list-item v-for="(contractor, index) in contractors" :key="contractor.id" :title="contractor.customer.name" disabled>
                <mu-avatar slot="left" :src="contractor.customer.avatar"  @click="onShowCustomer(contractor.customer)"/>
                <span slot="describe">
                    <span>
                        {{ contractor.toString() }}
                    </span>
                    <br />
                    <span v-if="(contractor.rating <= 0)">
                        <star-rating v-model="contractor.rating" :read-only="readOnly" :star-size="starSize" :show-rating="showRating" ></star-rating>
                    </span>
                </span>
                <a :href="callContractor(contractor)" slot="right" v-if="canCall(contractor)">
                    <mu-icon value="call" />
                </a>
            </mu-list-item>
        </mu-list>
	</div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import StarRating from 'vue-star-rating'

	export default {
		props: ['contractors', 'header'],

        computed: mapGetters({
            me: 'me'
        }),

        data() {
            return {
                readOnly: true,
                starSize: 15,
                showRating: false
            }
        },

        methods: {
            onShowCustomer(customer) {
                this.$router.push({path: customer.url});
            },

            callContractor(contractor) {
                return "tel:" + contractor.mobile
            },

            canCall(contractor) {
                return contractor.contract && contractor.contract.canCall(this.me, contractor);
            }
        },

        components: {
            'star-rating': StarRating
        }
	}
</script>