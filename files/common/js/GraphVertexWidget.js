var GraphVertexWidget = function(cx, cy, vertexText, vertexClassNumber) {
    var self = this;
    var defaultAnimationDuration = 250;
    var innerVertex;
    var outerVertex;
    var text;
    var extratext;
    var vertexExtraText;
    var id = vertexClassNumber;
    var cx = cx;
    var cy = cy;
    var normalCy = cy;
    var vertexProperties = graphVertexProperties;
    this.getId = function() {
        return id;
    }
    ;
    this.getCx = function() {
        return cx;
    }
    ;
    this.getCy = function() {
        return cy;
    }
    ;
    var textYaxisOffset = getAppropriateOffsetSize(vertexText) / 3;
    var attributeList = {
        "innerVertex": {
            "class": null,
            "cx": null,
            "cy": null,
            "x": null,
            "y": null,
            "fill": null,
            "r": null,
            "width": null,
            "height": null,
            "stroke": null,
            "stroke-width": null,
			"display": null
        },
        "outerVertex": {
            "class": null,
            "x": null,
            "y": null,
            "width": null,
            "height": null,
			"href":null
        },
        "text": {
            "class": null,
            "x": null,
            "y": null,
            "fill": null,
            "font-family": null,
            "font-weight": null,
            "font-size": null,
            "text-anchor": null,
            "text": null
        },
        "extratext": {
            "class": null,
            "x": null,
            "y": null,
            "fill": null,
            "font-family": null,
            "font-weight": null,
            "font-size": null,
            "text-anchor": null,
            "text": null
        },
    }
    function getAppropriateFontSize(text) {
        var textLength = text.toString().length;
        if (textLength >= 6)
            textLength = 6;
        if (textLength === 0)
            textLength = 1;
        return vertexProperties["text"]["font-sizes"][textLength - 1];
    }
    function getAppropriateOffsetSize(text) {
        var textLength = text.toString().length;
        if (textLength >= 6)
            textLength = 6;
        if (textLength === 0)
            textLength = 1;
        return graphVertexProperties["text"]["font-sizes"][textLength - 1];
    }
    var edgeList = {};
    init();
    this.redraw = function(duration) {
        draw(duration);
    }
    this.toggleLOD = function() {
        this.showVertex();
        if (attributeList["innerVertex"]["fill"] == "#eee")
            attributeList["text"]["fill"] = attributeList["outerVertex"]["fill"];
        else
            attributeList["text"]["fill"] = "#fff";
        this.redraw(defaultAnimationDuration);
    }
    this.toggleVertexNumber = function() {
        this.showVertex();
        this.redraw(defaultAnimationDuration);
    }
    this.showVertex = function() {
        attributeList["outerVertex"]["width"] = vertexProperties["outerVertex"]["width"];
        attributeList["outerVertex"]["height"] = vertexProperties["outerVertex"]["height"];
        attributeList["innerVertex"]["r"] = vertexProperties["innerVertex"]["r"];
        attributeList["innerVertex"]["width"] = vertexProperties["innerVertex"]["width"];
        attributeList["innerVertex"]["height"] = vertexProperties["innerVertex"]["height"];
        attributeList["innerVertex"]["stroke-width"] = vertexProperties["innerVertex"]["stroke-width"];
        attributeList["text"]["font-size"] = getAppropriateFontSize(vertexText);
        attributeList["extratext"]["y"] = cy + textYaxisOffset + 26;
        attributeList["text"]["x"] = cx;
        attributeList["extratext"]["font-size"] = vertexProperties["text"]["extra-text-size"];
    }
    this.hideVertex = function() {
        attributeList["outerVertex"]["width"] = 0;
        attributeList["outerVertex"]["height"] = 0;
        attributeList["innerVertex"]["r"] = 0;
        attributeList["innerVertex"]["width"] = 0;
        attributeList["innerVertex"]["height"] = 0;
        attributeList["innerVertex"]["stroke-width"] = 0;
        attributeList["text"]["font-size"] = 0;
        attributeList["extratext"]["font-size"] = 0;
    }
    this.moveVertex = function(cx, cy) {
        attributeList["outerVertex"]["x"] = cx - vertexProperties["outerVertex"]["width"] / 2;
        attributeList["outerVertex"]["y"] = cy - vertexProperties["outerVertex"]["height"] / 2;
        attributeList["innerVertex"]["cx"] = cx;
        attributeList["innerVertex"]["cy"] = cy;
        attributeList["innerVertex"]["x"] = cx - vertexProperties["innerVertex"]["width"] / 2;
        attributeList["innerVertex"]["y"] = cy - vertexProperties["innerVertex"]["height"] / 2;
        attributeList["text"]["x"] = cx;
        attributeList["text"]["y"] = cy + textYaxisOffset;
        attributeList["extratext"]["x"] = cx;
        var extraOffset = 26;
        attributeList["extratext"]["y"] = cy + textYaxisOffset + extraOffset;
        var key;
        for (key in edgeList)
            edgeList[key].refreshPath();
    }
    this.setVertexLocation = function(newCx, newCy) {
        cx = newCx;
        cy = newCy;
    }
    this.changeText = function(newVertexText) {
        vertexText = newVertexText;
        attributeList["text"]["text"] = newVertexText;
        attributeList["text"]["font-size"] = getAppropriateFontSize(newVertexText);
    }
    this.changeExtraText = function(newVertexExtraText) {
        vertexExtraText = newVertexExtraText;
        attributeList["extratext"]["text"] = newVertexExtraText;
    }
    this.changeTextFontSize = function(newTextSize) {
        if (newTextSize == null || isNaN(newTextSize))
            return;
        attributeList["text"]["font-size"] = newTextSize;
        attributeList["extratext"]["font-size"] = newTextSize;
    }
    this.changeRadius = function(newRadiusInner) {
        if (newRadiusInner == null || isNaN(newRadiusInner))
            return;
        attributeList["innerVertex"]["r"] = newRadiusInner;
    }
    this.changeWidth = function(newWidthInner, newWidthOuter) {
        if (newWidthInner == null || isNaN(newWidthInner))
            return;
        attributeList["innerVertex"]["width"] = newWidthInner;
        if (newWidthOuter == null || isNaN(newWidthOuter))
            return;
        attributeList["outerVertex"]["width"] = newWidthOuter;
    }
    this.changeHeight = function(newHeightInner, newHeightOuter) {
        if (newHeightInner == null || isNaN(newHeightInner))
            return;
        attributeList["innerVertex"]["height"] = newHeightInner;
        if (newHeightOuter == null || isNaN(newHeightOuter))
            return;
        attributeList["outerVertex"]["height"] = newHeightOuter;
    }

    this.changeStrokeWidth = function(newStrokeWidthInner) {
        if (newStrokeWidthInner == null || isNaN(newStrokeWidthInner))
            return;
        attributeList["innerVertex"]["stroke-width"] = newStrokeWidthInner;
    }
    this.removeVertex = function() {
        outerVertex.remove();
        innerVertex.remove();
        text.remove();
        extratext.remove();
    }
    this.stateVertex = function(stateName) {
        var key;
        for (key in vertexProperties["innerVertex"][stateName])
            attributeList["innerVertex"][key] = vertexProperties["innerVertex"][stateName][key];
        for (key in vertexProperties["outerVertex"][stateName])
            attributeList["outerVertex"][key] = vertexProperties["outerVertex"][stateName][key];
        for (key in vertexProperties["text"][stateName])
            attributeList["text"][key] = vertexProperties["text"][stateName][key];
    }
    this.getAttributes = function() {
        return deepCopy(attributeList);
    }
    this.getClassNumber = function() {
        return vertexClassNumber;
    }
    this.addEdge = function(graphEdge) {
        edgeList[graphEdge.getAttributes()["id"]] = graphEdge;
    }
    this.removeEdge = function(graphEdge) {
        if (edgeList[graphEdge.getAttributes()["id"]] == null || edgeList[graphEdge.getAttributes()["id"]] == undefined)
            return;
        delete edgeList[graphEdge.getAttributes()["id"]];
    }
    this.getEdge = function() {
        var reply = [];
        var key;
        for (key in edgeList)
            reply.push(edgeList[key]);
        return reply;
    }
    function init() {
        outerVertex = vertexSvg.append('image');
        innerVertex = vertexSvg.append('circle');
        text = vertexTextSvg.append("text");
        extratext = vertexTextSvg.append("text");
        attributeList["innerVertex"]["class"] = "v" + vertexClassNumber + " inner";
        attributeList["innerVertex"]["cx"] = cx;
        attributeList["innerVertex"]["cy"] = cy;
        attributeList["innerVertex"]["x"] = cx - vertexProperties["innerVertex"]["width"] / 2;
        attributeList["innerVertex"]["y"] = cy - vertexProperties["innerVertex"]["height"] / 2;
        attributeList["innerVertex"]["fill"] = vertexProperties["innerVertex"]["default"]["fill"];
        attributeList["innerVertex"]["r"] = 0;
        attributeList["innerVertex"]["width"] = 0;
        attributeList["innerVertex"]["height"] = 0;
        attributeList["innerVertex"]["stroke"] = vertexProperties["innerVertex"]["default"]["stroke"];
        attributeList["innerVertex"]["stroke-width"] = 0;
		attributeList["innerVertex"]["display"] = vertexProperties["innerVertex"]["display"];
        attributeList["outerVertex"]["class"] = "v" + vertexClassNumber + " outer";
        attributeList["outerVertex"]["x"] = cx - vertexProperties["outerVertex"]["width"] / 2;
        attributeList["outerVertex"]["y"] = cy - vertexProperties["outerVertex"]["height"] / 2;
        attributeList["outerVertex"]["width"] = 0;
        attributeList["outerVertex"]["height"] = 0;
        attributeList["outerVertex"]["href"] = vertexProperties["outerVertex"]["default"]["href"];		
        attributeList["text"]["class"] = "v" + vertexClassNumber;
        attributeList["text"]["x"] = cx;
        attributeList["text"]["y"] = cy + textYaxisOffset;
        attributeList["text"]["fill"] = vertexProperties["text"]["default"]["fill"];
        attributeList["text"]["font-family"] = vertexProperties["text"]["default"]["font-family"];
        attributeList["text"]["font-size"] = 0;
        attributeList["text"]["font-weight"] = vertexProperties["text"]["default"]["font-weight"];
        attributeList["text"]["text-anchor"] = vertexProperties["text"]["default"]["text-anchor"];
        attributeList["text"]["text"] = vertexText;
        attributeList["extratext"]["class"] = "v" + vertexClassNumber;
        attributeList["extratext"]["x"] = cx;
        attributeList["extratext"]["y"] = cy + textYaxisOffset + 26;
        attributeList["extratext"]["fill"] = "red";
        attributeList["extratext"]["font-family"] = vertexProperties["text"]["default"]["font-family"];
        attributeList["extratext"]["font-size"] = 0;
        attributeList["extratext"]["font-weight"] = vertexProperties["text"]["default"]["font-weight"];
        attributeList["extratext"]["text-anchor"] = vertexProperties["text"]["default"]["text-anchor"];
        attributeList["extratext"]["text"] = "";
        innerVertex.attr("class", attributeList["innerVertex"]["class"]).classed("inner", true);
        outerVertex.attr("class", attributeList["outerVertex"]["class"]).classed("outer", true);
        text.attr("class", attributeList["text"]["class"]);
        extratext.attr("class", attributeList["extratext"]["class"]);
        innerVertex.attr("cx", attributeList["innerVertex"]["cx"]).attr("cy", attributeList["innerVertex"]["cy"]).attr("x", attributeList["innerVertex"]["x"]).attr("y", attributeList["innerVertex"]["y"]).attr("fill", attributeList["innerVertex"]["fill"]).attr("r", attributeList["innerVertex"]["r"]).attr("width", attributeList["innerVertex"]["width"]).attr("height", attributeList["innerVertex"]["height"]).attr("stroke", attributeList["innerVertex"]["stroke"]).attr("stroke-width", attributeList["innerVertex"]["stroke-width"]).attr("display", attributeList["innerVertex"]["display"]);
        outerVertex.attr("x", attributeList["outerVertex"]["x"]).attr("y", attributeList["outerVertex"]["y"]).attr("width", attributeList["outerVertex"]["width"]).attr("height", attributeList["outerVertex"]["height"]).attr("href", attributeList["outerVertex"]["href"]);
        text.attr("x", attributeList["text"]["x"]).attr("y", attributeList["text"]["y"]).attr("fill", attributeList["text"]["fill"]).attr("font-family", attributeList["text"]["font-family"]).attr("font-size", attributeList["text"]["font-size"]).attr("font-weight", attributeList["text"]["font-weight"]).attr("text-anchor", attributeList["text"]["text-anchor"]).text(function() {
            return attributeList["text"]["text"];
        });
        extratext.attr("x", attributeList["extratext"]["x"]).attr("y", attributeList["extratext"]["y"]).attr("fill", attributeList["extratext"]["fill"]).attr("font-family", attributeList["extratext"]["font-family"]).attr("font-size", attributeList["extratext"]["font-size"]).attr("font-weight", attributeList["extratext"]["font-weight"]).attr("text-anchor", attributeList["extratext"]["text-anchor"]).text(function() {
            return attributeList["extratext"]["text"];
        });
    }
    function draw(dur) {
        if (dur == null || isNaN(dur))
            dur = defaultAnimationDuration;
        if (dur <= 0)
            dur = 1;
        innerVertex.transition().duration(dur).attr("cx", attributeList["innerVertex"]["cx"]).attr("cy", attributeList["innerVertex"]["cy"]).attr("x", attributeList["innerVertex"]["x"]).attr("y", attributeList["innerVertex"]["y"]).attr("fill", attributeList["innerVertex"]["fill"]).attr("r", attributeList["innerVertex"]["r"]).attr("width", attributeList["innerVertex"]["width"]).attr("height", attributeList["innerVertex"]["height"]).attr("stroke", attributeList["innerVertex"]["stroke"]).attr("stroke-width", attributeList["innerVertex"]["stroke-width"]).attr("display", attributeList["innerVertex"]["display"]);
        outerVertex.transition().duration(dur).attr("x", attributeList["outerVertex"]["x"]).attr("y", attributeList["outerVertex"]["y"]).attr("width", attributeList["outerVertex"]["width"]).attr("height", attributeList["outerVertex"]["height"]).attr("href", attributeList["outerVertex"]["href"]);
        text.transition().duration(dur).attr("x", attributeList["text"]["x"]).attr("y", attributeList["text"]["y"]).attr("fill", attributeList["text"]["fill"]).attr("font-family", attributeList["text"]["font-family"]).attr("font-size", attributeList["text"]["font-size"]).attr("font-weight", attributeList["text"]["font-weight"]).attr("text-anchor", attributeList["text"]["text-anchor"]).text(function() {
            return attributeList["text"]["text"];
        });
        extratext.transition().duration(dur).attr("x", attributeList["extratext"]["x"]).attr("y", attributeList["extratext"]["y"]).attr("fill", attributeList["extratext"]["fill"]).attr("font-family", attributeList["extratext"]["font-family"]).attr("font-size", attributeList["extratext"]["font-size"]).attr("font-weight", attributeList["extratext"]["font-weight"]).attr("text-anchor", attributeList["extratext"]["text-anchor"]).text(function() {
            return attributeList["extratext"]["text"];
        });
    }
}
