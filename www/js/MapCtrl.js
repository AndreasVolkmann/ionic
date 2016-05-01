angular.module('starter').controller('MapCtrl', ['$scope', '$state', '$cordovaGeolocation', 'FriendFactory', '$ionicModal', '$ionicSideMenuDelegate',
    function ($scope, $state, $cordovaGeolocation, FriendFactory, $ionicModal, $ionicSideMenuDelegate) {
        $scope.user = {};

        $ionicModal.fromTemplateUrl('login.html', function (modal) {
            $scope.loginModal = modal;
        }, {
            scope: $scope,
            animation: 'slide-in-up'
        });

        var options = {timeout: 10000, enableHighAccuracy: true};

        $cordovaGeolocation.getCurrentPosition(options).then(function (position) {

            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.user.latLng = latLng;

            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

            google.maps.event.addListenerOnce($scope.map, 'idle', function () {
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                    icon: new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + "blue.png")
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: 'Here I am!'
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });
            });
        }, function (error) {
            console.error(error);
        });

        $scope.showLogin = function () {
            console.log('MODAL');
            $scope.loginModal.show();
        };

        $scope.hideLogin = function () {
            $scope.loginModal.hide();
        };


        $scope.login = function () {
            $scope.loginModal.hide();
            if ($scope.user.userName) {
                $scope.user.loc = [];
                $scope.user.loc.push($scope.user.latLng.lng());
                $scope.user.loc.push($scope.user.latLng.lat());

                FriendFactory.registerUser($scope.user, function (response) {
                    console.log(response.data);
                    $scope.friends = [];
                    response.data.forEach(function (friend) {
                        addFriend(friend);
                    });
                });
            } else {
                console.error('Could not login!');
            }
        };

        $scope.toggleFriends = function () {
            $ionicSideMenuDelegate.toggleLeft();
        };


        function addFriend(friend) {
            $scope.friends.push(friend);
            //google.maps.event.addListenerOnce($scope.map, 'idle', function () {
                var latLng = {
                    lat: friend.loc[0],
                    lng: friend.loc[1]
                };
                var marker = new google.maps.Marker({
                    map: $scope.map,
                    animation: google.maps.Animation.DROP,
                    position: latLng,
                    icon: new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/icons/" + "red.png")
                });

                var infoWindow = new google.maps.InfoWindow({
                    content: friend.userName
                });

                google.maps.event.addListener(marker, 'click', function () {
                    infoWindow.open($scope.map, marker);
                });
            //});
        }
    }]);



