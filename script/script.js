var map = L.map('map').setView([0,0], 4);
var basemap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
  attribution: '',
  minZoom: 2,
  maxZoom: 16,
	className: 'map-tiles'
});

// var basemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
//   attribution: 'Basemap (c) <a href="http://openstreetmap.org">OpenStreetMap</a>',
//   minZoom: 2,
//   maxZoom: 16,
// 	className: 'map-tiles'
// });

basemap.addTo(map);

var greenIcon = L.icon({ //add this new icon
	 iconUrl: './asserts/satellite.png',
	 // shadowUrl: 'satellite.png',

	 iconSize:     [50, 50], // size of the icon
	 // shadowSize:   [50, 64], // size of the shadow
	 iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	 // shadowAnchor: [4, 62],  // the same for the shadow
	 popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var playerLoc = new L.Marker(map.getCenter()).setIcon(greenIcon).addTo(map);


var currentAutoMove = false; // needed to check in `movestart` event-listener if moved from interval or by user
var pauseAutoMove = false; // if true -> Stops moving map

var latitude,longitude;

setInterval(()=>{

	var xmlhttp = new XMLHttpRequest();

	xmlhttp.onreadystatechange = function () {
	    if (this.readyState == 4 && this.status == 200) {
	        var myArr = JSON.parse(this.responseText);
					console.log(myArr.iss_position)

					latitude = myArr.iss_position.latitude;
					longitude = myArr.iss_position.longitude;

					updatemap();
	    }else{}
	};

	xmlhttp.open('GET','http://api.open-notify.org/iss-now.json',false);
	xmlhttp.send();


}, 1000)


function updatemap() {  // Update the current player location on map
    playerLoc.setLatLng([latitude,longitude]);

	if(!pauseAutoMove){
    currentAutoMove = true; // Set flag, that currently map is moved by interval
    map.panTo([latitude,longitude]);
    currentAutoMove = false; // Remove flag, that currently map is moved by interval
  }
}


map.on('movestart',(e)=>{
	console.log(e, currentAutoMove);
  if(!currentAutoMove){ // Check if map is moved by interval or by user
  	pauseAutoMove = true; // set flag, to stop moving map
  }
})
