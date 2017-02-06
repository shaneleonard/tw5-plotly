/*\
title: $:/plugins/shaneleonard/plotly/wrapper.js
type: application/javascript
module-type: widget

A widget for including Plotly charts in a Tiddlywiki.

\*/

(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var Widget = require("$:/core/modules/widgets/widget.js").widget;

var Plotly = require("$:/plugins/shaneleonard/plotly/plotly-latest.js");

var PlotlyWidget = function(parseTreeNode,options) {
    this.initialise(parseTreeNode,options);
};

/*
 * Inherit from the base widget class
 */
PlotlyWidget.prototype = new Widget();

/*
 * Render this widget into the DOM
 */
PlotlyWidget.prototype.render = function(parent, nextSibling) {
    /* Save the parent dom node */
    this.parentDomNode = parent;

    /* Compute our attributes */
    this.computeAttributes();

    this.execute();

    /* Create the chart */
    var plot = this.createPlot();

    /* Insert the plot into the DOM */
    parent.insertBefore(plot.domNode,nextSibling);
    this.domNodes.push(plot.domNode);

    this.updatePlot = plot.updatePlot;

    if (this.updatePlot) {
        this.updatePlot();
    }

};

PlotlyWidget.prototype.createPlot = function(){
    var div = document.createElement("div");
    this.plotDiv = div;
    return {
        domNode: div,
        updatePlot: function() { Plotly.newPlot(div, this.plotData, this.plotLayout ? this.plotLayout : {autosize: true}); }
    }
};

/*
 * Compute the widget attributes
 */
PlotlyWidget.prototype.execute = function() {
    var d = this.getAttribute("data");
    this.plotData = this.wiki.getTiddlerData(d);

    if (this.hasAttribute("layout")) {
        var l = this.getAttribute("layout");
        this.plotLayout = this.wiki.getTiddlerData(l);
    }
};

/*
Selectively refreshes the widget if needed. Returns true if the widget or any of its children needed re-rendering
*/
PlotlyWidget.prototype.refresh = function(changedTiddlers) {
    var changedAttributes = this.computeAttributes();
    if (changedAttributes)
    {
        Plotly.Plots.resize(this.plotDiv);
        return true;
    }
    else
    {
        return false;
    }
};

exports.plotly = PlotlyWidget;

})();
