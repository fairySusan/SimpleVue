import SimpleVue from '../vue'

new SimpleVue({
  el: '#app',
  data: {
    title: 'this is title',
    name: 'this is name',
		count: 1,
		firstName: '王',
		secondName: '然',
  },
  methods: {
    clickMe: function () {
			this.count ++;
    }
  },
	mounted: function () {},
	watch: {
		secondName: function(newVal, oldValue) {
			console.log('secondName changed !');
		}
	},
	computed: {
		fullName: function() {
			return this.firstName + this.secondName;
		}
	}
})