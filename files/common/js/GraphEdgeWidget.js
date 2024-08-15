var GraphEdgeWidget = function(graphVertexA, graphVertexB, edgeIdNumber, strokeWidth=1) {
    var self = this;
    var defaultAnimationDuration = 250;
    var line, clickableArea;
    var vertexAId = graphVertexA.getId();
    var vertexBId = graphVertexB.getId();
    var edgeProperties = graphEdgeProperties;
    var strokeWidth = strokeWidth;
    var edgeGenerator = d3.svg.line().x(function(d) {
        return d.x;
    }).y(function(d) {
        return d.y;
    }).interpolate("linear");
    var lineCommand = edgeGenerator(calculatePath());
    var initCommand=edgeGenerator([calculatePath()[0],calculatePath()[0],calculatePath()[0]]);
    var attributeList = {
        "path": {
            "id": null,
            "class": null,
            "d": null,
            "stroke": null,
            "stroke-width": null,
        }
    };
    var mainSvg = mainSvg;
    updatePath();
    init();
    this.redraw = function(duration) {
        draw(duration);
    }
    ;
    this.animateHighlighted = function(duration) {
        if (duration == null || isNaN(duration))
            duration = defaultAnimationDuration;
        if (duration <= 0)
            duration = 1;
        edgeSvg.append("path").attr("id", "tempEdge" + line.attr("id")).attr("stroke", edgeProperties["animateHighlightedPath"]["stroke"]).attr("stroke-width", edgeProperties["animateHighlightedPath"]["stroke-width"]).transition().duration(duration).each("start", function() {
            edgeSvg.select("#tempEdge" + line.attr("id")).attr("d", initCommand);
        }).attr("d", lineCommand).each("end", function() {
            line.attr("stroke", edgeProperties["path"]["highlighted"]["stroke"]).attr("stroke-width", edgeProperties["path"]["stroke-width"]);
            edgeSvg.select("#tempEdge" + line.attr("id")).remove();
            draw(0);
        })
    }
    this.showEdge = function() {
        attributeList["path"]["d"] = lineCommand;
        attributeList["path"]["stroke-width"] = edgeProperties["path"]["stroke-width"];
    }
    this.hideEdge = function() {
        attributeList["path"]["d"] = initCommand;
    }
    this.stateEdge = function(stateName) {
        var key;
        for (key in edgeProperties["path"][stateName])
            attributeList["path"][key] = edgeProperties["path"][stateName][key];
    }
    this.removeEdge = function() {
        graphVertexA.removeEdge(self);
        graphVertexB.removeEdge(self);
        line.remove();
    }
    this.refreshPath = function() {
        var tempInit = initCommand;
        updatePath();
        if (attributeList["path"]["d"] == tempInit)
            attributeList["path"]["d"] = initCommand;
        else
            attributeList["path"]["d"] = lineCommand;
    }
    this.changeVertexA = function(newGraphVertexA) {
        var edgeDrawn = false;
        if (attributeList["path"]["d"] == lineCommand)
            edgeDrawn = true;
        graphVertexA.removeEdge(self);
        graphVertexA = newGraphVertexA;
        updatePath();
        lineCommand = edgeGenerator(calculatePath());
        initCommand=edgeGenerator([calculatePath()[0]]);
        attributeList["path"]["d"] = initCommand;
        graphVertexA.addEdge(self);
        if (edgeDrawn)
            attributeList["path"]["d"] = lineCommand;
    }
    this.changeVertexB = function(newGraphVertexB) {
        var edgeDrawn = false;
        if (attributeList["path"]["d"] == lineCommand)
            edgeDrawn = true;
        graphVertexB.removeEdge(self);
        graphVertexB = newGraphVertexB;
        updatePath();
        lineCommand = edgeGenerator(calculatePath());
        initCommand=edgeGenerator([calculatePath()[0]]);
        attributeList["path"]["d"] = initCommand;
        graphVertexB.addEdge(self);
        if (edgeDrawn)
            attributeList["path"]["d"] = lineCommand;
    }

    this.changeStrokeWidth = function(newStrokeWidth) {
        strokeWidth = newStrokeWidth;
        attributeList["path"]["stroke-width"] = newStrokeWidth;
    }
    this.getVertex = function() {
        return [graphVertexA, graphVertexB];
    }
    this.getAttributes = function() {
        return deepCopy(attributeList["path"]);
    }
    this.toggleLOD = function() {
        edgeProperties = graphEdgeProperties;
        updatePath();
        this.showEdge();
        this.redraw(defaultAnimationDuration);
    }
    function init() {
        attributeList["path"]["id"] = "e" + edgeIdNumber;
        attributeList["path"]["d"] = initCommand;
        attributeList["path"]["stroke"] = edgeProperties["path"]["default"]["stroke"];
        attributeList["path"]["stroke-width"] = strokeWidth;
        attributeList["path"]["class"] = "ude";
        line = edgeSvg.append("path");
        line.attr("id", attributeList["path"]["id"]).attr("class", attributeList["path"]["class"]);
        try {
            if (attributeList["path"]["d"] != "MNaN,NaNLNaN,NaN")
                line.attr("d", attributeList["path"]["d"]).attr("stroke", attributeList["path"]["stroke"]).attr("stroke-width", attributeList["path"]["stroke-width"]);
        } catch (err) {}
    }
    function cxA() {
        if (graphVertexA)
            return parseFloat(graphVertexA.getAttributes()["innerVertex"]["cx"]);
    }
    function cyA() {
        if (graphVertexA)
            return parseFloat(graphVertexA.getAttributes()["innerVertex"]["cy"]);
    }
    function rA() {
        if (graphVertexA)
            return parseFloat(graphVertexA.getAttributes()["innerVertex"]["r"]);
    }
    function cxB() {
        if (graphVertexA)
            return parseFloat(graphVertexB.getAttributes()["innerVertex"]["cx"]);
    }
    function cyB() {
        if (graphVertexA)
            return parseFloat(graphVertexB.getAttributes()["innerVertex"]["cy"]);
    }
    function rB() {
        if (graphVertexA)
            return parseFloat(graphVertexB.getAttributes()["innerVertex"]["r"]);
    }
    function calculatePath() {
        var x1=cxA();
		var x2=cxB();
		var y1=cyA();
		var y2=cyB();
        var dx = cxB() - cxA();
        var dy = cyB() - cyA();
        var offsetX = dy / Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        var offsetY = -dx / Math.sqrt((Math.pow(dx, 2) + Math.pow(dy, 2)));
        var pts = getVertexLineIntersectionPoint(x1, y1, x2, y2, rA(), x1, y1);
        var pts2 = getVertexLineIntersectionPoint(x1, y1, x2, y2, rB(), x2, y2);
        var min = 5000;
        var save1 = 0
          , save2 = 0;
        for (var i = 1; i <= 3; i += 2)
            for (var j = 1; j <= 3; j += 2) {
                var d = Math.sqrt((pts[i - 1] - pts2[j - 1]) * (pts[i - 1] - pts2[j - 1]) + (pts[i] - pts2[j]) * (pts[i] - pts2[j]));
                if (d < min) {
                    min = d;
                    save1 = i;
                    save2 = j;
                }
            }
        var beginPoint = {
            "x": pts[save1 - 1],
            "y": pts[save1]
        };
        var endPoint = {
            "x": pts2[save2 - 1],
            "y": pts2[save2]
        };
        return [beginPoint, endPoint];
    }
    function getVertexLineIntersectionPoint(x1, y1, x2, y2, r, cx, cy) {
        var baX = x2 - x1;
        var baY = y2 - y1;
        var caX = cx - x1;
        var caY = cy - y1;
        var a = baX * baX + baY * baY;
        var bBy2 = baX * caX + baY * caY;
        var c = caX * caX + caY * caY - r * r;
        var pBy2 = bBy2 / a;
        var q = c / a;
        var disc = pBy2 * pBy2 - q;
        var tmpSqrt = Math.sqrt(disc);
        var abScalingFactor1 = -pBy2 + tmpSqrt;
        var abScalingFactor2 = -pBy2 - tmpSqrt;
        var r_x1 = x1 - baX * abScalingFactor1;
        var r_y1 = y1 - baY * abScalingFactor1
        var r_x2 = x1 - baX * abScalingFactor2;
        var r_y2 = y1 - baY * abScalingFactor2
        var res = new Array();
        res[0] = r_x1;
        res[1] = r_y1;
        res[2] = r_x2;
        res[3] = r_y2;
        return res;
    }
    function draw(dur) {
        if (dur == null || isNaN(dur))
            dur = defaultAnimationDuration;
        if (dur <= 0)
            dur = 1;
        line.attr("class", attributeList["path"]["class"]);
        line.transition().duration(dur).attr("d", attributeList["path"]["d"]).attr("stroke", attributeList["path"]["stroke"]).attr("stroke-width", attributeList["path"]["stroke-width"]);
    }
    function updatePath() {
        lineCommand = edgeGenerator(calculatePath());
        initCommand = edgeGenerator([calculatePath()[0], calculatePath()[0]]);
    }
}
