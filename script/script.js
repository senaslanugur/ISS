// initilaize of satellite on map -- begin
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
// initilaize of satellite on map -- end

//map initilaize -- begin
var map = L.map('map').setView([lat,lon], 4);
var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png?access-token=PyTJUlEU1OPJwCJlW1k0NC8JIt2CALpyuj7uc066O7XbdZCjWEL3WYJIk6dnXtps', {
  attribution: '',
  minZoom: 2,
  maxZoom: 16,
	className: 'map-tiles',
  noWrap: true
});
basemap.addTo(map);
//map initilaize -- end

//icon of marker for satellite - begin
var greenIcon = L.icon({ //add this new icon
	 iconUrl: './asserts/satellite.png',
	 iconSize:     [50, 50], // size of the icon
	 iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	 popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var playerLoc = new L.Marker(map.getCenter()).setIcon(greenIcon).addTo(map);
//icon of marker for satellite - end


//satellite location on the map -- begin
var currentAutoMove = false; // needed to check in `movestart` event-listener if moved from interval or by user
var pauseAutoMove = false; // if true -> Stops moving map
var latitude,longitude;

setInterval(()=>{
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
//satellite location on the map -- end

// Path of ISS -- begin
// const  datas = [];
//
// $.ajax({
//     url: document.location.protocol + '//api.allorigins.win/get?url='+escape("https://www.astroviewer.net/iss/ws/orbit.php?sat=25544", true),
//     async: false,
//     dataType: 'json',
//     success: function(data) {
//       // console.log(data);
//       // console.log(JSON.parse(data.contents).orbitData)
//       data = JSON.parse(data.contents).orbitData
//       for(var i = 0;i<data.length;i++){
//           datas.push([data[i].lt,data[i].ln])
//       }
//
//     }
//
// });
// console.log(datas[0])
//
// var polyline = L.polyline(datas,{
//                 color: 'green',
//                 weight: 5,
//                 opacity:0.2 ,
//
//             }).addTo(map);

// Path of ISS -- end

//map updating -- begin
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
  	pauseAutoMove = false; // set flag, to stop moving map
  }
})
//map updating -- end

function Options(){
  alert("test")
}
