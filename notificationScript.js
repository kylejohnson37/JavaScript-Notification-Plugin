/**
 * This JavaScript file contains a plugin that is made in JavaScript Vanilla/JQuery. It will generate a notification that can be placed beside on element with an ID.
 *
 * @projectname Notification Plugin
 * @version 0.1
 * @author Kyle Johnson <kyle.johnson@myfela.com>
 *
 */
 
/**
 * Constructs our notification
 * @constructor this.Notification
 */
this.Notification = function() {	
	/** The array of objects that are used to customize each individual hotspot. Consists of all strings.
	 * @var {string} choice Determines the type of notification that can be passed in.
	 * @var {string} message This is the message shown in advancedAlert.
	 * @var {boolean} positive If true is passed in the value will be made a positive number, if false it will be a negative number
	 * @var {string} number This is the number shown. Or how many goals were unlocked.
	 * @var {string} id This value is the id the notification will be shown at or placed at.
	 * @var {string} background This is the background shown for each notification.
	 * @var {string} fontColor The color of the font used in the notification.
	 * @var {string} fontSize The size of the font used in the notification.
	 */
    var defaults = {
        choice: "advancedAlert", //'advancedAlert', 'simpleAlert', 'fadeDown', 'fadeUp'
        message: "",
        positive: true,
        number: "1",
        id: "",
        background: "none", 
        fontColor: "red",
        fontSize: "13px"
    };

    //create options by taking in passed in arguments and extending defaults
    if (arguments[0] && typeof arguments[0] === "object") {
        this.options = $.extend({}, defaults, arguments[0]);
    }

    /**
     * The function that calls the function to create our notification and passes in the options values.
     * @function Notification.prototype.open
     */
    Notification.prototype.open = function() {
        createNotification.call(this);
    };
};

//global variables
var goals = 0;
var badges = 0;
var connections = 0;
var rewards = 0;
var actions = 0;
var count = 1;
/**
 * Creates the notification based on passed in values
 * @function createNotification
 */
function createNotification() {
	if(count >= 6){ //up to '6' notifications can be shown at once
		count = 1;
	}
	
    var adjustment = 0;
    var docFrag = document.createDocumentFragment();

	//our notification holder
    var alertHolder = document.createElement("div");
    var $alertHolder = $(alertHolder);
    $alertHolder.attr("id", "number" + count);
	count++;
	
    /**
     * Sets the attributes & style for the div holding the notification.
     */
    $alertHolder.css("color", this.options.fontColor);
    $alertHolder.css("background-color", this.options.background);
    $alertHolder.css("font-size", this.options.fontSize);
	
	/**
	* If nothing is passed in 'message' then it shows the value passed in number and a
	* '+' or '-' depending the value of 'positive'
	*/
	if(this.options.message !== ""){
		$alertHolder.html(this.options.message);
	} else {
		if(this.options.positive){
			$alertHolder.html('+' + this.options.number);
		} else{
		    $alertHolder.html('-' + this.options.number);
		}
	}

    /**
     * Adds the needed class for animations based on the passed in value
     * under choice.
     */
    if (this.options.choice === "simpleAlert") {
        $alertHolder.addClass("animated tada");
    } else if (this.options.choice === "advancedAlert") {
        $alertHolder.addClass("advanced");
        setTimeout(changeText, 1200);
    } else if (this.options.choice === "fadeUp") {
        $alertHolder.addClass("animated fadeUp");
    } else if (this.options.choice === "fadeDown") {
        $alertHolder.addClass("animated fadeDown");
        adjustment = 60;
    }

	var number = 0;
	//specifically named for LifeCents. This keeps tally of the notifications that are being shown.
	if (this.options.type === "goal"){
		goals = parseInt(goals) + parseInt(this.options.number);
		number = goals;
		$alertHolder.addClass("goal");
		$('.goal').remove();
	} else if (this.options.type === "badge"){
		badges = parseInt(badges) + parseInt(this.options.number);
		number = badges;
		$alertHolder.addClass("badges");
		$('.badges').remove();
	} else if (this.options.type === "connection"){
		connections = parseInt(connections) + parseInt(this.options.number);
		number = connections;
		$alertHolder.addClass("connection");
		$('.connection').remove();
	} else if (this.options.type === "reward"){
		rewards = parseInt(rewards) + parseInt(this.options.number);
		number = rewards;
		$alertHolder.addClass("reward");
		$('.reward').remove();
	} else if (this.options.type === "action"){
		actions = parseInt(actions) + parseInt(this.options.number);
		number = actions;
		$alertHolder.addClass("action");
		$('.action').remove();
	}
	
	//adds the notification to the document
    $(docFrag).append(alertHolder);
    $(document.body).append(docFrag);

    /**
     * Sets the top & left value of the id the being displayed.
     */
    if (this.options.choice === "simpleAlert" || this.options.choice === "advancedAlert") {
        $(alertHolder).css("top", getLocationTop(this.options.id) + 10);
        $(alertHolder).css("left", getLocationLeft(this.options.id) + $("#" + this.options.id).outerWidth(true) - 10);
    } else if (this.options.choice === "fadeUp" || this.options.choice === "fadeDown") {
        $(alertHolder).css("top", getLocationTop(this.options.id) - $(alertHolder).outerHeight(true) / 3 - adjustment);
        $(alertHolder).css("left", getLocationLeft(this.options.id) + $("#" + this.options.id).outerWidth(true) / 2 - $(alertHolder).outerWidth(true) / 2);
    }

    /**
     * Scrolls to show the desired element if it is not currently visible on the screen.
     */
    if (getLocationTop(this.options.id) > window.innerHeight + $(window).scrollTop() || getLocationTop(this.options.id) < $(window).scrollTop()) {
        $("html, body").animate({
            scrollTop: getLocationTop(this.options.id) - 200
        }, 500);
		
    }
	
    /**
     * Changes the text to the passed in numerical value.
     * @function changeText
     */
    function changeText() {
        $alertHolder.html(number);
    }
}

//private functions
/**
 * Finds the top location of a passed in id
 * @function getLocationTop
 * @param {string} id
 * @returns {Number} top
 */
function getLocationTop(id) {
    var path = $("#" + id).parentsUntil("body");
    var top = 0;
    for (j = 0; j < path.length; j += 1) {
        top = top + $(path[j]).position().top;
    }
    top = top + $("#" + id).position().top;
    return top;
}

/**
 * Finds the left location of a passed in id
 * @function getLocationLeft
 * @param {string} id
 * @returns {Number} left
 */
function getLocationLeft(id) {
    var path = $("#" + id).parentsUntil("body");
    var left = 0;
    for (j = 0; j < path.length; j += 1) {
        left = left + $(path[j]).position().left;
    }
    left = left + $("#" + id).position().left;
    return left;
}