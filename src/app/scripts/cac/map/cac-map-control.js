CAC.Map.Control = (function ($, L) {
    'use strict';

    var defaults = {
        id: 'map',
        center: [39.95, -75.1667],
        zoom: 14
    };
    var watchID;
    var targetLocation = {};
    var map = null;
    var userMarker = null;

    var overlaysControl = null;

    var events = $({});
    var basemaps = {};
    var overlays = {};
    var stamenTonerAttribution = [
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ',
        'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
        'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
        'under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.'
    ].join('');
    var stamenAttribution = [
        'Map tiles by <a href="http://stamen.com">Stamen Design</a>, ',
        'under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. ',
        'Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, ',
        'under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.'
    ].join('');

    function MapControl(options) {
        this.events = events;
        this.options = $.extend({}, defaults, options);
        overlaysControl = new CAC.Map.OverlaysControl();
        map = L.map(this.options.id).setView(this.options.center, this.options.zoom);


        initializeBasemaps();
        initializeOverlays();
        initializeLayerControl();
    }

    MapControl.prototype.locateUser = locateUser;
    MapControl.prototype.plotLocations = plotLocations;

    return MapControl;

    function initializeBasemaps() {
        basemaps.Streets = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png', {
            attribution: stamenTonerAttribution
        });

        basemaps.Terrain = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png', {
            attribution: stamenAttribution
        });

        basemaps.Streets.addTo(map);
    }

    function initializeOverlays() {
        overlays['Bike Share Locations'] = overlaysControl.bikeShareOverlay();
        overlays['Bike Parking'] = overlaysControl.bikeParkingOverlay();
    }

    function initializeLayerControl() {
        L.control.layers(basemaps, overlays, {
            position: 'bottomright'
        }).addTo(map);
    }

    /**
     * Use HTML5 navigator to locate user and place a circle at their estimated location.
     *  Modify the target variable (instantiated above) to enable the killing of this watch job
     *  once a target location has been reached
     *
     * @return {object} (promise) which should resolve to the current coordinates of a user
     */
    function locateUser() {
        var deferred = $.Deferred();
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        var success = function(pos) {
            var latlng = [pos.coords.latitude, pos.coords.longitude];
            if (userMarker) {
                userMarker.setLatLng(latlng);
            } else {
                userMarker = new L.CircleMarker(latlng)
                  .on('click', function() {
                      events.trigger('MOS.Map.Control.CurrentLocationClicked', latlng);
                  });
                userMarker.setRadius(50);
                map.addLayer(userMarker);
            }
            if (targetLocation.lat === latlng[0] && targetLocation.lng === latlng[1]) {
                navigator.geolocation.clearWatch(watchID);
            }
            deferred.resolve(latlng);
        };
        var failure = function(error) {
            deferred.fail(function(){return 'ERROR(' + error.code + '): ' + error.message; });
        };

        if ('geolocation' in navigator) {
            watchID = navigator.geolocation.watchPosition(success, failure, options);
        } else {
            deferred.fail(function() { return 'geolocation not supported on this device'; });
        }
        return deferred.promise();
    }

    /**
     * Plot an array of geojson points onto the map
     */
    function plotLocations(locationGeoJSON) {
        var features = L.geoJson(locationGeoJSON, {
            onEachFeature: function(feature, layer) {
                layer.on('click', function(){
                    events.trigger('MOS.Map.Control.DestinationClicked', feature);
                });
            }
        });
        map.addLayer(features);
    }

})(jQuery, L);