//iDate
var iDate = function() {
	var date = new Date();
	var month = date.getMonth()+1;
	month = month<10 ? '0'+month : month;
	
	var day = date.getDate();
	day = day<10 ? '0'+day : day;
	
	return {
		getCurDate: function() { return date.getFullYear() + '-' + month +'-'+ day; }
	};
};

//iTime
var iTime = function(objTimebox) {
    //Attribs
	var timerId;
	var hours, minutes, seconds;
	
	//Methods
	function update() {
		var date = new Date();
		hours = date.getHours();
		if(hours < 10) hours = '0' + hours;
		
		minutes = date.getMinutes();
		if(minutes < 10) minutes = '0' + minutes;
		
		seconds = date.getSeconds();
        if(seconds < 10) seconds = '0' + seconds;
        objTimebox.value = hours + ':' + minutes + ':' + seconds;
	}
	
	return {
		startClock: function() {
			if(timerId) return;
			timerId = setInterval(update, 1000);
			update();
		},
		stopClock: function() {
			clearInterval(timerId);
			timerId = null;	
        }
	};
};

var setTimeDate = function() {
    var idate = new iDate();
    var itime = new iTime(document.getElementById("cTime"));

    var cDate = document.getElementById("cDate");
    cDate.value = idate.getCurDate();

    itime.startClock();
}();