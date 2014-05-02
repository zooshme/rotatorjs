App = Ember.Application.create();

App.ApplicationView = Ember.View.extend({
	classNames: [''],
});

App.Router.map(function() {

});

App.IndexRoute = Ember.Route.extend({
	model: function() {
		return $.getJSON('../data.json');
	},
	renderTemplate: function() {
		this.render('index');
	}
});

App.IndexController = Ember.ArrayController.extend({
	init: function() {
		this._super();
		this.startRotation();
	},
	playing: false,
	slide: function() {
		var counter = this.get('counter');
		return this.get('model').objectAt(counter);
	}.property('model', 'counter'),

	playRotation: function() {
		this.startRotation();
	},

	pauseRotation: function() {
		clearInterval(this.interval);
		this.set('playing', false);
	},
	
	slidesCount: function() {
		return this.get('model').length;
	}.property('model'),
	
	counter: 0,

	startRotation: function() {
		this.interval = setInterval(this.rotate.bind(this), 3000);
		this.set('playing', true)
	},
	
	rotate: function() {
		var counter = this.get('counter');
		var slidesCount = this.get('slidesCount');

		if (counter < slidesCount - 1) {
			++counter;	
		} else {
			counter = 0;
		}
		this.set('counter', counter);
	},
	actions: {
		goToNext: function() {
			var counter = this.get('counter');
			var slidesCount = this.get('slidesCount');

			if (counter < slidesCount - 1) {
				this.set('counter', ++counter);
			} else {
				this.set('counter', 0);
			}

			this.pauseRotation();
		},
		goToPrevious: function() {
			var counter = this.get('counter');
			var slidesCount = this.get('slidesCount');

			if (counter > 0) {
				this.set('counter', --counter);
			} else {
				this.set('counter', slidesCount - 1);
			}

			this.pauseRotation();
		}, 
		play: function() {
			this.playRotation();
		},
		pause: function() {
			this.pauseRotation();
		}
	}

	
})

App.SlideView = Ember.View.extend({
	src: function() {
		return '../images/' + this.get('controller.slide.poster');
	}.property('controller.slide.poster'),
	templateName: 'slide',
	classNames: ['slide'],
	didInsertElement: function() {
		console.log(this);
	},
	willAnimateIn: function() {
		this.$().addClass('will-animate-in');
	},
	animateIn: function() {
		this.$().addClass('animate-in');
	},
	willAnimateOut: function() {
		this.$().addClass('animate-out');
	},
	rerenderView: function() {
		this.remove();
	}.observes('controller.counter'),
});

App.IndexView = Ember.View.extend({
	templateName: 'index',
});

App.SlidesView = Ember.ContainerView.extend({
	childViews: ['slideView'],
	slideView: function() {
		return App.SlideView.create();
	}.observes('controller.counter')

})



App.PaginationView = Ember.CollectionView.extend({
	tagName: 'ol',
	contentBinding: 'controller.model',
	classNames: ['pagination'],
	itemViewClass: Ember.View.extend({
		tagName: 'li',
		classNameBindings: ['active'],
		active: function() {
			if (this.get('controller.counter') == this.get('contentIndex')) {
				return true
			}
		}.property('controller.counter'),
		classNames: ['pagination-item'],
		click: function() {
			this.set('controller.counter', this.get('contentIndex'));
			this.get('controller').pauseRotation();
		}
	})
})
