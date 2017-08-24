<template>
	<div v-if="chats.length > 0">
		<mu-content-block>
			<mu-list>
				<mu-list-item v-for="chat in chats" :key="chat.id">
					<mu-avatar :src="chat.customer.avatar" slot="leftAvatar"  @click="onShowCustomer(chat.customer)"/>
					<span slot="describe">
						<span style="color: rgba(0, 0, 0, .87);font-size:small;">{{chat.customer.name + " " + pretty(chat.create_time)}}</span><br/>
						<span style="font-size:normal;">{{chat.content}}</span>
					</span>
				</mu-list-item>
			</mu-list>
		</mu-content-block>
	</div>
</template>

<script>
	import Time from '../../util/date'

	export default {	
		props: ['chats'],

		methods: {
            onShowCustomer(customer) {
                this.goto(customer.url);
            },

	        pretty(day) {
	            return Time.pretty(day);
	        }		
		},
	}
</script>
