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

    var ourRow = document.getElementById('row');
    ourRow.innerHTML = '';
    var ourDate = document.getElementById('input-date');
    ourDate.value = null;

}

var apiKey = "lRkz7VJwmEAEV0pdPXPRa74TUKrZfMQyX8fLO2tU";

function loadImages(_pageNo) {

    var pageNo = _pageNo;

    var cameraSelect = document.getElementById('select-camera');
    var cameraSelectValue = cameraSelect.options[cameraSelect.selectedIndex].value;

    var ourDate = document.getElementById('input-date').value;
    ourDate = ourDate.replace(new RegExp('/', 'g'), '-');

    var ourRow = document.getElementById('row');

    if (typeof ourDate === undefined || ourDate === null || ourDate == '') {

    ourRow.innerHTML = '<p>Unfortunately, no images were found for these search terms.</p>'

    }

    if (typeof pageNo == undefined || pageNo == null) {

    if (typeof ourDate !== undefined && ourDate !== null && cameraSelectValue !== 'All') {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&camera='+cameraSelectValue+'&api_key='+apiKey, false);
        xhr.setRequestHeader('X-Auth-Token', apiKey);
        xhr.send();

    } else if (typeof ourDate !== undefined && ourDate !== null && ourDate != '' && cameraSelectValue === 'All') {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&api_key='+apiKey, false);
        xhr.setRequestHeader('X-Auth-Token', apiKey);
        xhr.send();

    }

    } else {

    if (typeof ourDate !== undefined && ourDate !== null && cameraSelectValue !== 'All') {


        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&camera='+cameraSelectValue+'&page='+pageNo+'&api_key='+apiKey, false);
        xhr.setRequestHeader('X-Auth-Token', apiKey);
        xhr.send();

    } else if (typeof ourDate !== undefined && ourDate !== null && cameraSelectValue === 'All') {

        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date='+ourDate+'&page='+pageNo+'&api_key='+apiKey, false);
        xhr.setRequestHeader('X-Auth-Token', apiKey);
        xhr.send();

    }

    }

    if (xhr.status == 400 || xhr.status == 500) {

    ourRow.innerHTML = '<p>Unfortunately, no images were found for these search terms.</p>'

    }

    if (xhr.readyState == 4 && xhr.status == 200) {

    var ourData = JSON.parse(xhr.responseText);

    var beginTable = '<table>';

    for (i = 1; i < ourData.photos.length; i++) {

        if (i == 1) {

        beginTable += '<tr><td><a href="'+ourData.photos[i].img_src+'" title="Open Image in New Tab/Window" target="_blank"><img src="'+ourData.photos[i].img_src+'" class="img-thumbnail" data-toggle="tooltip" data-placement="bottom" title="Image captured by Curiosity\'s '+ourData.photos[i].camera.full_name+' on Mars Sol '+ourData.photos[i].sol+' (Approx. Earth Date '+ourData.photos[i].earth_date+')" /></a></td>';

        } else if (i > 1 && i < 5) {

        beginTable += '<td><a href="'+ourData.photos[i].img_src+'" title="Open Image in New Tab/Window" target="_blank"><img src="'+ourData.photos[i].img_src+'" class="img-thumbnail" data-toggle="tooltip" data-placement="bottom" title="Image captured by Curiosity\'s '+ourData.photos[i].camera.full_name+' on Mars Sol '+ourData.photos[i].sol+' (Approx. Earth Date '+ourData.photos[i].earth_date+')" /></a></td>';

        } else if (i % 5 == 0) {

        beginTable += '<td><a href="'+ourData.photos[i].img_src+'" title="Open Image in New Tab/Window" target="_blank"><img src="'+ourData.photos[i].img_src+'" class="img-thumbnail" data-toggle="tooltip" data-placement="bottom" title="Image captured by Curiosity\'s '+ourData.photos[i].camera.full_name+' on Mars Sol '+ourData.photos[i].sol+' (Approx. Earth Date '+ourData.photos[i].earth_date+')" /></a></td></tr>';

        } else if (i % 5 == 1) {

        beginTable += '<tr><td><a href="'+ourData.photos[i].img_src+'" title="Open Image in New Tab/Window" target="_blank"><img src="'+ourData.photos[i].img_src+'" class="img-thumbnail" data-toggle="tooltip" data-placement="bottom" title="Image captured by Curiosity\'s '+ourData.photos[i].camera.full_name+' on Mars Sol '+ourData.photos[i].sol+' (Approx. Earth Date '+ourData.photos[i].earth_date+')" /></a></td>';

        } else {

        beginTable += '<td><a href="'+ourData.photos[i].img_src+'" title="Open Image in New Tab/Window" target="_blank"><img src="'+ourData.photos[i].img_src+'" class="img-thumbnail" data-toggle="tooltip" data-placement="bottom" title="Image captured by Curiosity\'s '+ourData.photos[i].camera.full_name+' on Mars Sol '+ourData.photos[i].sol+' (Approx. Earth Date '+ourData.photos[i].earth_date+')" /></a></td>';

        }

    }

    beginTable += '</table>';

    ourRow.innerHTML = beginTable;

    if (ourData.photos.length == 25 && (typeof pageNo == undefined || pageNo == null)) {

        ourRow.innerHTML += '<button type="button" class="btn btn-default pull-right" onclick="loadImages(2)">Next Page <i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>';

    } else if (ourData.photos.length == 25 && typeof pageNo != undefined && pageNo != null) {

        ourRow.innerHTML += '<button type="button" class="btn btn-default pull-right" onclick="loadImages('+(pageNo + 1)+')">Next Page <i class="fa fa-arrow-circle-right" aria-hidden="true"></i></button>';

    }

    $('[data-toggle="tooltip"]').tooltip();

    }

}