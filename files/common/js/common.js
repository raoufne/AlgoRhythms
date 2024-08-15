document.addEventListener('DOMContentLoaded', function() {
    const aboutButton = document.getElementById('about-button');
    const aboutPopup = document.getElementById('about-popup');
    const overlay = document.createElement('div');
    overlay.classList.add('transparent-dark-overlay');
    document.body.appendChild(overlay);

    const leftPanel = document.getElementById('left-panel');
    const rightPanel = document.getElementById('right-panel');
    const animationContainer = document.getElementById('animation-container');
	const mainContainer = document.getElementById('main-content');
	const animationArea = document.getElementById('animation-area');
	const mainGraph = document.getElementById('maingraph');



    const headerHeight = document.getElementById('header').offsetHeight;
    const footerHeight = document.getElementById('footer').offsetHeight;
	const buttonsHeight = document.getElementById('control-buttons').offsetHeight;
	const leftWidth = leftPanel.offsetWidth;
	const rightWidth = rightPanel.offsetWidth;
	



    const title = document.getElementById('title');
    const modesList = document.getElementById('modes-list');




    aboutButton.addEventListener('click', function() {
        aboutPopup.style.display = 'block';
        overlay.style.display = 'block';
    });

    overlay.addEventListener('click', function() {
        aboutPopup.style.display = 'none';
        overlay.style.display = 'none';
    });

    modesList.addEventListener('click', function(event) {
        if (event.target.classList.contains('mode-option')) {
            const selectedMode = event.target;
            const allModes = modesList.getElementsByClassName('mode-option');
            for (let mode of allModes) {
                mode.classList.remove('selected');
            }
            selectedMode.classList.add('selected');
            console.log('Selected mode:', selectedMode.textContent);
        }
    });



    function adjustAnimationContainer() {
        const windowHeight = window.innerHeight;
		const windowWidth = window.innerWidth;
        const availableHeight = windowHeight - (headerHeight + footerHeight + buttonsHeight);
		const availableWidth = windowWidth - (leftWidth + rightWidth);
		mainContainer.style.height = (availableHeight + buttonsHeight) + 'px';
        animationContainer.style.height = (mainContainer.offsetHeight - buttonsHeight) + 'px';
		animationArea.style.height = availableHeight + 'px';
		animationArea.style.width = availableWidth + 'px';

    }

    adjustAnimationContainer();

    window.addEventListener('resize', adjustAnimationContainer);
});
  $("[id*='-input']").on("keypress keydown keyup", (event) => {
          event.stopPropagation();
      });

function calculatePanelWidths() {
    const screenWidth = window.innerWidth;
    const panelWidth = screenWidth * 0.2;
    return panelWidth;
}

let pwidth = calculatePanelWidths();

// Update the widths on window resize
window.addEventListener('resize', function() {
    lpwidth = calculatePanelWidths();
    rpwidth = calculatePanelWidths();
});

var isPlaying = false;
var cur_slide = null;

function isLeftPanelOpen() {
    return ($('#left-panel').hasClass('open'));
}

function isRightPanelOpen() {
    return $('#right-panel').hasClass('open');
}

function showLeftPanel() {
        $('#left-panel').addClass('open').animate({
            width: "+=" + pwidth,
        }, 400, function() {
            $(this).css('display', 'block');
        });
}

function hideLeftPanel() { 
        $('#left-panel').removeClass('open').animate({
            width: "-=" + pwidth,
        }, 400, function() {
            $(this).css('display', 'none');
        });
}

function showRightPanel() {
         $('#right-panel').addClass('open').animate({
            width: "+=" + 1.5*pwidth,
        }, 400, function() {
            $(this).css('display', 'block');
        });
}

function hideRightPanel() {
        $('#right-panel').removeClass('open').animate({
            width: "-=" + 1.5*pwidth,
        }, 400, function() {
            $(this).css('display', 'none');
        });
}

function triggerPanels() {
	if(isLeftPanelOpen()){
		hideLeftPanel();
		if(!isAtEnd()){
		showRightPanel();
		play();
		}
	}
	else if(isRightPanelOpen()){
		hideRightPanel();
		pause();
		showLeftPanel();
	}
	else if(!isLeftPanelOpen()){
		showLeftPanel();
	}
}

$(function() {
	hideRightPanel();
	$('#right-panel').css('width', '0px');
	$('#left-panel').css('width', '0px');
	showLeftPanel();

});

var isPaused = false;

function isAtEnd() {
    return (gw.getCurrentIteration() == (gw.getTotalIteration() - 1));
}
function pause() {
    if (isPlaying) {
        isPaused = true;
        gw.pause();
        $('#play').show();
        $('#pause').hide();
    }
}
function play() {
    if (isPlaying) {
        isPaused = false;
        $('#pause').show();
        $('#play').hide();
        if (isAtEnd())
            gw.replay();
        else
            gw.play();
    }
}
function stepForward(numFrames) {
    if (isPlaying) {
        if (numFrames && Number.isInteger(numFrames)) {
            gw.jumpToIteration(gw.getCurrentIteration() + 7, 250);
        } else
            gw.forceNext(250);
    }
}
function stepBackward(numFrames) {
    if (isPlaying) {
        if (numFrames && Number.isInteger(numFrames)) {
            gw.jumpToIteration(gw.getCurrentIteration() - 7, 250);
        } else
            gw.forcePrevious(500);
    }
}
function goToBeginning() {
    if (isPlaying) {
        gw.jumpToIteration(0, 0);
        pause();
    }
}
function goToEnd() {
    if (isPlaying) {
        gw.jumpToIteration(gw.getTotalIteration() - 1, 0);
        pause();
    }
}
function stop() {
    try {
        gw.stop();
    } catch (err) {}
    isPaused = false;
    isPlaying = false;
    $('#pause').show();
    $('#play').hide();
}
function handlePreviousStep(event) {
    if (event.ctrlKey) {
        goToBeginning();
    } else {
        stepBackward();
    }
}
function handleNextStep(event) {
    if (event.ctrlKey) {
        goToEnd();
    } else {
        stepForward();
    }
}

