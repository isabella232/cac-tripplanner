CAC.Pages.Map = (function ($, Handlebars, _, moment, MapControl) {
    'use strict';

    var defaults = {
        map: {},
        selectors: {
            leafletPopups: 'a.leaflet-popup-close-button'
        }
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
        window.stc = sidebarTabControl;
        sidebarTabControl.events.on(sidebarTabControl.eventNames.tabShown,
                                    $.proxy(onSidebarTabShown, this));

        // Map initialization logic and event binding
        mapControl = new MapControl({
            tabControl: sidebarTabControl
        });

        sidebarExploreControl = new CAC.Control.SidebarExplore({
            mapControl: mapControl
        });
        sidebarExploreControl.events.on(sidebarExploreControl.eventNames.destinationDirections,
                                        $.proxy(getDestinationDirections, this));

        mapControl.events.on(mapControl.eventNames.destinationPopupClick,
                             $.proxy(getDestinationDirections, this));

        mapControl.events.on(mapControl.eventNames.originMoved,
                             $.proxy(moveOrigin, this));

        mapControl.events.on(mapControl.eventNames.destinationMoved,
                             $.proxy(moveDestination, this));

        mapControl.events.on(mapControl.eventNames.geocodeMarkerMoved,
                             $.proxy(moveIsochrone, this));

        sidebarDirectionsControl = new CAC.Control.SidebarDirections({
            mapControl: mapControl,
            tabControl: sidebarTabControl
        });
    };

    return Map;

    // featured destination select
    function getDestinationDirections(event, destination) {

        // check user agent to see if mobile device; if so, redirect to Google Maps
        var regex = /android|iphone|ipod/i;
        var userAgent = navigator.userAgent.toLowerCase();
        var uaMatch = userAgent.match(regex);
        var mobileDevice = uaMatch ? uaMatch[0] : false;

        // Tablets go to full site. Check if Android devices are tablets:
        // no 'mobile' in user agent, or screen width >= bootstrap md breakpoint (992px)
        if (mobileDevice === 'android' && (!userAgent.match(/mobile/i) || screen.width >= 992)) {
            mobileDevice = false;
        }

        if (mobileDevice) {
            var addr = [destination.address, destination.city, destination.state].join(', ');
            var url = ['https://maps.google.com/maps?saddr=Current+Location',
                       '&dirflg=r&daddr=', // default to transit mode with dirflg
                       encodeURIComponent(addr)
                       ].join('');
            window.location = url;
            return false;
        }

        // not a mobile device; go to directions tab
        mapControl.clearIsochrone();
        sidebarDirectionsControl.clearDirections();
        mapControl.setGeocodeMarker(null);
        sidebarTabControl.setTab('directions');
        sidebarDirectionsControl.setDestination(destination);
    }

    function moveOrigin(event, position) {
        sidebarDirectionsControl.moveOriginDestination('origin', position);
    }

    function moveDestination(event, position) {
        sidebarDirectionsControl.moveOriginDestination('destination', position);
    }

    function moveIsochrone(event, position) {
        sidebarExploreControl.movedPoint(position);
    }

    function onSidebarTabShown(event, tabId) {
        // close any open map popups on tab switch
        _.each($(this.options.selectors.leafletPopups), function(closeBtn) {
            closeBtn.click();
        });

        // Load user preferences on tab switch in order to easily keep the pages in sync
        if (tabId === 'directions') {
            mapControl.clearIsochrone();
            mapControl.setGeocodeMarker(null);
            if (sidebarDirectionsControl) {
                sidebarDirectionsControl.setFromUserPreferences();
            }
        } else {
            sidebarDirectionsControl.clearDirections();
            sidebarExploreControl.setFromUserPreferences();
        }
    }

})(jQuery, Handlebars, _, moment, CAC.Map.Control);
