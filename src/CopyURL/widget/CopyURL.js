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
        templateString: widgetTemplate,

        // DOM elements
        copySelectNode: null,
        copyInputNode: null,
        infoTextNode: null,

        // Parameters configured in the Modeler.
        targetAttribute: "",

        _contextObj: null,

        postCreate: function() {
            
            this._updateRendering();
            this._setupEvents();
        },

        update: function(obj, callback) {

            this._contextObj = obj;
            this._updateRendering();

            callback();
        },

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

        _updateRendering: function() {
 
            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");

                var toCopyValue = this._contextObj.get(this.targetAttribute);
				
				if (this.prefix) {
					toCopyValue = this.prefix + toCopyValue;
				}

                this.copyInputNode.value = toCopyValue;

            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }
        }
    });
});

require(["CopyURL/widget/CopyURL"], function() {
    "use strict";
});
