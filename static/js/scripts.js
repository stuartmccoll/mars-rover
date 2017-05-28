window.onload = function() {

    $('#input-date').datepicker({
    format: "yyyy/mm/dd",
    autoclose: true
    });

    $('#aboutModal').on('shown.bs.modal', function () {
        $('#myInput').focus()
    });

}

function clearResults() {

    $('#row').html('');
    $('#input-date').val('');
    $('#select-camera').val('All');

}

var apiKey = "lRkz7VJwmEAEV0pdPXPRa74TUKrZfMQyX8fLO2tU";

function loadImages(pageNo) {

    var cameraSelectValue = $('#select-camera option:selected').val();

    var ourDate = $('#input-date').val();
    ourDate = ourDate.replace(new RegExp('/', 'g'), '-');

    if (typeof ourDate === undefined || ourDate === null || ourDate === '')
        ourRow.innerHTML = '<p>Unfortunately, no images were found for these search terms.</p>'

    if (typeof pageNo == undefined || pageNo == null) {

        if (typeof ourDate !== undefined && ourDate !== null && cameraSelectValue !== 'All') {

            $.ajax({
                url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&camera='+cameraSelectValue+'&api_key='+apiKey,
                headers: {
                    'X-Auth-Token' : apiKey
                }
            }).done(function(msg){
                successCallback(msg);
            });

        } else if (typeof ourDate !== undefined && ourDate !== null && ourDate != '' && cameraSelectValue === 'All') {

            $.ajax({
                url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&api_key='+apiKey,
                headers: {
                    'X-Auth-Token' : apiKey
                }
            }).done(function(msg){
                successCallback(msg);
            });

        }

    } else {

        if (typeof ourDate !== undefined && ourDate !== null && cameraSelectValue !== 'All') {

            $.ajax({
                url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&camera='+cameraSelectValue+'&page='+pageNo+'&api_key='+apiKey,
                headers: {
                    'X-Auth-Token' : apiKey
                }
            }).done(function(msg){
                successCallback(msg);
            });

        } else if (typeof ourDate !== undefined && ourDate !== null && cameraSelectValue === 'All') {

            $.ajax({
                url: 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&page='+pageNo+'&api_key='+apiKey,
                headers: {
                    'X-Auth-Token' : apiKey
                }
            }).done(function(msg){
                successCallback(msg);
            });

        }

    }

}       

function successCallback(msg) {

    var ourRow = $('#row');

    if (msg.photos.length === 0) {
        ourRow.html('<p>Unfortunately, no images were found for these search terms.</p>');
    } else {

        var beginTable = '<table>';

        for (i = 1; i < msg.photos.length; i++) {

            var imageHTML = '<a href="'+msg.photos[i].img_src+'" title="Open Image in New Tab/Window" target="_blank"><img src="'+msg.photos[i].img_src+'" class="img-thumbnail" data-toggle="tooltip" data-placement="bottom" title="Image captured by Curiosity\'s '+msg.photos[i].camera.full_name+' on Mars Sol '+msg.photos[i].sol+' (Approx. Earth Date '+msg.photos[i].earth_date+')" /></a>';

            if (i === 1) {
                beginTable += '<tr><td>'+imageHTML+'</td>';
            } else if (i > 1 && i < 5) {
                beginTable += '<td>'+imageHTML+'</td>';
            } else if (i % 5 == 0) {
                beginTable += '<td>'+imageHTML+'</td></tr>';
            } else if (i % 5 == 1) {
                beginTable += '<tr><td>'+imageHTML+'</td>';
            } else {
                beginTable += '<td>'+imageHTML+'</td>';
            }

        }

        beginTable += '</table>';

        ourRow.html(beginTable);

        if (msg.photos.length == 25 && (typeof pageNo == undefined || pageNo == null)) {

            ourRow.innerHTML += '<button type="button" class="btn btn-default pull-right" onclick="loadImages(2)">Next Page <i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>';

        } else if (msg.photos.length == 25 && typeof pageNo != undefined && pageNo != null) {

            ourRow.innerHTML += '<button type="button" class="btn btn-default pull-right" onclick="loadImages('+(pageNo + 1)+')">Next Page <i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>';

        }

        $('[data-toggle="tooltip"]').tooltip();
    
    }

}