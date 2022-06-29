
let lat = ""
let lon = ""
$.ajax({
    url: "https://api.wheretheiss.at/v1/satellites/25544",
    async: false,
    dataType: 'json',
    success: function(data) {
        lat = data.latitude;
        lon = data.longitude
    }
});
var map = L.map('map').setView([lat,lon], 4);
var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png?access-token=PyTJUlEU1OPJwCJlW1k0NC8JIt2CALpyuj7uc066O7XbdZCjWEL3WYJIk6dnXtps', {
// var basemap = L.tileLayer('https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=PyTJUlEU1OPJwCJlW1k0NC8JIt2CALpyuj7uc066O7XbdZCjWEL3WYJIk6dnXtps', {
  attribution: '',

  minZoom: 2,
  maxZoom: 16,
	className: 'map-tiles',
  noWrap: true
});


basemap.addTo(map);

const  datas = [];

$.ajax({
    url: document.location.protocol + '//api.allorigins.win/get?url='+escape("https://www.astroviewer.net/iss/ws/orbit.php?sat=25544", true),
    async: false,
    dataType: 'json',
    success: function(data) {
      // console.log(data);
      // console.log(JSON.parse(data.contents).orbitData)
      data = JSON.parse(data.contents).orbitData
      for(var i = 0;i<data.length;i++){
          datas.push([data[i].lt,data[i].ln])
      }

    }

});
console.log(datas[0])

var greenIcon = L.icon({ //add this new icon
	 iconUrl: './asserts/satellite.png',
	 // shadowUrl: './assert/satellite.png',

	 iconSize:     [50, 50], // size of the icon
	 // shadowSize:   [25, 25], // size of the shadow
	 iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	 // shadowAnchor: [4, 62],  // the same for the shadow
	 popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var playerLoc = new L.Marker(map.getCenter()).setIcon(greenIcon).addTo(map);


var currentAutoMove = false; // needed to check in `movestart` event-listener if moved from interval or by user
var pauseAutoMove = false; // if true -> Stops moving map

var latitude,longitude;

setInterval(()=>{

	// var xmlhttp = new XMLHttpRequest();
  //
	// xmlhttp.onreadystatechange = function () {
	//     if (this.readyState == 4 && this.status == 200) {
	//         var myArr = this.responseText;
	// 				// console.log(JSON.parse(myArr.contents).iss_position)
  //         // var position = JSON.parse(myArr.contents).iss_position
	// 				latitude = myArr.latitude;
	// 				longitude = myArr.longitude;
  //
	// 				updatemap();
	//     }else{}
	// };
  //
  //
  // xmlhttp.open('GET', "https://api.wheretheiss.at/v1/satellites/25544");
	// xmlhttp.send();

  $.ajax({
      url: "https://api.wheretheiss.at/v1/satellites/25544",
      async: false,
      dataType: 'json',
      success: function(data) {
        console.log(data);
        var myArr = data;
    		latitude = myArr.latitude;
    		longitude = myArr.longitude;
        updatemap();

      }
  });
}, 2000)

var polyline = L.polyline(datas,{
                color: 'red',
                weight: 5,
                opacity: .7,
                dashArray: '20,15',
                lineJoin: 'round'
            }).addTo(map);

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
