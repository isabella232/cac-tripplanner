CAC.Pages.Map = (function ($, Handlebars, _, moment, MapControl) {
    'use strict';

    var defaults = {
        map: {}
    };

    var mapControl = null;
    var sidebarExploreControl = null;
    var sidebarDirectionsControl = null;
    var sidebarTabControl = null;

    function Map(options) {
        this.options = $.extend({}, defaults, options);
    }

    Map.prototype.initialize = function () {

        sidebarTabControl = new CAC.Control.SidebarTab();
        sidebarTabControl.events.on('cac:control:sidebartab:shown', $.proxy(onSidebarTabShown, this));

        // Map initialization logic and event binding
        mapControl = new MapControl({
            tabControl: sidebarTabControl
        });
        mapControl.locateUser();

        sidebarExploreControl = new CAC.Control.SidebarExplore({
            mapControl: mapControl
        });
        sidebarExploreControl.events.on('cac:control:sidebarexplore:destinationdirections',
                                        $.proxy(getDestinationDirections, this));

        mapControl.events.on('cac:map:control:destinationpopup',
                             $.proxy(getDestinationDirections, this));

        sidebarDirectionsControl = new CAC.Control.SidebarDirections({
            mapControl: mapControl,
            tabControl: sidebarTabControl
        });
    };

    return Map;

    // featured destination select
    function getDestinationDirections(event, destination) {
        sidebarTabControl.setTab('directions');
        sidebarDirectionsControl.setDestination(destination);
    }

    function onSidebarTabShown(event, tabId) {
        if (tabId === 'directions') {
            mapControl.clearIsochrone();
            mapControl.setGeocodeMarker(null);
        } else {
            sidebarDirectionsControl.clearDirections();
        }
    }

})(jQuery, Handlebars, _, moment, CAC.Map.Control);
