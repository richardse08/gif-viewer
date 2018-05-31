$(document).ready(function() {

    var currentPage = 1; // keep track of state of page that user is currently on
    var totalPages; // keep track of the number of pages in case gifs folder changes 

    // create function for showing the loader gif *** this will also hide/show the gif row ***
    function toggleLoader(direction) {
        var loader = $('.js-loader');

        // if direction is on then SHOW loader and HIDE the gif row
        if(direction === 'on') {
            loader.removeClass('display-none');
            toggleGifRow('hide'); // pass in hide as direction to the gif row display control 
            return;
        }

        // if direction is off then HIDE the loader and SHOW the gif row
        else if(direction === 'off') {

            // throttle show loader to emulate a slow response
            setTimeout(function() {
                loader.addClass('display-none');
                toggleGifRow('show'); // pass in show as direction to the gif row display control 
            }, 500);
        }
    }

    // HIDE / SHOW GIF ROW DISPLAY CONTROL
    function toggleGifRow(direction) {
        var gifRow = $('.js-gif-row-target');

        // if direction is HIDE then HIDE the gif row
        if(direction === 'hide') { 
            gifRow.addClass('display-none');
        }

        // if direction is SHOW then SHOW the gif row
        else if(direction === 'show') {
            gifRow.removeClass('display-none');
        }
    }

    // BUTTON DISPLAY CONTROLLER *** this only changes which buttons are shown in header ***
    function setActiveButton(activeButton) {
        
        // Set all buttons to default
        var setAllToDefault = function() {
            var allButtons = $('.js-button-group a');
            allButtons.addClass('btn-default');

            for(var i = 0; i < allButtons.length; i++) {
                var button = $(allButtons[i]);
                button.addClass('btn-default');
                button.removeClass('btn-primary');
            }
        }

        setAllToDefault();

        // Control which button will have btn primary class
        if(activeButton === 'see-all-gifs') {
            button = $('.js-see-all-gifs');
        }
        else if(activeButton === 'trending') {
            button = $('.js-trending-gifs');
        }
        else {
            button = $('.js-random-gif');
        }

        button.addClass('btn-primary');
        button.removeClass('btn-default');
    }

    // PAGINATION DISPLAY CONTROL *** this will only hide the ENTIRE pagination section, will not control left and right arrow display ***
    function togglePagination(direction) {

        // if direction is ON, then SHOW the pagination
        if(direction === 'on') {
            $('.js-pagination').removeClass('display-none');
        }

        // if direction is OFF, then HIDE the pagination
        else if(direction === 'off') {
            $('.js-pagination').addClass('display-none');
        }
    }

    // PAGINATION FUNCTIONALITY CONTROL
    function pageinationBuilder(currentPage, totalPages) {
        console.log('totalPages: ' + totalPages);
        console.log('currentPage: ' + currentPage);

        // build button for previous page, no data needed, use jquery data- tool
        var backButton = function() {
            return '<li><a data-previous=previous" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>';
        }

        // build button for next page, no data needed, use jquery data- tool
        var nextButton = function() {
            return '<li><a data-next=next" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>';
        }

        // control which selection in pagination are ACTIVE 
        var pageLink = function(number, active) {
            var className = 'page-item';

            // add active to the CURRENT page selection, but not to the non-current page selections
            if(number === currentPage) {
                className += ' active';
            }
            
            // be sure to include the class and the number to be showrn
            return '<li class="' + className + '"><a data-page-number=' + number + ' href="javascript:void(0)">' + number + '</a></li>';
        }

        // write some simple math to control what is first page in pagination UI
        var startPage = function() {
            
            // lower band
            if(currentPage <= 3) {
                return 1;
            }

            // middle band
            else if(currentPage >= 4 && currentPage <= totalPages - 2) {
                return currentPage - 2;
            }

            // upper band
            else if(currentPage >= totalPages - 3) {
                return totalPages - 4;
            }
        }

        // write some simple math to control what is last page in pagination UI
        var endPage = function() {

            // lower band
            if(currentPage <= 3) {
                return 5;
            }

            // middle band
            if(currentPage >= 4 && currentPage <= totalPages - 3) {
                return currentPage + 2;
            }


            // upper band
            if(currentPage >= totalPages - 2) {
                return totalPages;
            }
  
        }

        $('.js-pagination').html(''); // remove the pagination links at the bottom
        html = backButton(); // start building pagination with a left arrow and add it to html variable

        // loop from the beginning of the pages to show to the end (ie, 1,2,3,4,5) and add that to our html variable
        for(var i = startPage(); i <= endPage(); i++) {
            html += pageLink(i);
        }

        html += nextButton(); // finish the pagination html by adding our next button

        $('.js-pagination').html(html); // finally send the pagination html to the js-pagination target
    };

    // create tool to show the gifs
    function gifBuilder(gifList, isExternal) {

        // create a variable that builds a single line of html with the file name (src) of the gif
        var gifEntry = function(src) {
            var source = 'gifs/' + src;
            if (isExternal) {
                source = src;
            }
            return '<div class="gif-entry"><img src=' + source + '></div>';
        }

        $('.js-gif-row-target').html(''); // remove the existing static markup but leave it in the dom for clarity sake
        var html = ''; // initialize a variable to hold all of our single lines of html from gifEntry

        // loop through the list of the gifs and add it to the html variable
        for(var i = 0; i < gifList.length; i++) {
            html += gifEntry(gifList[i]);
        }

        // populate the target with the html to show the gifs
        $('.js-gif-row-target').html(html);
    }

    function getAllGifFiles(currentPage) {
        setActiveButton('see-all-gifs');
        togglePagination('on'); // pass in 'on' as direction to the toggle Pagination function
        toggleLoader('on'); // pass in 'on' as direction to teh toggle Loader function

        $.get( "/gif-list", {currentPage: currentPage}, function(data) {
            data = JSON.parse(data);
            gifList = data.gifList;
            totalPages = data.totalPages;
            
            gifBuilder(gifList);
            pageinationBuilder(currentPage, totalPages);
            toggleLoader('off'); // pass in 'off' to the toggleLoader
        });
    }

    // if user wants a random gif 
    function getRandomGifFile() {
        setActiveButton('random'); // make the random button active state
        togglePagination('off'); // remove pagination since only showing 1 image
        toggleLoader('on'); // add the loader UNTIL we receive response from server ***may need to move this further down the chain of operations though***

        // create function to receive random data (no need for total pages, just need 1 gif)
        $.get( "/gif-random", function(data) {
            data = JSON.parse(data);
            gifBuilder(data.gifList); // send our gif to the builder to handle it
            toggleLoader('off'); // show our loader
        });
    }

    // hit API for trending gifs
    function getTrendingGifs() {
        setActiveButton('trending');
        togglePagination('off');
        toggleLoader('on');

        $.get( "/trending", function(data) {
            data = data.data;
            var gifList = [];

            for(var i = 0; i < data.length; i++) {
                gifList.push(data[i].images.fixed_width.url);
            }

            gifBuilder(gifList, true);
            toggleLoader('off');
        });
    }

    $('.js-random-gif').on('click', function() {
        getRandomGifFile();
    });

    $('.js-see-all-gifs').on('click', function() {
        getAllGifFiles(currentPage);
    });

    $('.js-pagination').on('click', 'a', function(){

        // if the element clicked is previous, check to make sure were not on the first page before we try to go back a page
        if ($(this).data('previous')) {
            if (currentPage !== 1){
                currentPage--;
                getAllGifFiles(currentPage);
            }
        }

        // if the element clicked is next, check to make sure were not on the last page before we try to go forward a page
        else if ($(this).data('next')) {
            if (currentPage < totalPages) {
                currentPage++;
                getAllGifFiles(currentPage);
            }
        }

        // if were somewhere in the middle, change the current page to the one that we cklicked on
        else {
            if(currentPage !== $(this).data('page-number')) {
                currentPage = $(this).data('page-number');
                getAllGifFiles(currentPage);
            }
            else {
                return;
            }
        }

        // getAllGifFiles(currentPage);

    });

    $('.js-trending-gifs').on('click', function() {
        getTrendingGifs();
    });

    // start everything off with a random gif
    getRandomGifFile();
});