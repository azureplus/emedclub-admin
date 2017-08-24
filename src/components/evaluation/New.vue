<template>
    <baselayout :progressing="refreshing" :toast="toast">
        <mu-appbar title="活动评价" slot="header">
            <mu-icon-button icon="keyboard_arrow_left" slot="left" @click="back"/>
        </mu-appbar>  

        <mu-content-block v-if="evaluation">
            <mu-list>
                <mu-list-item>
                    <star-rating v-model="evaluation.rating" :show-rating="showRating"></star-rating>
                </mu-list-item>

                <mu-list-item>
                    <mu-text-field label="评价内容" v-model="evaluation.comment" multiLine :rows="2" :rowsMax="6" fullWidth />
                </mu-list-item>

                <mu-list-item>
                    <mu-raised-button label="评价" fullWidth @click="onEvaluate"/>
                </mu-list-item>
            </mu-list>
        </mu-content-block>
    </baselayout>
</template>

<script>
    import BaseLayout from '../BaseLayout'
    import api from '../../api'
    import { mapGetters, mapActions } from 'vuex'
    import Mixin from '../../mixin'
    import StarRating from 'vue-star-rating'
    import Evaluation from '../../model/Evaluation'

    export default {
        mixins: [Mixin],

        computed: mapGetters({
            me: 'me'
        }),

        data() {
            return {
                evaluation: null,
                contractor: null,
                showRating:false
            }
        },

        methods: {
            onInitialize: function() {
                this.evaluation = new Evaluation();
                this.evaluation.customer_id = this.me.id;
                this.evaluation.contractor_id = this.$route.query.contractor_id;
                this.evaluation.activity_id = this.$route.query.activity_id;

                var self = this;
                api.queryOne("Contractor", self.$route.query.contractor_id).then(function(contractor){
                    self.contractor = contractor;
                })
            },

            onUpdate() {
                this.onInitialize();
            },
            
            onEvaluate: function() {
                var self = this;

                self.wait(api.save(self.evaluation)).then(function(e){
                    self.contractor.rating  = e.rating;
                    self.contractor.comment = e.comment;
                    self.contractor.state   = 3;
                    self.wait(api.save(self.contractor)).then(function(c){              
                        self.back();
                    })
                })
            },
        },

        components: {
            'baselayout': BaseLayout,
            'star-rating': StarRating
        }
    }
</script>