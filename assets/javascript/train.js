// Initialize Firebase
var config = {
	apiKey: "AIzaSyDnCnF0J7JkpaDfjKvotNUX_DXQIE_7uYE",
	authDomain: "bryce-1558b.firebaseapp.com",
	databaseURL: "https://bryce-1558b.firebaseio.com",
	projectId: "bryce-1558b",
	storageBucket: "bryce-1558b.appspot.com",
	messagingSenderId: "1053983538724"
};
firebase.initializeApp(config);

var database = firebase.database();

// Set initial variables
var name = "";
var destination = "";
var nextArrival = "";
var frequency = "";

// When submit button is clicked
$("#add-train-btn").on("click", function(event) {
	event.preventDefault();
	
	// Get values of user input (include moment.js for date value)
	name = $("#name").val().trim();
	destination = $("#destination").val().trim();
	nextArrival = moment($("#arrival").val().trim(), "HH:mm").subtract(10, "years").format("X");
	frequency = $("#frequency").val().trim();

	// Create object for combined user input
	var newTrain = {
		name: name,
		destination: destination,
		nextArrival: nextArrival,
		frequency: frequency
	};

	// Push train data object to firebase
	database.ref().push(newTrain);

	// Clear user input from text fields
	$("#name").val("");
	$("#destination").val("");
	$("#arrival").val("");
	$("#frequency").val("");
});

database.ref().on("child_added", function(snapshot) {
	// When data is added to firebase, save data into variables...
	var trainName = snapshot.val().name;
	var trainDestination = snapshot.val().destination;
	var trainArrivalUnix = snapshot.val().nextArrival;
	var trainFrequency = snapshot.val().frequency;
	var remainder = moment().diff(moment.unix(trainArrivalUnix), "minutes")%trainFrequency;
	var minutes = trainFrequency - remainder;
	var arrival = moment().add(minutes, "m").format("hh:mm A");

	// And add data to table
	$("#train-listings").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency +
								"</td><td>" + arrival + "</td><td>" + minutes + "</td></tr>");
});
