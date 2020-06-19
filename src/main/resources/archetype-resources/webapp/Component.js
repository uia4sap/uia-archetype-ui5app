sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"sap/ui/core/ComponentSupport" // needed for self-contained build
], function(
	UIComponent, 
	Device
) {
	"use strict";

	return UIComponent.extend("${package}.Component", {

		metadata: {
			manifest: "json"
		},

		createContent: function() {
            return sap.ui.view({
                "id": "app",
                "viewName": "${package}.view.App",
                "type": "XML",
                "async": true
            });
        },

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
            // routing
            this.getRouter().initialize();
		}
	});
});