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
	removePaths();
	for (var i = 0; i < markers.length; i++)
		markers[i].setMap(null);
	markers = [];
	locations = [];
}

// Add lines to map
function drawPath(coords, stroke, weight) {
	var path = new google.maps.Polyline({
		path: coords,
		geodesic: true,
		strokeColor: stroke,
		strokeOpacity: 1.0,
		strokeWeight: weight,
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
	removePaths();

	if (isValidNodeAmount()) {
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
			var shortest = [[6371, 0, 0]];

			for (var j = 0; j < locations.length; j++) {
				if (i == j) 
					continue;

				var value = calculateDistance(locations[i], locations[j]);

				if (value < shortest[0][0]) {
					shortest[0][0] = value;
					shortest[0][1] = i;
					shortest[0][2] = j;
				}
			}

			for (var j = 0; j < locations.length; j++) {
				if (i == j) 
					continue;

				var value = calculateDistance(locations[i], locations[j]);

				if (value < 0.1 && distanceMatrix[i][j] == 0) {
					shortest.push([value, i, j]);
				}
			}

			for (var j = 0; j < shortest.length; j++) {
				distanceMatrix[shortest[j][1]][shortest[j][2]] = shortest[j][0];
				distanceMatrix[shortest[j][2]][shortest[j][1]] = shortest[j][0];

				var coords = [locations[shortest[j][1]], locations[shortest[j][2]]];
				drawPath(coords, "#000000", 1)
			}
		}

		console.log(locations);

		var startNode = parseInt(document.getElementById("start-node").value) - 1;
		var finishNode = parseInt(document.getElementById("finish-node").value) - 1;

		if (typeof(startNode) != "number" && typeof(finishNode) != "number") {
			alert("Please input a number!");
			return;
		}

		if (startNode < 0 || startNode > locations.length || finishNode < 0 || finishNode > locations.length) {
			alert("Please input a valid node!");
			return;
		}

		if (markers.length == 0) {
			for (var i = 0; i < locations.length; i++) {
				addMarker(locations[i]);
			}
		}

		if (startNode != finishNode) {
			var steps = modes == 0 ? ucs(startNode, finishNode, distanceMatrix) : aStar(startNode, finishNode, distanceMatrix, locations);
	
			var length = steps.cost;
			var path = steps.path;
			var coords = [];
	
			if (length != -1) {
				document
					.getElementById("length")
					.innerHTML = "Distance: " + Math.floor(length * 1000).toString() + " m";
		
				for (var i = 0; i < path.length; i++) {
					coords.push(locations[path[i]]);
				}
		
				var pathString = (path[0] + 1).toString();
				for (var i = 1; i < path.length; i++) {
					pathString += " → " + (path[i] + 1).toString();
				}
		
				document
					.getElementById("path-taken")
					.innerHTML = pathString;
		
				drawPath(coords, "#FF0000", 2);
			}
			else {
				document
					.getElementById("length")
					.innerHTML = "Length: not reachable";
	
				document
					.getElementById("path-taken")
					.innerHTML = "Path not reachable";
			}
		}
		else {
			document
				.getElementById("length")
				.innerHTML = "Length: 0";

			document
				.getElementById("path-taken")
				.innerHTML = "" + (startNode + 1).toString();
		}
	}
}

// Main function
async function initMap() {
	// Ignore this seems important
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

	// addMarker({ lat: -6.890327303831887 107.61034858365062 });

	// locations.push({ lat: -6.890327303831887 107.61034858365062 });
}

initMap();

// Runner function
var algorithm = document.getElementById("algorithm");
var modes = 0;

// Other stuff not fit in function
if (algorithm != null) {
	algorithm.addEventListener("click", function() {
		document
			.getElementById("ucs")
			.addEventListener("click", function() {
				algorithm.innerHTML = 'Uniform Cost Search';
				modes = 0;
		});
		
		document
			.getElementById("a-star")
			.addEventListener("click", function() {
				algorithm.innerHTML = 'A*';
				modes = 1;
		});
	});

	document
		.getElementById("find-shortest")
		.addEventListener("click", findShortestPath);
	
		document
		.getElementById("clear")
		.addEventListener("click", deleteMarker);

	document
		.getElementById("file-selector")
		.addEventListener("change",
			function(event) {
				const file = event.target.files[0];

				let reader = new FileReader();

				reader.readAsText(file);
				
				reader.onload = function() {
					var string = reader.result;

					string = string.split('\n');
	
					var length = parseInt(string[0]);

					locations = [];
					for (var i = 0; i < length; i++) {
						var loc = string[i + 1].split(' ');
						var coord = {lat: parseFloat(loc[0]), lng: parseFloat(loc[1])};
						
						locations.push(coord);
						addMarker(coord);
					}
				};
			}
		);
}

var theme = document.getElementById("bd-theme");

if (theme != null) {
	theme.addEventListener("click", function() {
		var element = document.getElementsByTagName("html")[0]
		var logo = document.getElementById("mode-logo")
	
		if (element.attributes["data-bs-theme"].value == "light") {
			element.setAttribute("data-bs-theme", "dark");
			logo.setAttribute("href", "#moon-stars-fill")
		}
		else {
			element.setAttribute("data-bs-theme", "light");
			logo.setAttribute("href", "#sun-fill")
		}
	});
}