function setDefaultScale(everything) {
    if (isPlaying)
        stop();
    isPlaying = false;
    
	gw.redrawAll(everything);
    }

function highlightLine(lineNumbers) {
    $('#codetrace p').css('background-color', 'black').css('color', 'white');
    if (lineNumbers instanceof Array) {
        for (var i = 0; i < lineNumbers.length; i++)
            if (lineNumbers[i] != 0)
                $('#code' + lineNumbers[i]).css('background-color', '#B2EBFF').css('color', 'black');
    } else
        $('#code' + lineNumbers).css('background-color', '#B2EBFF').css('color', 'black');
}

function addParagraphs(x) {
    var $codetrace = $('#codetrace');
    
    $codetrace.empty();
    
    for (var i = 1; i <= x; i++) {
        var $p = $('<p></p>').attr('id', 'code' + i);
        $codetrace.append($p);
    }
}

const OBJ_HIDDEN = -1;

const VERTEX_SHAPE_CIRCLE = "circle";
const VERTEX_DEFAULT = "default";
const VERTEX_HIGHLIGHTED = "highlighted";
const VERTEX_TRAVERSED = "traversed";

const EDGE_DEFAULT = "default";
const EDGE_HIGHLIGHTED = "highlighted";
const EDGE_TRAVERSED = "traversed";
const EDGE_TYPE_UDE = 0;

const NO_ITERATION = -1;
const NO_STATELIST = {};

const ANIMATION_PLAY = 1;
const ANIMATION_PAUSE = 0;
const ANIMATION_STOP = -1;

const UPDATE_FORWARD = true;
const UPDATE_BACKWARD = false;

const MAIN_SVG_WIDTH = document.getElementById('animation-area').offsetWidth-5;
const MAIN_SVG_HEIGHT = document.getElementById('animation-area').offsetHeight-document.getElementById('animation-background').offsetHeight-5;
const offsets = 5
const startOffset = "75%"

const graphVertexProperties = {
    "innerVertex": {
        "r": 18,//14
        "width": 34,
        "height": 34,
		"display":"none",
        "stroke-width": 0,
        "default": {
            "fill": "#eee",
            "stroke": "#fff"
        },
        "highlighted": {
            "fill": "#eee",
            "stroke": "#fff"
        },
        "traversed": {
            "fill": "#eee",
            "stroke": "#fff"
        },
},
    "outerVertex": {
        "width": 36,
        "height": 36,
        "default": {
			"href": "../common/icons/circle.png"
        },
        "highlighted": {
			"href": "../common/icons/circler.png"
        },
        "traversed": {
			"href": "../common/icons/circleb.png"
			
        },
    },
    "text": {
        "font-size": 16,
        "font-sizes": [16, 16, 15, 13, 9, 9],
        "extra-text-size": 14,
        "default": {
            "fill": null,
            "font-family": "'SilkscreenNormal', sans-serif",
            "font-weight": "bold",
            "text-anchor": "middle"
        },
         "highlighted": {
            "fill": null,
            "font-family": "'SilkscreenNormal', sans-serif",
            "font-weight": "bold",
            "text-anchor": "middle"
        },
        "traversed": {
            "fill": null,
            "font-family": "'SilkscreenNormal', sans-serif",
            "font-weight": "bold",
            "text-anchor": "middle"
        },
    },
    "label": {
        "font-size": 16,
        "default": {
            "fill": "#333",
            "font-family": "'SilkscreenNormal', sans-serif",
            "font-weight": "bold",
            "text-anchor": "middle"
        },
        "highlighted": {
            "fill": "#ff8a27",
            "font-family": "'SilkscreenNormal', sans-serif",
            "font-weight": "bold",
            "text-anchor": "middle"
        },
        "traversed": {
            "fill": "#ff8a27",
            "font-family": "'SilkscreenNormal', sans-serif",
            "font-weight": "bold",
            "text-anchor": "middle"
        },
    }
};

const graphEdgeProperties = {
    "animateHighlightedPath": {
        "stroke": "#EEFF77",//yellow
        "stroke-width": 2
    },
    "path": {
        "stroke-width": 1,
        "default": {
            "stroke": "#333"
        },
        "highlighted": {
            "stroke": "red"
        },
        "traversed": {
            "stroke": "#00BFFF"//blue
        },
    }
};

var mainSvg = d3.select("#animation-area")
    .append("svg")
    .attr("viewBox", "0 0 " + MAIN_SVG_WIDTH + " " + MAIN_SVG_HEIGHT)
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("id", "maingraph")
    .style("width", "100%")
    .style("height", "100%");

function deepCopy(obj){
	var newObj;
	if(obj instanceof Array){
		var i;newObj=[];
		for(i=0;i<obj.length;i++){
			newObj.push(deepCopy(obj[i]));
		}
	}
	else if(obj instanceof Object){
		newObj={};
		for(keys in obj){
			newObj[keys]=deepCopy(obj[keys]);
		}
	}
	else{
		newObj=obj;
	}
	return newObj;
}
