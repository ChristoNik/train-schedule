$(document).ready(function(){

    //dynamically display current time
   function getDateTimeFunction() {
     var dateTime = new Date();
       $("#realTime").html(dateTime);
    }
    $(document).ready(function(){
       setInterval(getDateTimeFunction, 1000);
    });
//end dynamicly display


    //1. Firebase code goes here
    var config = {
        apiKey: "AIzaSyAoxAE3hiZvDBwrcSYiFiL5qjuDHMNc3VA",
        authDomain: "train-80f7a.firebaseapp.com",
        databaseURL: "https://train-80f7a.firebaseio.com",
        projectId: "train-80f7a",
        storageBucket: "",
        messagingSenderId: "185770742746"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    //2. Button for adding trains
$("#submit").on("click", function() {
    //checks if input boxes are blank
    if ($(".form-control").val().trim() !== "") {
        //capture user input
        var train = $("#trainName").val().trim();
        var dest = $("#destination").val().trim();
        var first = $("#firstTrain").val().trim();
        var freq = $("#frequency").val().trim();

        //upload to the database
        database.ref().push({
            train: train,
            dest: dest,
            first: first,
            freq: freq
        });

        //clear the input boxes
        $("#trainName").val("");
        $("#destination").val("");
        $("#firstTrain").val("");
        $("#frequency").val("");
    } else {
        alert("Please enter a value!");
    }
});

    //3. Firebase event to capture train added to database and a row in html when user adds train
database.ref().on("child_added", function (childSnapshot) {
    var freq = childSnapshot.val().freq;

        var freq = parseInt(freq);
        //current Time
        var currentTime = moment();
        var dConverted = moment(childSnapshot.val().first, 'HH:mm').subtract(1, 'years');
        var trainTime = moment(dConverted).format('HH:mm');

        //difference
        var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
        var tDifference = moment().diff(moment(tConverted), 'minutes');
        var tRemainder = tDifference % freq;
        var minsAway = freq - tRemainder;
        var nextTrain = moment().add(minsAway, 'minutes');


        //Append table
        $('#currentTime').text(currentTime);
        $('#trainTable').append(
            "<tr><td id='trainDisplay'>" + childSnapshot.val().train +
            "</td><td id='destDisplay'>" + childSnapshot.val().dest +
            "</td><td id='freqDisplay'>" + childSnapshot.val().freq +
            "</td><td id='firstDisplay'>" + moment(nextTrain).format("HH:mm") +
            "</td><td id='awayDisplay'>" + minsAway  + ' minutes until arrival' + "</td></tr>");
    });

});