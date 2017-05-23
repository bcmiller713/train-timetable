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
	nextArrival = moment($("#arrival").val().trim(), "HH:mm").format("X");
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
	// Store everything into a variable.
	var trainName = snapshot.val().name;
	var trainDestination = snapshot.val().destination;
	var trainArrival = moment.unix(snapshot.val().nextArrival).format("HH:mm A");
	var trainFrequency = snapshot.val().frequency;

	console.log(trainName);
	console.log(trainDestination);
	console.log(trainArrival);
	console.log(trainFrequency);

	var nextTrainMinutes = moment().diff(moment.unix(snapshot.val().nextArrival, "X"), "minutes");
	console.log(nextTrainMinutes);

	$("#train-listings").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFrequency +
								"</td><td>" + trainArrival + "</td><td>" + nextTrainMinutes + "</td></tr>");
});