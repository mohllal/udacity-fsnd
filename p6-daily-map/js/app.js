var map;
var defaultIcon;
var highlightedIcon;
var largeInfowindow;
var markers = [];
var polygon = null;
var app;
var drawingManager;

function mapError() {
	$('#filter-summary').text("Could not load Google Maps");
	$('#list').hide();
}

//function to initialize map
function initMap() {
	"use strict";
	var randomLat = getRandomInRange(0, 30, 3);
	var randomLng = getRandomInRange(0, 30, 3);
	//console.log(randomLat);
	//console.log(randomLng);

	map = new google.maps.Map(document.getElementById('map-box'), {
		center: new google.maps.LatLng(30.0444, 31.2357),
		zoom: 13,
		styles: styles,
		mapTypeControl: false
	});

	app = new AppViewModel();
	ko.applyBindings(app);

	app.filterResult('');
	//$('#filter-summary').empty();

	// Style the markers a bit. This will be our listing marker icon.
	defaultIcon = makeMarkerIcon('9b4dca');

	// Create a "highlighted location" marker color for when the user
	// mouses over the marker.
	highlightedIcon = makeMarkerIcon('723399');


	// Initialize the drawing manager.
	drawingManager = new google.maps.drawing.DrawingManager({
		drawingMode: google.maps.drawing.OverlayType.POLYGON,
		drawingControl: true,
		drawingControlOptions: {
			position: google.maps.ControlPosition.TOP_LEFT,
			drawingModes: [
				google.maps.drawing.OverlayType.POLYGON
			]
		}
	});

	// Add an event listener so that the polygon is captured,  call the
	// searchWithinPolygon function. This will show the markers in the polygon,
	// and hide any outside of it.
	drawingManager.addListener('overlaycomplete', function(event) {
		// First, check if there is an existing polygon.
		// If there is, get rid of it and remove the markers
		if (polygon) {
			polygon.setMap(null);
		}
		// Switching the drawing mode to the HAND (i.e., no longer drawing).
		drawingManager.setDrawingMode(null);
		// Creating a new editable polygon from the overlay.
		polygon = event.overlay;
		polygon.setEditable(true);
		// Searching within the polygon.
		searchWithinPolygon();
		// Make sure the search is re-done if the poly is changed.
		polygon.getPath().addListener('set_at', searchWithinPolygon);
		polygon.getPath().addListener('insert_at', searchWithinPolygon);
	});
}

