$(document).ready(function(){

	const street = $('#mapContainer').attr('data-street');
	const city = $('#mapContainer').attr('data-city');
	const postcode = $('#mapContainer').attr('data-postcode');

	var settings = {
	  "async": true,
	  "crossDomain": true,
	  "url": "https://us1.locationiq.com/v1/search.php?key=6ae0eab51d8118&street=" + street + "&city=" + city + "&postalcode=" + postcode + "&format=json",
	  "method": "GET"
	}

	$.ajax(settings).done(function (response) {
		console.log(street, city, postcode);
	  	console.log(response);
		let output = "<img src='https://maps.locationiq.com/v2/staticmap?key=pk.c19a1bd55283b8bba5be5da36edc5c03&center=" + response[0].lat + "," + response[0].lon + "&zoom=16&size=480x480&|icon:large-red-cutout&markers=" + response[0].lat + "," + response[0].lon + "'>";	  
		$('#mapContainer').html(output);
	});

});