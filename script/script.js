//map initilaize -- begin
var info = get_info()
var map = L.map('map').setView([info[0],info[1]], 3);
var basemap = L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png?access-token=PyTJUlEU1OPJwCJlW1k0NC8JIt2CALpyuj7uc066O7XbdZCjWEL3WYJIk6dnXtps', {
  attribution: '',
  minZoom: 2,
  maxZoom: 16,
	className: 'map-tiles',
  // noWrap: true
});
basemap.addTo(map);
//map initilaize -- end

//icon of marker for satellite - begin
var greenIcon = L.icon({ //add this new icon
	 iconUrl: './asserts/satellite2.png',
	 iconSize:     [40, 40], // size of the icon
	 iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
	 popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});
var playerLoc = new L.Marker(map.getCenter()).setIcon(greenIcon).addTo(map).on('click', Information);;
//icon of marker for satellite - end


//satellite location on the map -- begin
var currentAutoMove = false; // needed to check in `movestart` event-listener if moved from interval or by user
var pauseAutoMove = false; // if true -> Stops moving map
var latitude,longitude;

setInterval(()=>{
  var info = get_info()
  latitude = info[0];
  longitude = info[1];
  updatemap();
}, 2000)
//satellite location on the map -- end

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


// Path of ISS -- begin
function see_path(){
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

var polyline = L.polyline(datas,{
                color: 'green',
                weight: 6,
                opacity:0.2 ,
            }).addTo(map);
}
// Path of ISS -- end

//Options button attribution -- begin
function Options(){
  Swal.fire({
    title: 'Options',
    imageUrl: './asserts/satellite2.png',
    imageAlt: 'Custom image',
    imageHeight: 80,
    imageWidth: 80,
    html:
        '<button type="button" role="button"  onClick=who_iss() style="background-color:black;color:orange;">' + 'Who are in iss' + '</button>      ' +
        '<button type="button" role="button"  onClick=another() style="background-color:black;color:orange;">' + 'Another' + '</button>',
    showCancelButton: false,
    showConfirmButton: false
})
}
//Options button attribution -- end

//Click satellite's icon -- begin
function Information(){
  var info = get_info()
  let timerInterval
  Swal.fire({
    toast:true,
    title: 'Current Information About ISS',
    html: '<b style="color:orange">Latitude: </b>'+info[0]+'<br><b style="color:orange">Longitude: </b>'+info[1]+'<br><b style="color:orange">Visibility: </b>'+info[2]+'<br><b style="color:orange">Velocity: </b>'+info[3]+" km/h",
    imageUrl: './asserts/satellite2.png',
    imageHeight: 80,
    imageWidth: 80,
    imageAlt: 'Custom image',
  })
}
//Click satellite's icon -- end


// get location(lat,lon), visibility and velocity information -- begin
function get_info() {
  var lat = ""
  var lon = ""
  var visibility = ""
  var velocity = ""
  $.ajax({
      url: "https://api.wheretheiss.at/v1/satellites/25544",
      async: false,
      dataType: 'json',
      success: function(data) {
        // console.log(data);
        var myArr = data;
        lat = myArr.latitude
        lon = myArr.longitude
        visibility = myArr.visibility
        velocity = myArr.velocity
      }
  });
  return [lat, lon, visibility, velocity];
}
// get location(lat,lon), visibility and velocity information -- end

// get current astronots in iss -- begin
function get_astro(){
  var astro = ""
  $.ajax({
      url: document.location.protocol + '//api.allorigins.win/get?url='+escape("http://api.open-notify.org/astros.json", true),
      async: false,
      dataType: 'json',
      success: function(data) {
        astro = (JSON.parse(data.contents).people)
      }
  });
  var html = "<ul>"
  for (var i=0;i<astro.length;i++){
      html += "<li><b style='color:orange;'> Name: </b>" + astro[i].name + " <br><b style='color:orange;'>Craft: </b>" +  astro[i].craft +"</li>"
  }
  html += "</ul>"
  return html
}
// get current astronots in iss -- end

// set astro to alert -- begin
function who_iss(){
  var astro = get_astro()

  Swal.fire({
    toast:true,
    title: 'Astronauts Currently in the ISS',
    html: astro,
    imageUrl: './asserts/satellite2.png',
    imageHeight: 80,
    imageWidth: 80,
    imageAlt: 'Custom image',
  })

}
// set astro to alert -- end

// another settings -- begin
function another(){
  Swal.fire({
    toast:true,
    title: 'Astronauts Currently in the ISS',
    html: "in developing",
    imageUrl: './asserts/satellite2.png',
    timer:2000,
    timerProgressBar: true,
    imageHeight: 80,
    imageWidth: 80,
    imageAlt: 'Custom image',
  })

}
// another settings -- end