//knockout ViewModel
function AppViewModel() {

	/*if (typeof google !== 'object' || typeof google.maps !== 'object') {} else {
	var infoWindow = new google.maps.InfoWindow();
	google.maps.event.addDomListener(window, 'load', foursquareApi);
}*/

	var infoWindow = new google.maps.InfoWindow();
	google.maps.event.addDomListener(window, 'load', foursquareApi);

	var self = this;
	self.restaurantList = ko.observableArray([]);
	self.polygonFilteredSet = ko.observableArray([]);
	self.filter = ko.observable('');
	self.filterResult = ko.observable('');
	self.area = ko.observable('Cairo');
	self.zoomToAreaResult = ko.observable('');
	self.latLng = ko.observable('30.0444, 31.2357');
	self.polygonMode = ko.observable(false);

	self.zoomToArea = function() {
		if (self.area() === '')
			self.zoomToAreaResult('You must provide an area!');
		else {
			zoomToArea(self.area());
			self.restaurantList([]);
			markers = [];
			foursquareApi();
		}
	};

	self.toggleDrawing = function() {
		toggleDrawing(drawingManager);
	};

	self.filteredRestaurantList = ko.pureComputed(function() {
		var results;

		if (self.polygonMode() === true) {
			//console.log(self.polygonFilteredSet().length);
			results = ko.utils.arrayFilter(self.polygonFilteredSet(), function(restaurant) {
				return restaurant.name.toLowerCase().filter(self.filter().toLowerCase());
			});

			//self.polygonFilteredSet([]);
		} else {
			results = ko.utils.arrayFilter(self.restaurantList(), function(restaurant) {
				return restaurant.name.toLowerCase().filter(self.filter().toLowerCase());
			});
		}

		self.restaurantList().forEach(function(restaurant) {
			restaurant.marker.setMap(null);
		});

		markers = [];
		results.forEach(function(restaurnat) {
			restaurnat.marker.setMap(map);
			markers.push(restaurnat.marker);
		});

		if (results.length > 0) {
			if (results.length == 1) {
				self.filterResult(results.length + " restaurant found!");
			} else {
				self.filterResult(results.length + " restaurants found!");
			}
		} else {
			self.filterResult("No restaurants found!");
		}
		return results;
	}).extend({
		notify: 'always'
	});
	self.filterResult("Please wait...");

	//function called when a cafe is clicked from the filtered list
	self.selectRestaurant = function(restaurant) {
		populateInfoWindow(restaurant.marker, infoWindow, restaurant.infoWindowData());
		restaurant.marker.setAnimation(google.maps.Animation.BOUNCE);
		restaurant.marker.setIcon(highlightedIcon);
		//console.log(restaurant.lat);
		self.restaurantList().forEach(function(unselected_restaurant) {
			if (restaurant != unselected_restaurant) {
				unselected_restaurant.marker.setAnimation(null);
				unselected_restaurant.marker.setIcon(defaultIcon);
			}
		});
	};

	function foursquareApi() {
		// load foursquare api
		var url = "https://api.foursquare.com/v2/venues/search";
		var param = $.param({
			'v': "20131016",
			'client_id': "QYMLS2F0HUDKEZC5DUJ2P11FLN4KNQCL5KXGO5QK44UFNK1F",
			'client_secret': "LDNUFDOVV551VUZMGTVDEAQBBGF5AVUR4RLPMVIWT24EQ0QN",
			'll': self.latLng(),
			'query': "restaurant",
			'intent': "checkin"
		});
		//console.log(url);

		var data;
		$.ajax({
			url: url,
			data: param,
			dataType: 'json',
			async: true,
		}).done(function(response) {
			data = response.response.venues;
			restaurants = [];
			data.forEach(function(restaurant) {
				restaurant = new RestaurantModel(restaurant);
				restaurants.push(restaurant);
			});
			self.restaurantList(restaurants);
			self.restaurantList().forEach(function(restaurant) {
				if (restaurant.map_latLng()) {
					google.maps.event.addListener(restaurant.marker, 'click', function() {
						self.selectRestaurant(restaurant);
					});
				}
			});
			//self.filteredRestaurantList(null);
		}).fail(function(response, status, error) {
			self.filterResult("Could not load restaurants");
			$('#list').hide();
		});
	}
}

var RestaurantModel = function(restaurant, map) {
	var self = this;
	self.name = restaurant.name;
	self.url = restaurant.url;

	self.lat = restaurant.location.lat;
	self.lng = restaurant.location.lng;

	self.map_latLng = function() {
		if (self.lat === 0 || self.lon === 0) {
			return null;
		} else {
			return new google.maps.LatLng(self.lat, self.lng);
		}
	};

	self.formattedAddress = restaurant.location.formattedAddress;
	self.formattedPhone = restaurant.contact.formattedPhone;

	self.checkinsCount = restaurant.stats.checkinsCount;
	self.usersCount = restaurant.stats.usersCount;

	self.marker = (function() {
		var marker;
		if (self.lat !== 0 && self.lng !== 0) {
			marker = createMarker();
		}
		return marker;
	})(self);

	self.infoWindowData = function() {
		return '<div class="window-content">' + (self.url === undefined ? '' : '<a href="' + self.url + '">') +
			'<span class="window-header"><h5>' + (self.name === undefined ? 'No name available' : self.name) + '</h5>' +
			'</span>' + '</a>' +
			'<h6>' + (self.formattedAddress === undefined ? 'No address available' : self.formattedAddress) + '</h6><br>' +
			'<h6>' + (self.formattedPhone === undefined ? 'No Contact Info' : self.formattedPhone) + '</h6>' +
			(self.checkinsCount === undefined ? '' : '<h6>Number of checkins: ' + self.checkinsCount + '</h6>') +
			(self.usersCount === undefined ? '' : '<h6>Number of users: ' + self.usersCount + '</h6>') +
			'</div>';
	};

	function createMarker() {
		var tempMarker = new google.maps.Marker({
			position: new google.maps.LatLng(self.lat, self.lng),
			map: map,
			icon: defaultIcon
		});

		// Push the marker to our array of markers.
		markers.push(tempMarker);
		// Two event listeners - one for mouseover, one for mouseout,
		// to change the colors back and forth.
		tempMarker.addListener('mouseover', function() {
			this.setIcon(highlightedIcon);
		});
		tempMarker.addListener('mouseout', function() {
			this.setIcon(defaultIcon);
		});

		return tempMarker;
	}

};

