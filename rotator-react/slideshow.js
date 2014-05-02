/** @jsx React.DOM */

var Transition = React.addons.CSSTransitionGroup;

var Slide = React.createClass({
	render: function() { 
		return (
			<div className="slide">
				<img className="poster" src={"../images/" + this.props.data.poster} />
				<h3 className="caption">{this.props.data.caption}</h3>
				<div className="description">{this.props.data.description}</div>
			</div>
		)
	}
});

var Tooltip = React.createClass({
	render: function() {
		
	}
});

var Empty = React.createClass({
	render: function() {
		return (
			<div><img src="../images/loading.gif"/></div>
		)
	}
})

var PageItem = React.createClass({
	render: function() {
		var status = this.props.index == this.props.counter ? 'active' : 'inactive'

		return (
			<li className={status + " pagination-item"} onClick={this.props.onClick}>{this.props.index}</li>
		)
	}
});

var PlayButton = React.createClass({
	render: function() {
		return (
			<span className="entypo-play" data-text="play" onClick={this.props.onClick}></span>
		)
	}
});

var PauseButton = React.createClass({
	render: function() {
		return (
			<span className="entypo-pause" data-text="play" onClick={this.props.onClick}></span>
		)
	}
});

var PreviousButton = React.createClass({
	render: function() {
		return (
			<span className="entypo-left-open-mini" data-text="left-open-mini" onClick={this.props.onClick}></span>
		)
	}
});

var NextButton = React.createClass({
	render: function() {
		return (
			<span className="entypo-right-open-mini" data-text="right-open-mini" onClick={this.props.onClick}></span>
		)
	}
});

var Slideshow = React.createClass({
	getInitialState: function() {
		return {
			data: [],
			currentSlide: {
				id: 0
			},
			counter: 0,
			playing: false
		}
	},
	goToPage: function(index) {
		var data = this.state.data;
		this.setState({counter: index, currentSlide: data[index]});
		this.pauseRotation();
	},
	getData: function() {
		var that = this;
		var request = $.getJSON('./data.json');
		request.then(function(data) {
			that.setState({data: data, currentSlide: data[0]});
		});
	},
	componentWillMount: function() {
		this.getData();
		this.startRotation();

	},
	componentWillUnmount: function() {
		clearInterval(this.interval);
	},
	startRotation: function() {
		this.interval = setInterval(this.rotate, 3000);
		this.setState({ playing: true });
	},
	pauseRotation: function() {
		clearInterval(this.interval)
		this.setState({ playing: false });
	},
	rotate: function() {
		var data = this.state.data;
		var counter = this.state.counter;
		var slidesCount = this.state.data.length;

		if (counter < slidesCount - 1) {
			++counter; 
		} else {
			counter = 0;
		}

		this.setState({counter: counter, currentSlide: data[counter]});
	},
	goToPrevious: function() {
		var data = this.state.data;
		var slidesCount = this.state.data.length; 
		var counter = this.state.counter;

		if (counter > 0) {
			--counter;
		} else {
			counter = slidesCount - 1;
		}
		this.setState({counter: counter, currentSlide: data[counter]});
		this.pauseRotation();
	}, 
	goToNext: function() {
		this.rotate();
		this.pauseRotation();
	}, 
	render: function() {
		var that = this;
		pageItems = this.state.data.map(function(slide, i) {
			var boundClick = that.goToPage.bind(that, i)
			return (<PageItem key={slide.id} index={i} counter={that.state.counter} onClick={boundClick} />)
		});

		playButton = <PlayButton onClick={this.startRotation} />
		pauseButton = <PauseButton onClick={this.pauseRotation} />
		previousButton = <PreviousButton onClick={this.goToPrevious} />
		nextButton = <NextButton onClick={this.goToNext} />

		slide = <Slide key={this.state.currentSlide.id} data={this.state.currentSlide} />
	
		return (<div className="slideshow">
			<div className="slides">

				<Transition transitionName="example">
					{slide}
				</Transition>
			</div>
			<ol className="pagination">
				{pageItems}
			</ol>
			<div className="button">
				{this.state.playing ? pauseButton : playButton}
			</div>
			<div className="previous">
				{previousButton}
			</div>

			<div className="next">
				{nextButton}
			</div>
		</div>)
	
	}
});

React.renderComponent(
	<Slideshow />,
	document.getElementById('slideshow')
);