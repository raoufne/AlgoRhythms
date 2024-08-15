var GraphWidget = function() {
    var self = this;
    var vertexList = {};
    var edgeList = {};
    var vertexUpdateList = {};
    var edgeUpdateList = {};
    var currentIteration = NO_ITERATION;
    var animationStateList = NO_STATELIST;
    var animationStatus = ANIMATION_STOP;
    var animationDuration = 500;
    var scaleFactor = 1;
    var anchorSet = false;
    this.clearAll = function() {
        if (mainSvg.select("#edge").empty())
            edgeSvg = mainSvg.append("g").attr("id", "edge");
        if (mainSvg.select("#vertex").empty())
            vertexSvg = mainSvg.append("g").attr("id", "vertex");
        if (mainSvg.select("#vertexText").empty())
            vertexTextSvg = mainSvg.append("g").attr("id", "vertexText");
    }
    self.clearAll();
    this.addVertex = function(cx, cy, vertexText, vertexClassNumber, show, extraText) {
        if (show != false)
            show = true;
        var newVertex = new GraphVertexWidget(cx,cy,vertexText,vertexClassNumber);
        if (extraText != "")
            newVertex.changeExtraText(extraText);
        vertexList[vertexClassNumber] = newVertex;
        vertexUpdateList[vertexClassNumber] = false;
        if (show == true) {
            vertexList[vertexClassNumber].showVertex();
            vertexList[vertexClassNumber].redraw();
        }
    }
    this.addEdge = function(vertexClassA, vertexClassB, edgeIdNumber, show, strokeWidth) {
        try {
            if (show != false)
                show = true;
            if (strokeWidth == null || isNaN(strokeWidth))
                strokeWidth = 3;i
            var vertexA = vertexList[vertexClassA];
            var vertexB = vertexList[vertexClassB];
            var newEdge = new GraphEdgeWidget(vertexA,vertexB,edgeIdNumber,strokeWidth);
            edgeList[edgeIdNumber] = newEdge;
            edgeUpdateList[edgeIdNumber] = false;
            vertexList[vertexClassA].addEdge(newEdge);
            vertexList[vertexClassB].addEdge(newEdge);
            if (show == true) {
                edgeList[edgeIdNumber].showEdge();
                edgeList[edgeIdNumber].redraw();
            }
            return newEdge;
        } catch (err) {}
    }
    this.removeEdge = function(edgeIdNumber) {
        if (edgeList[edgeIdNumber] == null || edgeList[edgeIdNumber] == undefined)
            return;
        edgeList[edgeIdNumber].removeEdge();
        delete edgeList[edgeIdNumber];
        delete edgeUpdateList[edgeIdNumber];
    }
    this.removeVertex = function(vertexClassNumber) {
        if (vertexList[vertexClassNumber] == null || vertexUpdateList[vertexClassNumber] == undefined)
            return;
        vertexList[vertexClassNumber].removeVertex();
        delete vertexList[vertexClassNumber];
        delete vertexUpdateList[vertexClassNumber];
    }
    this.updateGraph = function(graphState, duration) {
        if (duration == null || isNaN(duration))
            duration = animationDuration;
        updateDisplay(graphState, duration);
    }
    this.startAnimation = function(stateList, callback) {
        anchorSet = false;
        if (stateList != null)
            animationStateList = stateList;
        currentIteration = 0;
        self.play(callback);
    }
    this.animate = function(callback) {
        if (currentIteration >= animationStateList.length && animationStatus != ANIMATION_STOP)
            animationStatus = ANIMATION_PAUSE;
        if (currentIteration == animationStateList.length - 1) {
            if (typeof callback === 'function')
                callback();
        }
        if (animationStatus == ANIMATION_PAUSE || animationStatus == ANIMATION_STOP)
            return;
        self.next(animationDuration);
        setTimeout(function() {
            self.animate(callback);
        }, animationDuration);
    }
    this.play = function(callback) {
        if (currentIteration < 0)
            currentIteration = 0;
        if (animationStatus == ANIMATION_STOP) {
            animationStatus = ANIMATION_PLAY;
            updateDisplay(animationStateList[currentIteration], animationDuration);
            setTimeout(function() {
                self.animate(callback);
            }, animationDuration);
        } else {
            animationStatus = ANIMATION_PLAY;
            self.animate(callback);
        }
    }
    this.pause = function() {
        animationStatus = ANIMATION_PAUSE;
    }
    this.stop = function() {
        self.jumpToIteration(animationStateList.length - 1, 0);
        currentIteration = animationStateList.length - 1;
        animationStatus = ANIMATION_STOP;
        var currentVertexState = animationStateList[currentIteration]["vl"];
        var currentEdgeState = animationStateList[currentIteration]["el"];
        var key;
        for (key in currentEdgeState)
            edgeUpdateList[key] = true;
        for (key in edgeUpdateList)
            if (edgeUpdateList[key] == false)
                self.removeEdge(key);
        for (key in currentVertexState)
            vertexUpdateList[key] = true;
        for (key in vertexUpdateList)
            if (vertexUpdateList[key] == false)
                self.removeVertex(key);
        for (key in edgeUpdateList)
            edgeUpdateList[key] = false;
        for (key in vertexUpdateList)
            vertexUpdateList[key] = false;
        animationStateList = NO_STATELIST;
        currentIteration = NO_ITERATION;
    }
    this.next = function(duration) {
        if (currentIteration < 0)
            currentIteration = 0;
        currentIteration++;
        if (currentIteration >= animationStateList.length) {
            currentIteration = animationStateList.length - 1;
            return;
        }
        updateDisplay(animationStateList[currentIteration], duration);
    }
    this.previous = function(duration) {
        if (currentIteration >= animationStateList.length)
            currentIteration = animationStateList.length - 1;
        currentIteration--;
        if (currentIteration < 0)
            return;
        updateDisplay(animationStateList[currentIteration], duration);
    }
    this.forceNext = function(duration) {
        self.pause();
        self.next(duration);
    }
    this.forcePrevious = function(duration) {
        self.pause();
        self.previous(duration);
    }
	this.jumpToIteration=function(iteration,duration){
		currentIteration=iteration;
		if(currentIteration>=animationStateList.length)
			currentIteration=animationStateList.length-1;
		if(currentIteration<0)currentIteration=0;
		updateDisplay(animationStateList[currentIteration],duration);
		}

    this.replay = function() {
        self.jumpToIteration(0, 0);
        setTimeout(function() {
            self.play()
        }, 500);
    }
    this.getCurrentIteration = function() {
        return currentIteration;
    }
    this.getTotalIteration = function() {
        return Object.keys(animationStateList).length;
    }
    this.getAnimationDuration = function() {
        return animationDuration;
    }
    this.getCurrentState = function() {
        return animationStateList[currentIteration];
    }
    this.setAnimationDuration = function(duration) {
        animationDuration = duration;
    }
    this.removeAll = function() {
        var key;
        for (key in edgeList)
            edgeList[key].removeEdge();
        for (key in vertexList)
            vertexList[key].removeVertex();
        edgeList = {};
        vertexList = {};
        vertexUpdateList = {};
        edgeUpdateList = {};

    }
    this.redrawAll = function() {
        var key;
        for (key in vertexList)
            vertexList[key].toggleLOD();
        for (key in edgeList)
            edgeList[key].toggleLOD();
    }



    function updateDisplayForVertices(currentVertexState, duration) {
        anchorSet = true;
        var key;
        for (key in currentVertexState) {
            if (vertexList[key] == null || vertexList[key] == undefined) {
                    self.addVertex(currentVertexState[key]["cx"], currentVertexState[key]["cy"], currentVertexState[key]["text"], key, false);
            }
            var currentVertex = vertexList[key];
            currentVertex.showVertex();
            if (currentVertexState[key]["state"] == OBJ_HIDDEN)
                currentVertex.hideVertex();
            else if (currentVertexState[key]["state"] != null)
                currentVertex.stateVertex(currentVertexState[key]["state"]);
            else
                currentVertex.stateVertex(VERTEX_DEFAULT);
            currentVertex.moveVertex(currentVertexState[key]["cx"], currentVertexState[key]["cy"]);

            if (currentVertexState[key]["state"] != OBJ_HIDDEN)
                currentVertex.changeText(currentVertexState[key]["text"]);
            if (currentVertexState[key]["text-font-size"] != null)
                currentVertex.changeTextFontSize(currentVertexState[key]["text-font-size"]);
            if (currentVertexState[key]["inner-r"] != null)
                currentVertex.changeRadius(currentVertexState[key]["inner-r"]);
            if (currentVertexState[key]["inner-w"] != null && currentVertexState[key]["outer-w"] != null)
                currentVertex.changeWidth(currentVertexState[key]["inner-w"], currentVertexState[key]["outer-w"]);
            if (currentVertexState[key]["inner-h"] != null && currentVertexState[key]["outer-h"] != null)
                currentVertex.changeHeight(currentVertexState[key]["inner-h"], currentVertexState[key]["outer-h"]);
            if (currentVertexState[key]["inner-stroke-width"] != null)
                currentVertex.changeStrokeWidth(currentVertexState[key]["inner-stroke-width"]);
            if (currentVertexState[key]["extratext"] == null)
                currentVertex.changeExtraText("");
            else
                currentVertex.changeExtraText(currentVertexState[key]["extratext"]);
            currentVertex.redraw(duration);
            vertexUpdateList[key] = true;
        }
        for (key in vertexUpdateList) {
            if (vertexUpdateList[key] == false) {
                vertexList[key].hideVertex();
                vertexList[key].redraw(duration);
                vertexUpdateList[key] = true;
            }
        }
        for (key in vertexUpdateList)
            vertexUpdateList[key] = false;
    }
    function updateDisplayForEdges(currentEdgeState, duration) {
        var key;
        try {
            for (key in currentEdgeState) {
                if (edgeList[key] == null || edgeList[key] == undefined)
                    self.addEdge(currentEdgeState[key]["vertexA"], currentEdgeState[key]["vertexB"], key, false);
                var currentEdge = edgeList[key];
                currentEdge.showEdge();
                if (currentEdgeState[key]["state"] == OBJ_HIDDEN)
                    currentEdge.hideEdge();
                else if (currentEdgeState[key]["state"] != null)
                    currentEdge.stateEdge(currentEdgeState[key]["state"]);
                else
                    currentEdge.stateEdge(EDGE_DEFAULT);
                currentEdge.changeVertexA(vertexList[currentEdgeState[key]["vertexA"]]);
                currentEdge.changeVertexB(vertexList[currentEdgeState[key]["vertexB"]]);
                if (currentEdgeState[key]["type"] == null)
                    currentEdgeState[key]["type"] = EDGE_TYPE_UDE;
                if (currentEdgeState[key]["stroke-width"] != null)
                    currentEdge.changeStrokeWidth(currentEdgeState[key]["stroke-width"]);
                currentEdge.refreshPath();
                if (currentEdgeState[key]["animateHighlighted"] == null || !currentEdgeState[key]["animateHighlighted"])
                    currentEdge.redraw(duration);
                else
                    currentEdge.animateHighlighted(duration * 0.9);
                edgeUpdateList[key] = currentEdgeState[key]["state"] !== OBJ_HIDDEN;
            }
            for (key in edgeUpdateList) {
                if (edgeUpdateList[key] == false) {
                    edgeList[key].hideEdge();
                    edgeList[key].redraw(duration);
                    edgeUpdateList[key] = true;
                }
            }
            for (key in edgeUpdateList)
                edgeUpdateList[key] = false;
        } catch (err) {}
    }
    function updateStatus(statusText) {
        $('#status-subtitles p').html(statusText);
        $('#status p').html(statusText);
    }
    function updateDisplay(graphState, duration) {
        var lastIteration = Object.keys(animationStateList).length - 1;
        try {
            $('#progress-bar').slider("value", currentIteration);
            updateStatus(animationStateList[currentIteration]["status"]);
            $("#info").html(animationStateList[currentIteration]["info"]);
            highlightLine(animationStateList[currentIteration]["lineNo"]);
            if (currentIteration == lastIteration) {
                pause();
                var imgUrl = $('#play img').attr("src");
                if (imgUrl) {
                    $('#play img').attr("src", imgUrl.replace('/play.png', '/replay.png').replace('/pause.png', '/replay.png'));
                    $('#mobile-playback-play img').attr("src", imgUrl.replace('/play.png', '/replay.png').replace('/pause.png', '/replay.png'));
                }
                $('#play img').attr('alt', 'replay').attr('title', 'replay');
                $('#mobile-playback-play img').attr('alt', 'replay').attr('title', 'replay');
            } else {
                var imgUrl = $('#play img').attr("src");
                if (imgUrl) {
                    $('#play img').attr("src", imgUrl.replace('/replay.png', '/play.png').replace('/pause.png', '/play.png'));
                    $('#mobile-playback-play img').attr("src", imgUrl.replace('/replay.png', '/play.png').replace('/pause.png', '/play.png'));
                }
                $('#play img').attr('alt', 'play').attr('title', 'play');
                $('#mobile-playback-play img').attr('alt', 'play').attr('title', 'play');
            }
        } catch (error) {}
        updateDisplayForVertices(graphState["vl"], duration);
        updateDisplayForEdges(graphState["el"], duration);
    }
}
