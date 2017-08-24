<template>
    <mu-list v-if="evaluations.length > 0">
        <mu-sub-header v-if="header && header.length > 0">{{header}}</mu-sub-header>
        <mu-list-item v-for="(evaluation, index) in evaluations" :key="evaluation.id" :title="evaluation.contractor.customer.name" disabled>
            <mu-avatar slot="left" :src="evaluation.contractor.customer.avatar"  @click="onShowCustomer(evaluation.contractor.customer)"/>
            <span slot="describe">
                <span>
                    {{ evaluation.comment }}
                </span>
                <br />
                <span>
                    <star-rating v-model="evaluation.rating" :read-only="readOnly" :star-size="starSize" :show-rating="showRating" ></star-rating>
                </span>
            </span>
        </mu-list-item>
    </mu-list>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    import StarRating from 'vue-star-rating'

	export default {
		props: ['evaluations', 'header'],

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
        },

        components: {
            'star-rating': StarRating
        }
	}
</script>