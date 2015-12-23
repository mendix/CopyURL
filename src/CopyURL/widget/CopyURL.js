/*
    CopyURL
    ========================

    @file      : CopyURL.js
    @version   : 1.0.0
    @author    : Roeland Salij
    @date      : Monday, December 21, 2015
    @copyright : Mendix 2015
    @license   : Apache 2
  
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",
    "dojo/text!CopyURL/widget/template/CopyURL.html"
], function(declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, dojoLang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    // Declare widget's prototype.
    return declare("CopyURL.widget.CopyURL", [ _WidgetBase, _TemplatedMixin ], {
        // _TemplatedMixin will create our dom node using this HTML template.
        templateString: widgetTemplate,

        // DOM elements
        copySelectNode: null,
        copyInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
        targetAttribute: "",

        // Internal variables. Non-primitives created in the prototype are shared between all widget instances.
        _handles: null,
        _contextObj: null,
        _alertDiv: null,

        // dijit._WidgetBase.postCreate is called after constructing the widget. Implement to do extra setup work.
        postCreate: function() {
            
            this._updateRendering();
            this._setupEvents();
        },

        // mxui.widget._WidgetBase.update is called when context is changed or initialized. Implement to re-render and / or fetch data.
        update: function(obj, callback) {

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering();

            callback();
        },

         // Attach events to HTML dom elements
        _setupEvents: function() {
            this.connect(this.copySelectNode, "click", function(e) {
                var copyTextarea = this.copyInputNode;
                copyTextarea.select();

                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Copying text command was ' + msg);
                } catch (err) {
                    console.log('Oops, unable to copy');
                }
                
            });
            
        },

        // Rerender the interface.
        _updateRendering: function() {
 
            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");

                var toCopyValue = this._contextObj.get(this.targetAttribute);

                this.copyInputNode.value = toCopyValue;

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            // Important to clear all validations!
            this._clearValidations();
        },

        // Handle validations.
        _handleValidation: function(validations) {
            this._clearValidations();

            var validation = validations[0],
                message = validation.getReasonByAttribute(this.backgroundColor);

            if (this.readOnly) {
                validation.removeAttribute(this.backgroundColor);
            } else if (message) {
                this._addValidation(message);
                validation.removeAttribute(this.backgroundColor);
            }
        },

        // Clear validations.
        _clearValidations: function() {
            dojoConstruct.destroy(this._alertDiv);
            this._alertDiv = null;
        },

        // Show an error message.
        _showError: function(message) {
            if (this._alertDiv !== null) {
                dojoHtml.set(this._alertDiv, message);
                return true;
            }
            this._alertDiv = dojoConstruct.create("div", {
                "class": "alert alert-danger",
                "innerHTML": message
            });
            dojoConstruct.place(this.domNode, this._alertDiv);
        },

        // Add a validation.
        _addValidation: function(message) {
            this._showError(message);
        },

        // Reset subscriptions.
        _resetSubscriptions: function() {
            // Release handles on previous object, if any.
            if (this._handles) {
                dojoArray.forEach(this._handles, function (handle) {
                    mx.data.unsubscribe(handle);
                });
                this._handles = [];
            }

            // When a mendix object exists create subscribtions. 
            if (this._contextObj) {
                var objectHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    callback: dojoLang.hitch(this, function(guid) {
                        this._updateRendering();
                    })
                });

                var attrHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    attr: this.backgroundColor,
                    callback: dojoLang.hitch(this, function(guid, attr, attrValue) {
                        this._updateRendering();
                    })
                });

                var validationHandle = this.subscribe({
                    guid: this._contextObj.getGuid(),
                    val: true,
                    callback: dojoLang.hitch(this, this._handleValidation)
                });

                this._handles = [ objectHandle, attrHandle, validationHandle ];
            }
        }
    });
});

require(["CopyURL/widget/CopyURL"], function() {
    "use strict";
});
