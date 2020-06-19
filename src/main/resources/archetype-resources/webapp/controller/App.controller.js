sap.ui.define([
    "${packageInPathFormat}/core/BaseController",
    'sap/ui/Device',
    'jquery.sap.global'
], function(
    BaseController,
    Device,
    jQuery
) {
    "use strict";
    return BaseController.extend("${package}.controller.App", {

        _bExpanded: true,

        onInit: function() {
            if(Device.resize.width <= 1024) {
                this.onSideNavButtonPress();
			}
			
            Device.media.attachHandler(function(oDevice) {
                if((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
                    this.onSideNavButtonPress();
                    this._bExpanded = (oDevice.name === "Desktop");
                }
            }.bind(this));
        },

        onItemSelected: function(oEvent) {
            var oItem = oEvent.getParameter('item');
            var sKey = oItem.getKey();
            if(!sKey) {
                return;
            }

            if(Device.system.phone) {
                this.onSideNavButtonPress();
            }

            this.navTo(sKey);
        },

        onSideNavButtonPress: function() {
            var oToolPage = this.byId("app");
            var bSideExpanded = oToolPage.getSideExpanded();
            this._setToggleButtonTooltip(bSideExpanded);
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },

        onUserPress: function(oEvent) {},

        onLogOut: function() {

        },

        _setToggleButtonTooltip: function(bSideExpanded) {
            var oToggleButton = this.byId('sideButton');
            if(bSideExpanded) {
                oToggleButton.setTooltip('Large Size Navigation');
            } else {
                oToggleButton.setTooltip('Small Size Navigation');
            }
        }
    });
});
