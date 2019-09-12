// Variables

var name;
var destination;
var firstArrival;
var frequency;
var database;
var trainFirebaseData;
var newFirebaseData;
var time;
var clock;


$(document).ready(function () {

	// Timer
    function runningClock() {
        time = moment().format("hh:mm:ss A");
        $("#time").text(time);
    }
    clock = setInterval(runningClock , 1000);


    // Firebase
    var firebaseConfig = {
    apiKey: "AIzaSyD6-EFt_oLvpxmdHQN4Xs4WwQFdIoqHsRQ",
    authDomain: "train-55eab.firebaseapp.com",
    databaseURL: "https://train-55eab.firebaseio.com",
    projectId: "train-55eab",
    storageBucket: "",
    messagingSenderId: "38756505813",
    appId: "1:38756505813:web:c4173ea3c27dce91f6aa5c"
  };
     firebase.initializeApp(firebaseConfig);

    database = firebase.database();

    $("#submitButton").on("click", function (event) {

        event.preventDefault();

        //  Input Form
        name = $("#trainNameInput").val().trim();
        destination = $("#destinationInput").val().trim();
        firstArrival = $("#firstTrainTimeInput").val().trim();
        frequency = $("#frequencyInput").val().trim();
        console.log(firstArrival);



        //  Link firebase
        trainFirebaseData = {
            DatatrainName: name,
            Datadest: destination,
            DatafirstArrival: firstArrival,
            Datafrequency: frequency,
            TimeStamp: firebase.database.ServerValue.TIMESTAMP
        };

        database.ref().push(trainFirebaseData);

        clear();

    });

    database.ref().on("child_added", function (childSnapshot) {
        //  Moment From Class
        var snapName = childSnapshot.val().DatatrainName;
        var snapDest = childSnapshot.val().Datadest;
        var snapFreq = childSnapshot.val().Datafrequency;
        var snapArrival = childSnapshot.val().DatafirstArrival;

        var timeIs = moment();
        var firstArrivalConverted = moment(snapArrival , "HH:mm A").subtract(1, "years");
        var diff = moment().diff(moment(firstArrivalConverted) , "minutes");
        var left = diff % snapFreq;
        //  How long till train
        var timeLeft = snapFreq - left;
        var newArrival = moment().add(timeLeft , "m").format("HH:mm: A");

        $("#table-info").append("<tr><td>" + snapName +"</td><td>" + snapDest + "</td><td>" + snapFreq + "</td><td>" +
                                    newArrival + "</td><td>" + timeLeft + "</td></tr>");


    });

    function clear() {
        $("#trainNameInput").val("");
        $("#destinationInput").val("");
        $("#firstTrainTimeInput").val("");
        $("#frequencyInput").val("");
    }



});
