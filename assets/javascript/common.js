var Common = function() {
    var _data;

    function init() {
        initEventHandlers();
        myUserLogin();
    }

    function initEventHandlers() {
        $("#searchButton").on("click", function(event) {
            event.preventDefault();
            var searchResult = $("#mySearch").val().trim();
            window.location.href = "P1-SearchResultsPage.html?searchResult=" + searchResult;
        });
    }

    function myUserLogin() {
        // Initialize Firebase
        var config = {
            apiKey: "AIzaSyCnJS1L0TamagTgoxxJ2TRTWxAwfIUK4Hg",
            authDomain: "project1-a695b.firebaseapp.com",
            databaseURL: "https://project1-a695b.firebaseio.com",
            projectId: "project1-a695b",
            storageBucket: "project1-a695b.appspot.com",
            messagingSenderId: "1059137466888"
        };
        firebase.initializeApp(config);
        var database = firebase.database();
        // FirebaseUI config.
        var uiConfig = {
            signInSuccessUrl: 'P1-HomePage.html',
            signInOptions: [
                {
                    provider: firebase.auth.GoogleAuthProvider.PROVIDER_ID
                },
                {
                    provider: firebase.auth.GithubAuthProvider.PROVIDER_ID
                },
                {
                    provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
                    requireDisplayName: true
                }
            ]
        };
        // Initialize the FirebaseUI Widget using Firebase.
        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        // The start method will wait until the DOM is loaded.
        ui.start('#firebaseui-auth-container', uiConfig);

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {

                // User is signed in.
                database.ref("/Users").once("value", function(snapshot) {
                    var fbUsers = snapshot.val();
                    var userKeys = fbUsers ? Object.keys(fbUsers) : null;

                    if (!userKeys || userKeys.indexOf(user.uid) === -1) {
                        database.ref("/Users").child(user.uid).set({
                            //This is where user's favorite dishes will go to be stored in database.
                        });
                    }
                });
                var displayName = user.displayName;
                var email = user.email;
                var emailVerified = user.emailVerified;
                var photoURL = user.photoURL;
                var uid = user.uid;
                var phoneNumber = user.phoneNumber;
                var providerData = user.providerData;
                user.getIdToken().then(function (accessToken) {
                    document.getElementById('sign-in-status').textContent = 'Signed in';
                    document.getElementById('sign-in').textContent = 'Sign out';
                    document.getElementById('account-details').textContent = JSON.stringify({
                        displayName  : displayName,
                        email        : email,
                        emailVerified: emailVerified,
                        phoneNumber  : phoneNumber,
                        photoURL     : photoURL,
                        uid          : uid,
                        accessToken  : accessToken,
                        providerData : providerData
                    }, null, '  ');
                });

                $("#username").text(displayName);
                $("#sign-in").click(function () {
                    firebase.auth().signOut();
                    window.location = "P1-HomePage.html";
                });
            } else {
                // User is signed out.
                document.getElementById('sign-in-status').textContent = 'Signed out';
                document.getElementById('sign-in').textContent = 'Sign in';
                document.getElementById('account-details').textContent = 'null';
                $("#sign-in").click(function () {
                    window.location = "P1-HomePage.html";
                });
            }
        }, function(error) {
            console.log(error);
        });
    }

    return {
        init: init
    };
}();

$(function () {
    Common.init();
});