$(function () {

	// a countdown jQuery plugin
	jQuery.fn.countDown = function (settings, to) {
		settings = jQuery.extend({
			startFontSize: '145px',
			endFontSize: '100px',
			duration: 1000,
			startNumber: 3,
			endNumber: 0,
			callBack: function () { }
		}, settings);
		return this.each(function () {

			// add shadow background effect to animation countdown
			$('#raceTrack').addClass('shadow');

			//where to start the enimation
			if (!to && to != settings.endNumber) { to = settings.startNumber; }

			//set the countdown to the starting number
			$(this).text(to).css('fontSize', settings.startFontSize);

			//loopage
			$(this).animate({
				'fontSize': settings.endFontSize
			}, settings.duration, '', function () {
				if (to > settings.endNumber + 1) {
					$(this).css('fontSize', settings.startFontSize).text(to - 1).countDown(settings, to - 1);
				}
				else {
					settings.callBack(this);
				}
			});

		});
	};

	// get html elements to manipulate with classes and add event listeners
	var raceBtn, restartBtn, carOne, carTwo, cars, finishedImage, previousRaceInfoDiv;

	raceBtn = $('#racebtn');
	restartBtn = $('#restartbtn');
	carOne = $('#carOne');
	carTwo = $('#carTwo');
	cars = $('.car');
	finishedImage = $('.finishedImage');
	previousRaceInfoDiv = $('#previousRace');



	// set the event listener for start race and begin with countdown and execute the race game
	raceBtn.on('click', function () {

		// disable buttons during the race
		raceBtn.prop("disabled", true);
		restartBtn.prop("disabled", true);

		// start countdown and execute the animations and race
		$('.countdown').countDown({
			startNumber: 3,
			callBack: function (e) {

				// remove shadow and countdown number
				$('#raceTrack').removeClass('shadow');
				jQuery(e).text('');

				//check if complete the race flag var isFinished
				function ifComplete() {
					if (isFinished == false) {
						isFinished = true;

						// show the flag animation when a car reaches the finish line
						finishedImage.attr('src', 'Assets/img/finish.gif');

						// add a background shadow effect while the flag animation is on
						$('#raceTrack').addClass('shadow');

						// timeout function for removal of flag animation and enable the buttons
						setTimeout(function () {

							// remove flag animation and background shadow
							finishedImage.attr('src', '');
							$('#raceTrack').removeClass('shadow');

							// set buttons to enable when the animation and race finish
							raceBtn.prop("disabled", false);
							restartBtn.prop("disabled", false);
						}, 3500);
					} else {
						finishedIn = 'second';
					}
				};
				// race track and car width
				var carWidth = $('.car').width();
				var raceTrackWidth = $(window).width() - carWidth - 20;

				// generate random numbers
				var raceTimeOne = Math.floor((Math.random() * 5000) + 1);
				var raceTimeTwo = Math.floor((Math.random() * 5000) + 1);

				//flag var to false i.e. who reaches the destination first
				var isFinished = false;

				// winner flag
				var finishedIn = 'first';

				//animate car one 
				carOne.animate({
					left: raceTrackWidth
				}, raceTimeOne, function () {
					// animation complete
					ifComplete();

					// add a css class to style car one table
					$('#raceInfo1 table').addClass('carOneTable');

					//create a temp array for results
					var carOnearr = [finishedIn, raceTimeOne];

					// write data to local storage
					localStorage.setItem('car1place', finishedIn);
					localStorage.setItem('car1time', raceTimeOne);

					// loop through the temp array for results
					for (i = 0; i < carOnearr.length; i++) {
						var tRow = $('<tr>');
						var tHead = $('<td>');
						var rTable = $('#raceInfo1 table');
						tHead.html(`Finished in: <span>${carOnearr[0]}</span> place with a time of: <br> <span>${carOnearr[1]}</span> milliseconds!`);
						tRow.append(tHead);
						rTable.prepend(tRow);
						break;
					};
				});
				//car two animation
				carTwo.animate({
					left: raceTrackWidth
				}, raceTimeTwo, function () {
					// animation complete
					ifComplete();

					// add a css class to style the table 
					$('#raceInfo2 table').addClass('carTwoTable');

					//create a temp array for results
					var carTwoarr = [finishedIn, raceTimeTwo];

					// write data to local storage 
					localStorage.setItem('car2place', finishedIn);
					localStorage.setItem('car2time', raceTimeTwo);

					// loop through the temp array for results
					for (i = 0; i < carTwoarr.length; i++) {
						var tRow = $('<tr>');
						var tHead = $('<td>');
						var rTable = $('#raceInfo2 table');
						tHead.html(`Finished in: <span>${carTwoarr[0]}</span> place with a time of: <br> <span>${carTwoarr[1]}</span> milliseconds!`);
						tRow.append(tHead);
						rTable.prepend(tRow);
						break;
					};
				});
			}
		});
	});

	// reset game button
	restartBtn.on('click', function () {
		cars.css('left', '0');
	});
	// Car 1 get data
	var finishedInCar1 = localStorage.getItem('car1place');
	var raceTimeOneCar1 = localStorage.getItem('car1time');

	// Car 2 get data
	var finishedInCar2 = localStorage.getItem('car2place');
	var raceTimeTwoCar2 = localStorage.getItem('car2time');

	// print to table
	var tRowLocal = $('<tr>');
	var tDataLocal = $('<td>');
	var prevInfoTable = $('#previousRace table');
	tDataLocal.html(`<p style="color: white;">In the last game <span style="font-size: x-large; color: thistle;"> Car 1 </span> finished in 
	<span style="font-size: x-large; color: thistle;">${finishedInCar1}</span> place with a time of: <br> <span style="font-size: x-large; color: 
	thistle;">${raceTimeOneCar1}</span> milliseconds
	and <span style="font-size: x-large; color: #ba0000;">Car 2 </span> finished in <span style="font-size: x-large; color: #ba0000;">
	${finishedInCar2}</span> place with a time of: <br> <span style="font-size: x-large; color: #ba0000;">${raceTimeTwoCar2}</span> milliseconds!</p>`);
	tRowLocal.append(tDataLocal);
	prevInfoTable.append(tRowLocal);

	//check if there is data from previous race in local storage and show previous race div otherwise
	// if it's the first iteration of the game the div should be hidden
	if (finishedInCar1 == null || finishedInCar2 == null) {
		previousRaceInfoDiv.hide();
	} else {
		previousRaceInfoDiv.show();
	}
});