// Generate random lat and lng
function getRandomInRange(from, to, fixed) {
	return (Math.random() * (to - from) + from).toFixed(fixed) * 1;
	// .toFixed() returns string, so ' * 1' is a trick to convert to number
}

String.prototype.filter = function(other) {
	return this.indexOf(other) !== -1;
};


// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
		'|40|_|%E2%80%A2',
		new google.maps.Size(21, 34),
		new google.maps.Point(0, 0),
		new google.maps.Point(10, 34),
		new google.maps.Size(21, 34));
	return markerImage;
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow, content) {
	// Check to make sure the infowindow is not already opened on this marker.
	if (infowindow.marker != marker) {
		// Clear the infowindow content to give the streetview time to load.
		infowindow.setContent('');
		infowindow.marker = marker;
		// Make sure the marker property is cleared if the infowindow is closed.
		infowindow.addListener('closeclick', function() {
			if (infowindow.marker !== null)
				infowindow.marker.setAnimation(null);
			infowindow.marker = null;
		});
		var streetViewService = new google.maps.StreetViewService();
		var radius = 50;

		// Use streetview service to get the closest streetview image within
		// 50 meters of the markers position
		streetViewService.getPanoramaByLocation(marker.position, radius, function(data, status) {
			if (status == google.maps.StreetViewStatus.OK) {
				var nearStreetViewLocation = data.location.latLng;
				var heading = google.maps.geometry.spherical.computeHeading(
					nearStreetViewLocation, marker.position);
				infowindow.setContent('<div id="pano"></div>' + content);
				var panoramaOptions = {
					position: nearStreetViewLocation,
					pov: {
						heading: heading,
						pitch: 30
					}
				};
				var panorama = new google.maps.StreetViewPanorama(
					document.getElementById('pano'), panoramaOptions);
			} else {
				infowindow.setContent('<div>No Street View Found</div>' + content);
			}
		});
		// Open the infowindow on the correct marker.
		infowindow.open(map, marker);
	}
}

// This shows and hides (respectively) the drawing options.
function toggleDrawing(drawingManager) {
	if (drawingManager.map) {
		drawingManager.setMap(null);
		// In case the user drew anything, get rid of the polygon
		if (polygon !== null) {
			polygon.setMap(null);
		}
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].getMap() === null)
				markers[i].setMap(map);
		}
		app.polygonMode(false);
		app.polygonFilteredSet([]);
	} else {
		drawingManager.setMap(map);
	}
}

// This function hides all markers outside the polygon,
// and shows only the ones within it. This is so that the
// user can specify an exact area of search.
function searchWithinPolygon() {
	var filteredResult = [];
	for (var i = 0; i < markers.length; i++) {
		if (google.maps.geometry.poly.containsLocation(markers[i].position, polygon)) {
			markers[i].setMap(map);

			for (var j = 0; j < app.restaurantList().length; j++) {
				if (markers[i].getPosition().equals(app.restaurantList()[j].marker.getPosition()))
					filteredResult.push(app.restaurantList()[j]);
			}

		} else {
			markers[i].setMap(null);
		}
	}
	app.polygonMode(true);
	app.polygonFilteredSet(filteredResult);
}

// This function takes the input value in the find nearby area text input
// locates it, and then zooms into that area. This is so that the user can
// show all listings, then decide to focus on one area of the map.
function zoomToArea(address) {
	// Initialize the geocoder.
	var geocoder = new google.maps.Geocoder();
	// Geocode the address/area entered to get the center. Then, center the map
	// on it and zoom in
	geocoder.geocode({
		address: address
	}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			map.setCenter(results[0].geometry.location);
			map.setZoom(15);
			app.zoomToAreaResult('');
			var latLng = results[0].geometry.location.lat() + ',' + results[0].geometry.location.lng();
			app.latLng(latLng);
		} else {
			app.zoomToAreaResult('Could not find that location!');
		}
	});
}
