import { ucs, aStar } from "./algorithm.js";

var map;
var locations = [];
var markers = [];
var paths = [];

// Convert degrees to radiant
function deg2rad(deg) {
	return deg / 180 * Math.PI;
}

// Calculate distance using haversine formula
function calculateDistance(firstCoord, secondCoord) {
	var R = 6371;
	var lat = deg2rad(firstCoord.lat - secondCoord.lat);
	var lng = deg2rad(firstCoord.lng - secondCoord.lng);

	var a = Math.sin(lat/2) * Math.sin(lat/2) +
    Math.cos(deg2rad(firstCoord.lat)) * Math.cos(deg2rad(secondCoord.lat)) * 
    Math.sin(lng/2) * Math.sin(lng/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	return d;
}

// Add marker function
function addMarker(coords) {
	// Add marker
	var marker = new google.maps.Marker({
		position: coords,
		map: map,
		label: (markers.length + 1).toString()
	});	

	markers.push(marker);
}

// Delete marker function
function deleteMarker() {
	markers[0].setMap(null);
	markers.splice(0, 1);
	locations.splice(0, 1);
}

// Add lines to map
function drawPath(coords, stroke) {
	var path = new google.maps.Polyline({
		path: coords,
		geodesic: true,
		strokeColor: stroke,
		strokeOpacity: 1.0,
		strokeWeight: 2,
	});

	path.setMap(map);

	paths.push(path);
}

// Remove lines from map
function removePaths() {
	for (var i = 0; i < paths.length; i++)
		paths[i].setMap(null);
	paths = [];
}

// Start counting
function isValidNodeAmount() {
	if (locations.length < 8) {
		alert("Please add " + (8 - locations.length).toString() + " more nodes first!");
		return false;
	}
	return true;
}

// Main function algorithm
function findShortestPath() {
	if (modes == 0) {
		alert("Please choose an algorithm first!");
		return;
	}

	if (isValidNodeAmount()) {
		removePaths();

		var distanceMatrix = [];
		for (var i = 0; i < locations.length; i++) {
			distanceMatrix[i] = new Array(locations.length);
		}

		for (var i = 0; i < locations.length; i++) {
			for (var j = 0; j < locations.length; j++) {
				distanceMatrix[i][j] = 0;
			}
		}

		for (var i = 0; i < locations.length; i++) {
			var shortest = [6371*2, 0, 0];

			for (var j = i+1; j < locations.length; j++) {
				var value = calculateDistance(locations[i], locations[j]);

				if (value < shortest[0]) {
					shortest = [value, i, j];
				}
			}
			
			distanceMatrix[shortest[1]][shortest[2]] = shortest[0];
			distanceMatrix[shortest[2]][shortest[1]] = shortest[0];

			var coords = [locations[shortest[1]], locations[shortest[2]]];
			console.log(coords);
			drawPath(coords, "#000000")
		}

		var steps = modes == 1 ? ucs(0, locations.length-1, distanceMatrix) : aStar(0, locations.length-1, distanceMatrix);

		var length = steps.cost;
		var path = steps.path;
		var coords = [];

		for (var i = 0; i < path.length; i++) {
			coords.push(locations[path[i]]);
		}

		drawPath(coords, "#FF0000");
	}
}

// Main function
async function initMap() {
	// Ignore this, seems important
	const { Map } = await google.maps.importLibrary("maps");

	// Map options
	const options = {
		zoom: 18,
		center: { lat: -6.890327303831887, lng: 107.61034858365062 }
	};

	// New map
	map = new Map(document.getElementById("map"), options);

	// Add marker when map is clicked
	google.maps.event.addListener(map, "click", 
		function(event) {
			var latVal = event.latLng.lat();
			var lngVal = event.latLng.lng();

			addMarker({lat: latVal, lng: lngVal});

			locations.push({lat: latVal, lng: lngVal});
		}
	);

	addMarker({ lat: -6.890327303831887, lng: 107.61034858365062 });

	locations.push({ lat: -6.890327303831887, lng: 107.61034858365062 });
}

initMap();

// Runner function
var algorithm = document.getElementById("algorithm");
var modes = 0;

algorithm.addEventListener("click", function() {
	document
		.getElementById("ucs")
		.addEventListener("click", function() {
			algorithm.innerHTML = 'UCS';
			modes = 1;
	});
	
	document
		.getElementById("a-star")
		.addEventListener("click", function() {
			algorithm.innerHTML = 'A-Star';
			modes = 2;
	});
});

document
	.getElementById("find-shortest")
	.addEventListener("click", findShortestPath);

document
	.getElementById("clear")
	.addEventListener("click", removePaths);