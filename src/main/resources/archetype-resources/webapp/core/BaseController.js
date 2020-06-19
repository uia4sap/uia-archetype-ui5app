sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageToast",
    "sap/m/Button",
    "sap/m/Dialog",
    "sap/m/Text",
    "jquery.sap.global"
], function(
    Controller, 
    History, 
    MessageToast, 
    Button, 
    Dialog, 
    Text, 
    jQuery
) {
    "use strict";
    return Controller.extend("${package}.core.BaseController", {

        /**
         * Convenience method for accessing the router.
         * @public
         * @returns {sap.ui.core.routing.Router} the router for this component
         */
        getRouter: function() {
            return sap.ui.core.UIComponent.getRouterFor(this);
        },

        getI18N: function(sName) {
            if(sName) {
                return this.getModel(sName).getResourceBundle();
            } else {
                return  this.getModel("i18n").getResourceBundle();
            }
        },

        /**
         * Convenience method for getting the view model by name.
         * @public
         * @param {string} sName the model name
         * @returns {sap.ui.model.Model} the model instance
         */
        getModel: function(sName) {
			return sName == undefined ?
				this.getView().getModel() :
				this.getView().getModel(sName);
        },

        /**
         * Convenience method for setting the view model.
         * @public
         * @param {object} oModel the model instance
         * @param {string} sName the model name
         * @returns {sap.ui.mvc.View} the view instance
         */
        setModel: function(oModel, sName) {
			return sName == undefined ?
				this.getView().setModel(new sap.ui.model.json.JSONModel(oModel)) :
				this.getView().setModel(new sap.ui.model.json.JSONModel(oModel), sName);
        },

        /**
         * Convenience method for getting the configuration from manifest.
         * @public
         * @param {string} sName the route name.
         * @param {function} handle Callback of attachPatternMatched.
         */
        attachPatternMatched: function(sName, handle) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.getRoute(sName).attachPatternMatched(handle, this);
        },

        /**
         * Convenience method for getting the root url of web api.
         * @public
         * @returns {string} the url.
         */
        getWebApi: function() {
            // return this.getOwnerComponent().getManifestEntry("sap.ui5").config.webapi;
            var webapi = this.getModel("config").getProperty("/webapi");
            if(!webapi.startsWith("http")) {
                webapi = window.location.protocol +"//" + window.location.host + webapi;
                this.getModel("config").setProperty("/webapi", webapi);
            }
            return webapi;
        },

		/**
		 * Convenience method for navigating to specific page.
		 * @param {string} sName The page name which route navigates to.
		 * @param {string} key Parameter name.
		 * @param {object} value Parameter value or JSON string.
		 */
        navTo: function(sName, key, value) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            if(key) {
                var request = {};
                request[key] = value;
                oRouter.navTo(sName, request);
            } else {
                oRouter.navTo(sName);
            }
        },

		/**
		 * Convenience method for navigating back.
		 * @public
		 * @param {string} sName The page name which route navigates back if there is no history.
		 */
        navBack: function(sName) {
            if(!sName) {
                sName = "Home";
            }
            var sPreviousHash = History.getInstance().getPreviousHash();
            if(sPreviousHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getOwnerComponent()
                    .getRouter()
                    .navTo(sName);
            }
        },

        /**
         * showDialog(...).then(() => {}).catch(() => {});
         * 
         * @param {string} message 
         */
        showDialog: function(message) {
            var self = this;
            var i18n = this.getI18N();
            return new Promise(function(approved, reject) {
                var dialog = new Dialog({
                    title: i18n.getText("g.Confirm"),
                    type: 'Message',
                    content: new Text({ text: message }),
                    initialFocus: "cancelButton", 
                    beginButton: new Button({
                        id: "okButton",
                        text: i18n.getText("g.OK"),
                        press: function() {
                            approved.call(self);
                            dialog.close();
                        }
                    }),
                    endButton: new Button({
                        id: "cancelButton",
                        text: i18n.getText("g.Cancel"),
                        press: function() {
                            reject.call(self);
                            dialog.close();
                        }
                    }),
                    afterClose: function() {
                        dialog.destroy();
                    }
                });

                dialog.open();
            });
        },

        showMessageDialog: function(message) {
            var i18n = this.getI18N();
            var dialog = new Dialog({
                title: i18n.getText("g.Message"),
                type: 'Message',
                content: new Text({ text: message }),
                beginButton: new Button({
                    text: i18n.getText("g.OK"),
                    press: function() {
                        dialog.close();
                    }
                }),
                afterClose: function() {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        showApiFailed: function(message) {
            var dialog = new Dialog({
                title: "Error",
                type: 'Message',
                content: new Text({ text: message.reason }),
                beginButton: new Button({
                    text: "Close",
                    press: function() {
                        dialog.close();
                    }
                }),
                afterClose: function() {
                    dialog.destroy();
                }
            });

            dialog.open();
        },

        assign: function(model, path, data) {
            Object.keys(data).forEach((k) => {
                model.setProperty(path + k, data[k]);
            });
        },

        sort: function(model, path, sorter) {
            var data = model.getProperty(path);
            data.sort(sorter); 
            model.setProperty(path, data);
        },

        addRow: function(model, path, value) {
            var rows = model.getProperty(path);
            rows.push(value);
            model.setProperty(path, rows);
        },

        removeRow: function(model, path, selector) {
            var rows = model.getProperty(path);
            ArrayObject.remove(rows, selector);
            model.setProperty(path, rows);
        },

        getTableSelectedRow: function(id, message) {
            var i18n = this.getI18N();
            var ignoreMessage = message == false;
            if(!ignoreMessage || message == undefined) {
                message = i18n.getText("tip.SelectOne");
            }

            var table = this.byId(id);
            var rows = table.getSelectedIndices();
            if(rows.length == 0) {
                if(!ignoreMessage) {
                    MessageToast.show(message);
                }
                return null;
            } else {
                return table.getContextByIndex(rows[0]).getObject();
            }
        },

        setTableSelectedRow: function(id, data) {
            var table = this.byId(id);
            var rows = table.getSelectedIndices();
            if(rows.length > 0) {
                var ctx = table.getContextByIndex(rows[0]);
                var orig = ctx.getObject();
                ValueObject.paste(orig, data);
                this.getModel("view").setProperty(ctx.getPath(), orig);
            }
        },

        onTableRowActionPress: function(oEvent, modelName) {
            var tableRow = oEvent.getParameter("row");
            if (!tableRow) {
                return null;
            }

            var table = tableRow.getParent();
            table.setSelectedIndex(table.indexOfRow(tableRow));
            return tableRow.getBindingContext(modelName ? modelName : "view").getObject();
        }
    });

});
