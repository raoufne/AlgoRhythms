  var BST = function() {
    var self = this;
  
    var valueRange = [-999, 999];
    var maxHeightAllowed = 5;
  
    var gw = new GraphWidget(false, true);
    this.getGraphWidget = function() { return gw; };
  
    var isAVL = false;
    this.getIsAVL = function() { return isAVL; };
  
    this.isAVL = function(bool) {
      if (typeof bool != 'boolean') return;
      if (bool != isAVL) {
        clearScreen();
        isAVL = bool;
        this.generateRandom();
      }
    };
  
    var iBST = {};
    iBST["root"] = null;
  
    this.getN = function() { return iBST["root"] == null ? 0 : iBST[iBST["root"]]["sz"]; }
    this.getH = function() { return iBST["root"] == null ? 0 : iBST[iBST["root"]]["height"]; }
  
    this.getRandom = function(inBST) {
      var arr = new Array();
      for (var key in iBST) {
        if (key == "root") continue;
        arr.push(key);
      }
      var candidate;
      if (inBST) {
        if (arr.length == 0)
          candidate = Math.floor(Math.random() * 1999) - 999; 
        else
          candidate = parseInt(arr[Math.floor(Math.random()*arr.length)]);
      }
      else {
        candidate = Math.floor(Math.random() * 1999) - 999;
        while ($.inArray(candidate, arr) >= 0)
          candidate = Math.floor(Math.random() * 1999) - 999; 
      }
      return candidate;
    }
  
    function clearScreen() {
      var key;
  
      for (key in iBST) {
        if (key == "root") continue;
        gw.removeEdge(iBST[key]["vertexClassNumber"]);
      }
  
      for (key in iBST) {
        if (key == "root") continue;
        gw.removeVertex(iBST[key]["vertexClassNumber"]);
      }
  
      iBST = {};
      iBST["root"] = null;
    }
  
    function init(initArr) {
      clearScreen();
  
      for (var i = 0; i < initArr.length; ++i) {
        var parentVertex = iBST["root"];
        var newVertex = parseInt(initArr[i]);
  
        if (parentVertex == null) {
          iBST["root"] = parseInt(newVertex);
          iBST[newVertex] = {
            "parent": null,
            "leftChild": null,
            "rightChild": null,
            "vertexClassNumber": newVertex,
            "freq": 1,
            "depth": 0,
          };
        }
        else {
          while (true) {
            if (parentVertex < newVertex) {
              if (iBST[parentVertex]["rightChild"] == null) break;
              parentVertex = iBST[parentVertex]["rightChild"];
            }
            else {
              if (iBST[parentVertex]["leftChild"] == null) break;
              parentVertex = iBST[parentVertex]["leftChild"];
            }
          }
  
          if (parentVertex < newVertex)
            iBST[parentVertex]["rightChild"] = newVertex;
          else
            iBST[parentVertex]["leftChild"] = newVertex;
  
          iBST[newVertex] = {
            "parent": parentVertex,
            "leftChild": null,
            "rightChild": null,
            "vertexClassNumber": newVertex,
            "freq": 1 + (Math.random() < 0.1 ? 1 : 0),
          }
        }
      }
  
      recalculatePosition();
  
      for (key in iBST) {
        if (key == "root") continue;
        gw.addVertex(iBST[key]["cx"], iBST[key]["cy"], (iBST[key]["freq"] == 1 ? key : (key + '-' + iBST[key]["freq"])), iBST[key]["vertexClassNumber"], true);
      }
  
      if (iBST["root"] == null)
        $("#info").text("Number of nodes : 0, Height : 0 (empty BST)");
      else
        $("#info").text("Number of nodes :" + iBST[iBST["root"]]["sz"] + ", Height :" + iBST[iBST["root"]]["height"]);
  
      for (key in iBST) {
        if (key == "root") continue;
        if (key == iBST["root"]) continue;
        var parentVertex = iBST[key]["parent"];
        gw.addEdge(iBST[parentVertex]["vertexClassNumber"], iBST[key]["vertexClassNumber"], iBST[key]["vertexClassNumber"], true, 1);
      }
    }
  
    this.generate = function(array) { 
	init(array); 
	}

    this.generateExample = function(id, callback) {
      var initArr = [];
	  init(initArr);
	  
	  var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key, currentVertexClass, i;
	  cs = createState(iBST);
	  cs["status"] = 'New empty root.'
	  cs["lineNo"] = 1;
	  sl.push(cs);
	  sl.push(cs);
	  
	  populatePseudocode(1);
	  gw.startAnimation(sl, callback);
	  
      return true;
    }
  
    this.generateRandom = function() {
      var vertexAmt = $("#N").val();
      var initArr = [];

      while (initArr.length < vertexAmt) { 
        var random = Math.floor(Math.random() * 1999) - 999; 
        if ($.inArray(random, initArr) < 0) 
          initArr.push(random);
      }
  
        var initArrAvl = [];
  

        function recursion(startVal, endVal) {
          var total = startVal + endVal + 1;
          if (total < 1)
            return;
          if (startVal > endVal)
            return;
          if (total == 1)
            initArrAvl.push(initArr[startVal]);
          else if (total % 2 != 0) {
            initArrAvl.push(initArr[parseInt(total/2)]);
            recursion(startVal, parseInt(total/2) - 1);
            recursion(parseInt(total/2) + 1, endVal);
          }
          else {
            initArrAvl.push(initArr[parseInt(total/2) - 1]);
            recursion(startVal, parseInt(total/2) - 2);
            recursion(parseInt(total/2), endVal);
          }
        }
  
        function sortNumber(a, b) { return a-b; }
        initArr.sort(sortNumber);
        recursion(0, initArr.length-1);
        init(initArrAvl);
      
      return true;
    }
    
    this.search = function(v, mode, callback) {
      var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, currentVertexClass, key, ans;
      var lower_bound = 999, lb_key = null;
      v = parseInt(v);
  
      cs = createState(iBST);
      cs["status"] = 'The current BST rooted at {root}.'.replace('{root}', cur);
      if (cur != null) 
        cs["vl"][iBST[cur]["vertexClassNumber"]]["extratext"] = "root";
      cs["lineNo"] = 0;
      sl.push(cs);
  
      var r = 0, prevRight = null;
  
      while (cur != v && cur != null) {
        var curLeft = iBST[cur]["leftChild"], curRight = iBST[cur]["rightChild"];
        var q = 0;
        if (curLeft != null) 
          q = iBST[curLeft]["sz"];
  
        cs = createState(iBST, vertexTraversed, edgeTraversed);
        key = iBST[cur]["vertexClassNumber"];
        if (parseInt(cur) >= v) {
          if (parseInt(cur) < lower_bound) { 
            lower_bound = parseInt(cur);
            lb_key = key;
          }
        }
  
        cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
        vertexTraversed[cur] = true;
        cs["status"] = 'Comparing  {cur} with {v}.'.replace("{cur}", cur).replace("{v}", v); 
        cs["lineNo"] = 0;
        sl.push(cs);
  
        if (v > parseInt(cur)) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
          cs["status"] = '{cur} is smaller than {v}.'.replace("{cur}", cur).replace("{v}", v); 
          cs["lineNo"] = 5;
          sl.push(cs);
  
          prevRight = cur;
          cur = iBST[cur]["rightChild"];
          r += (q+1); 
          if (cur == null) break;
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          var edgeHighlighted = iBST[cur]["vertexClassNumber"];
          edgeTraversed[edgeHighlighted] = true;
          cs["el"][edgeHighlighted]["animateHighlighted"] = true;
          cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
          cs["status"] = 'So search on the right.';
          cs["lineNo"] = 6;
          sl.push(cs);
        }
        else {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
          cs["status"] = '{cur} is greater than {v}.'.replace("{cur}", cur).replace("{v}", v); 
          cs["lineNo"] = 7;
          sl.push(cs);
  
          cur = iBST[cur]["leftChild"];
          if (cur == null) break;
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          var edgeHighlighted = iBST[cur]["vertexClassNumber"];
          edgeTraversed[edgeHighlighted] = true;
          cs["el"][edgeHighlighted]["animateHighlighted"] = true;
          cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
          cs["status"] = 'So search on the left.'; 
          cs["lineNo"] = 7;
          sl.push(cs);
        }
      }
  
      if (cur != null) {
        var curLeft = iBST[cur]["leftChild"], curRight = iBST[cur]["rightChild"];
        var q = 0;
        if (curLeft != null)
          q = iBST[curLeft]["sz"];
  
        cs = createState(iBST, vertexTraversed, edgeTraversed);
        key = iBST[cur]["vertexClassNumber"];
        cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
        cs["status"] = 'Value {v} is found.'.replace("{v}", v);
        cs["lineNo"] = [3,4];
        sl.push(cs);
      }
      else {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["status"] = 'Value {v} is not in the BST.'.replace("{v}", v);
          cs["lineNo"] = [1, 2];
          sl.push(cs);
        

      }
  
      gw.startAnimation(sl, callback);
      populatePseudocode(2);
      return true;
    }
  
    this.insertArr = function(vertexTextArr, callback) {
      var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key, currentVertexClass, i;
  
      cs = createState(iBST);
      cs["status"] = 'The current BST rooted at {root}.'.replace('{root}', cur);
      if (cur != null) 
        cs["vl"][iBST[cur]["vertexClassNumber"]]["extratext"] = "root";
      cs["lineNo"] = 0;
      sl.push(cs);
  
      if (Object.prototype.toString.call(vertexTextArr) != '[object Array]') {
        $('#insert-err').html('Please fill in a number or comma-separated array of numbers!');
        return false;
      }
  
      var tempiBST = deepCopy(iBST);
  
      for (i = 0; i < vertexTextArr.length; ++i) {
        var vt = parseInt(vertexTextArr[i]);
  
        if (isNaN(vt)) {
          $('#insert-err').html('Please fill in a number or comma-separated array of numbers!');
          return false;
        }
  
        if (parseInt(vt) < valueRange[0] || parseInt(vt) > valueRange[1]) {
          $('#insert-err').html('Sorry, only values between {range1} and {range2} can be inserted.'.replace("{range1}", valueRange[0]).replace("{range2}", valueRange[1]));
          return false;
        }
  
        if (tempiBST[vt] != null)
          tempiBST[vt]["freq"] += 1;
        else {
          var parentVertex = parseInt(tempiBST["root"]);
          var heightCounter = 0;
  
          if (tempiBST["root"] == null) {
            tempiBST["root"] = parseInt(vt);
            tempiBST[vt] = {
              "parent": null,
              "leftChild": null,
              "rightChild": null,
              "freq": 1,
            };
          }
          else {
            while (true) {
              ++heightCounter;
              if (parentVertex < vt) {
                if (tempiBST[parentVertex]["rightChild"] == null)
                  break;
                parentVertex = tempiBST[parentVertex]["rightChild"];
              }
              else {
                if (tempiBST[parentVertex]["leftChild"] == null)
                  break;
                parentVertex = tempiBST[parentVertex]["leftChild"];
              }
            }
  
            if (parentVertex < vt)
              tempiBST[parentVertex]["rightChild"] = vt;
            else
              tempiBST[parentVertex]["leftChild"] = vt;
  
            tempiBST[vt] = {
              "parent": parentVertex,
              "leftChild": null,
              "rightChild": null,
              "freq": 1,
            }
          }
  
          ++heightCounter;
          if (heightCounter > maxHeightAllowed+1) {
            $('#insert-err').html('Sorry, this visualization can only support tree of maximum height {maxHeight}'.replace("{maxHeight}", maxHeightAllowed));
            if (typeof callback == 'function') callback();
            return false;
          }
        }
      }
  
      function checkNewHeight() {
        var parentVertex = tempiBST["root"];
        var heightCounter = 0;
  
        while (parentVertex != null) {
          if (parentVertex < parseInt(v))
            parentVertex = tempiBST[parentVertex]["rightChild"];
          else
            parentVertex = tempiBST[parentVertex]["leftChild"];
          ++heightCounter;
        }
  
        ++heightCounter;
  
        if (heightCounter > maxHeightAllowed+1)
          return false;
        return true;
      }
  
      for (i = 0; i < vertexTextArr.length; ++i) {
        var v = parseInt(vertexTextArr[i]);
		var last;
        vertexTraversed = {};
        edgeTraversed = {};
        cur = parseInt(iBST["root"]);
        cs = createState(iBST);
  
        var need_new_vertex = true;
        while ((cur != null) && !isNaN(cur)) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
   
          key = iBST[cur]["vertexClassNumber"];
          cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][key]["extratext"] = '^';
          vertexTraversed[cur] = true;
          cs["status"] = 'Comparing {v} with {cur}.'.replace("{v}", v).replace("{cur}", cur);
          if (v > parseInt(cur)){
		  cs["lineNo"] = (!isAVL ? 5 : 1);
		  last = (!isAVL ? 6 : 1);}
          else if (v < parseInt(cur)){
		  cs["lineNo"] = (!isAVL ? 3 : 1);
		  last = (!isAVL ? 4 : 1);}
          sl.push(cs);
  
          var nextVertex;
          if (v > parseInt(cur))
            nextVertex = iBST[cur]["rightChild"];
          else if (v < parseInt(cur))
            nextVertex = iBST[cur]["leftChild"];
          else { 
            iBST[cur]["freq"] += 1; 
            need_new_vertex = false;
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            key = iBST[cur]["vertexClassNumber"];
            cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            cs["vl"][key]["extratext"] = '^';
            cs["status"] = '{v} is equal to {cur}, so just increment its frequency.'.replace("{v}", v).replace("{cur}", cur);
            cs["lineNo"] = (!isAVL ? 7 : 1);
            sl.push(cs);
            break;
          }
  
          if (nextVertex == null)
            break;
          else
            cur = parseInt(nextVertex);
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          var edgeHighlighted = iBST[cur]["vertexClassNumber"];
          edgeTraversed[edgeHighlighted] = true;
          cs["el"][edgeHighlighted]["animateHighlighted"] = true;
          cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
          if (v > parseInt(iBST[cur]["parent"])) {
            cs["status"] = '{v} is larger than {parent}, so go right.'.replace("{v}", v).replace("{parent}", iBST[cur]["parent"]);
            cs["lineNo"] = (!isAVL ? 6 : 1);
          }
          else {
            cs["status"] = '{v} is smaller than {parent}, so go left.'.replace("{v}", v).replace("{parent}", iBST[cur]["parent"]); 
            cs["lineNo"] = (!isAVL ? 4 : 1);
          }
          sl.push(cs);
        }
  
        if (!need_new_vertex) continue;
  
        iBST[v] = {
          "leftChild": null,
          "rightChild": null,
          "vertexClassNumber": v,
           "freq": 1,
        };
  
        if ((cur != null) && !isNaN(cur)) {
          iBST[v]["parent"] = cur;
          if (cur < v)
            iBST[cur]["rightChild"] = v;
          else
            iBST[cur]["leftChild"] = v;
        }
        else {
          iBST[v]["parent"] = null;
          iBST["root"] = v;
        }
  
        recalculatePosition();

        var newNodeVertexClass = iBST[v]["vertexClassNumber"];
        if ((cur != null) && !isNaN(cur)) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][newNodeVertexClass]["state"] = OBJ_HIDDEN;
          cs["el"][newNodeVertexClass]["state"] = EDGE_TRAVERSED;
          cs["el"][newNodeVertexClass]["animateHighlighted"] = true;
          cs["status"] = 'Location found!<br>Inserting {v}.'.replace("{v}", v); 
          cs["lineNo"] = last;
          edgeTraversed[newNodeVertexClass] = true;
          sl.push(cs);
        }
  
        cs = createState(iBST, vertexTraversed, edgeTraversed);
        cs["vl"][newNodeVertexClass]["state"] = VERTEX_HIGHLIGHTED;
        cs["vl"][newNodeVertexClass]["extratext"] = "x";
        cs["status"] = '{v} has been inserted!'.replace("{v}", v); 
        if(!isAVL)
			cs["lineNo"] =  [1, 2] ;
	    else
			cs["lineNo"] =  1;
        sl.push(cs);
  
        if (isAVL) {
          recalculateBalanceFactor();
  
          var vertexCheckBf = iBST[v]["parent"];
          while (vertexCheckBf != null) {
            var vertexCheckBfClass = iBST[vertexCheckBf]["vertexClassNumber"];
            var bf = iBST[vertexCheckBf]["balanceFactor"];
			var h = iBST[vertexCheckBf]["height"];
  
            cs = createState(iBST);
            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
            cs["vl"][vertexCheckBfClass]["extratext"] = "bf = " + bf + " ; h = "+ h;
            cs["status"] = 'Balance factor of {vertexCheckBf} is {bf}.<br>It is {status}.'.replace("{vertexCheckBf}", vertexCheckBf).replace("{bf}", bf).replace('{status}', (Math.abs(bf) <= 1 ? 'ok' : 'not ok'));
            cs["lineNo"] = 3;
            sl.push(cs);
  
            if (bf == 2) {
              var vertexCheckBfLeft = iBST[vertexCheckBf]["leftChild"];
              var vertexCheckBfLeftClass = iBST[vertexCheckBfLeft]["vertexClassNumber"];
              var bfLeft = iBST[vertexCheckBfLeft]["balanceFactor"];
			  var hLeft = iBST[vertexCheckBfLeft]["height"];
			  
              cs = createState(iBST);
              cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfClass]["extratext"] = "bf = " + bf + " ; h = "+ h;
              cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfLeftClass]["extratext"] = "bf = " + bfLeft + " ; h = "+ hLeft;
              cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft).replace("{bf}", bfLeft);
              cs["lineNo"] = 3;
              sl.push(cs);
  
              if (bfLeft == 1 || bfLeft == 0) {
                rotateRight(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeft)
                  cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: LEFT-LEFT => Rotate right {vertexCheckBF}.'.replace("{vertexCheckBF}", vertexCheckBf);
                cs["lineNo"] = [4,5];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeft)
                  cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.'; 
                cs["lineNo"] = 2;
                sl.push(cs);
              }
              else if (bfLeft == -1) {
                var vertexCheckBfLeftRight = iBST[vertexCheckBfLeft]["rightChild"];
                var vertexCheckBfLeftRightClass = iBST[vertexCheckBfLeftRight]["vertexClassNumber"];
  
                rotateLeft(vertexCheckBfLeft);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: LEFT-RIGHT => 1st : Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft); 
                cs["lineNo"] = [8,9];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.'; 
                cs["lineNo"] = 2;
                sl.push(cs);
  
                rotateRight(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeftRight)
                  cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: LEFT-RIGHT =>2nd : Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf); 
                cs["lineNo"] = [8,10];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeftRight)
                  cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.'; 
                cs["lineNo"] = 2;
                sl.push(cs);
              }
            }
            else if (bf == -2) {
              var vertexCheckBfRight = iBST[vertexCheckBf]["rightChild"];
              var vertexCheckBfRightClass = iBST[vertexCheckBfRight]["vertexClassNumber"];
              var bfRight = iBST[vertexCheckBfRight]["balanceFactor"];
			  var hRight = iBST[vertexCheckBfRight]["height"];
  
              cs = createState(iBST);
              cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfClass]["extratext"] = "bf = " + bf + " ; h = "+ h;
              cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfRightClass]["extratext"] = "bf = " + bfRight + " ; h = "+ hRight;
              cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfRight).replace("{bf}", bfRight); 
              cs["lineNo"] = 3;
              sl.push(cs);
  
              if (bfRight == 1) {
                var vertexCheckBfRightLeft = iBST[vertexCheckBfRight]["leftChild"];
                var vertexCheckBfRightLeftClass = iBST[vertexCheckBfRightLeft]["vertexClassNumber"];
  
                rotateRight(vertexCheckBfRight);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: RIGHT-LEFT => 1st : Rotate right {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfRight);
                cs["lineNo"] = [11,12];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.';
                cs["lineNo"] = 2;
                sl.push(cs);
  
                rotateLeft(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRightLeft)
                  cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: RIGHT-LEFT => 2nd :Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                cs["lineNo"] = [11,13];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRightLeft)
                  cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.';
                cs["lineNo"] = 2;
                sl.push(cs);
              }
              else if (bfRight == -1 || bfRight == 0) {
                rotateLeft(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRight)
                  cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: RIGHT-RIGHT => Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                cs["lineNo"] = [6,7];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRight)
                  cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.'; 
                cs["lineNo"] = 2;
                sl.push(cs);
              }
            }
  
            if (vertexCheckBf != iBST["root"]) {
              cs = createState(iBST);
              cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              cs["status"] = 'Check the parent vertex.'; 
              cs["lineNo"] = 14;
              sl.push(cs);
            }
  
            vertexCheckBf = iBST[vertexCheckBf]["parent"];
          }
  
          cs = createState(iBST);
          cs["status"] = 'The tree is balanced.'; 
          cs["lineNo"] = 14;
          sl.push(cs);
        }
      }
  
      gw.startAnimation(sl, callback);
      populatePseudocode(isAVL ? 5 : 3); 
      return true;
    }
  
    this.removeArr = function(vertexTextArr, callback) {
      var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key, currentVertexClass, i, j;
  
      cs = createState(iBST);
      cs["status"] = 'The current BST rooted at {root}.'.replace('{root}', cur);
      if (cur != null) 
        cs["vl"][iBST[cur]["vertexClassNumber"]]["extratext"] = "root";
      cs["lineNo"] = 0;
      sl.push(cs);
  
      if (Object.prototype.toString.call(vertexTextArr) != '[object Array]') {
        alert('Please fill in a number or comma-separated array of numbers!');
        return false;
      }
  
      for (i = 0; i < vertexTextArr.length; ++i) {
        var vt = parseInt(vertexTextArr[i]);
  
        if (isNaN(vt)) {
          alert('Please fill in a number or comma-separated array of numbers!');
          return false;
        }
      }
  
      for (i = 0; i < vertexTextArr.length; ++i) {
        var v = parseInt(vertexTextArr[i]);
        var vertexCheckBf;
  
        vertexTraversed = {};
        edgeTraversed = {};
        cur = iBST["root"];
  
        var need_to_delete = true;
        while (cur != null) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          key = iBST[cur]["vertexClassNumber"];
          cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][key]["extratext"] = '^';
          cs["status"] = 'Searching for vertex {v} to remove.'.replace("{v}", v);
          cs["lineNo"] = 0;
          sl.push(cs);
  
          if (v > parseInt(cur)){
			j=3;  
		  cur = iBST[cur]["rightChild"];}
          else if (v < parseInt(cur)){
			j=2;
		  cur = iBST[cur]["leftChild"];}
          else {
            if (iBST[cur]["freq"] == 1) break;
  

            iBST[cur]["freq"] -= 1;
            need_to_delete = false;
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            key = iBST[cur]["vertexClassNumber"];
            cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
            cs["vl"][key]["extratext"] = '^';
            cs["status"] = '{v} is equal to {cur}, so just decrement its frequency.'.replace("{v}", v).replace("{cur}", cur); 
            cs["lineNo"] = (!isAVL ? [4,5] : 1);
            sl.push(cs);
			if (!isAVL) {cs["lineNo"] = 13; sl.push(cs);}
            break;
         }
  
          if (cur == null) break; 
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          var edgeHighlighted = iBST[cur]["vertexClassNumber"];
          edgeTraversed[edgeHighlighted] = true;
          cs["el"][edgeHighlighted]["animateHighlighted"] = true;
          cs["el"][edgeHighlighted]["state"] = EDGE_TRAVERSED;
          cs["status"] = 'Searching for vertex {v} to remove.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? j : 1);
          sl.push(cs);
        }
  
        if (!need_to_delete) continue;
  
        if (cur != null) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          currentVertexClass = iBST[cur]["vertexClassNumber"];
          cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["status"] = 'Vertex {v} found.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? 4 : 1);
          sl.push(cs);
        }
        else {
          cs = createState(iBST);
          cs["status"] = 'Vertex {v} is not in the BST.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? j : 1);
          sl.push(cs);
		  cs = createState(iBST);
          cs["status"] = 'Vertex {v} is not in the BST.'.replace("{v}", v);
          cs["lineNo"] = 1;
          sl.push(cs);
          continue;
        }
  

        if (iBST[cur]["leftChild"] == null && iBST[cur]["rightChild"] == null) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][currentVertexClass]["extratext"] = 'Delete';
          cs["status"] = 'Vertex {v} has no children (a leaf).'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? [6,7] : 1);
          sl.push(cs);
  
          var parentVertex = iBST[cur]["parent"];
  
          if (parentVertex != null) {
            if (parseInt(parentVertex) < parseInt(cur))
              iBST[parentVertex]["rightChild"] = null;
            else
              iBST[parentVertex]["leftChild"] = null;
          }
          else
            iBST["root"] = null;
  
          currentVertexClass = iBST[cur]["vertexClassNumber"];
          delete iBST[cur];
          delete vertexTraversed[cur];
          delete edgeTraversed[currentVertexClass];
  
          recalculatePosition();
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["status"] = 'Remove leaf {v}.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? 8 : 1);
          sl.push(cs);
  
          vertexCheckBf = parentVertex;
        }

        else if (iBST[cur]["leftChild"] == null) { 
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][currentVertexClass]["extratext"] = 'Delete';
          cs["status"] = 'Vertex {v} only has a right child.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? [6,7] : 1);
          sl.push(cs);
  
          var parentVertex = iBST[cur]["parent"];
          var rightChildVertex = iBST[cur]["rightChild"];
  
          if (parentVertex != null) {
            if (parseInt(parentVertex) < parseInt(cur))
              iBST[parentVertex]["rightChild"] = rightChildVertex;
            else
              iBST[parentVertex]["leftChild"] = rightChildVertex;
          }
          else
            iBST["root"] = rightChildVertex;
  
          iBST[rightChildVertex]["parent"] = parentVertex;
  
          currentVertexClass = iBST[cur]["vertexClassNumber"];
          rightChildVertexClass = iBST[rightChildVertex]["vertexClassNumber"];
          delete iBST[cur];
          delete vertexTraversed[cur];
          delete edgeTraversed[currentVertexClass];
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          if (parentVertex != null)
            cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          cs["status"] = 'Remove vertex {v} and connect its parent to its right child.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? 8 : 1);
          sl.push(cs);
  
          recalculatePosition();
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][rightChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          if (parentVertex != null)
            cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          cs["status"] = 'Relayout the BST and recompute its height.'; 
          cs["lineNo"] = (!isAVL ? 0 : 1);
          sl.push(cs);
  
          vertexCheckBf = rightChildVertex;
        }
        else if (iBST[cur]["rightChild"] == null) { 
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][currentVertexClass]["extratext"] = 'Delete';
          cs["status"] = 'Vertex {v} only has a left child.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? [6,7] : 1);
          sl.push(cs);
  
          var parentVertex = iBST[cur]["parent"];
          var leftChildVertex = iBST[cur]["leftChild"];
  
          if (parentVertex != null) {
            if (parseInt(parentVertex) < parseInt(cur))
              iBST[parentVertex]["rightChild"] = leftChildVertex;
            else
              iBST[parentVertex]["leftChild"] = leftChildVertex;
          }
          else
            iBST["root"] = leftChildVertex;
  
          iBST[leftChildVertex]["parent"] = parentVertex;
  
          currentVertexClass = iBST[cur]["vertexClassNumber"];
          leftChildVertexClass = iBST[leftChildVertex]["vertexClassNumber"];
          delete iBST[cur];
          delete vertexTraversed[cur];
          delete edgeTraversed[currentVertexClass];
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          if (parentVertex != null)
            cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          cs["status"] = 'Remove vertex {v} and connect its parent to its left child.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? 8 : 1);
          sl.push(cs);
  
          recalculatePosition();
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][leftChildVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          if (parentVertex != null)
            cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          cs["status"] = 'Relayout the BST and recompute its height.'; 
          cs["lineNo"] = (!isAVL ? 0 : 1);
          sl.push(cs);
  
          vertexCheckBf = leftChildVertex;
        }
        else { 
          var parentVertex = iBST[cur]["parent"];
          var leftChildVertex = iBST[cur]["leftChild"];
          var rightChildVertex = iBST[cur]["rightChild"];
          var successorVertex = iBST[cur]["rightChild"];
          var successorVertexClass = iBST[successorVertex]["vertexClassNumber"];
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][currentVertexClass]["extratext"] = 'Delete';
          cs["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
          cs["el"][successorVertexClass]["animateHighlighted"] = true;
          cs["status"] = 'Finding successor of {v}.'.replace("{v}", v); 
          cs["lineNo"] = (!isAVL ? [9,10] : 1);
          sl.push(cs);
  
          edgeTraversed[successorVertexClass] = true;
          vertexTraversed[successorVertex] = true;
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["status"] = 'Finding successor of {v}.'.replace("{v}", v); 
          cs["lineNo"] = (!isAVL ? [9,10] : 1);
          sl.push(cs);
  
          while (iBST[successorVertex]["leftChild"] != null) {
            successorVertex = iBST[successorVertex]["leftChild"];
            successorVertexClass = iBST[successorVertex]["vertexClassNumber"];
  
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
            cs["el"][successorVertexClass]["state"] = EDGE_TRAVERSED;
            cs["el"][successorVertexClass]["animateHighlighted"] = true;
            cs["status"] = 'Finding successor of {v}.'.replace("{v}", v); 
            cs["lineNo"] = (!isAVL ? [9,10] : 1);
            sl.push(cs);
  
            edgeTraversed[successorVertexClass] = true;
            vertexTraversed[successorVertex] = true;
  
            cs = createState(iBST, vertexTraversed, edgeTraversed);
            cs["vl"][currentVertexClass]["state"] = VERTEX_HIGHLIGHTED;
            cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;
            cs["status"] = 'Finding successor of {v}.'.replace("{v}", v); 
            cs["lineNo"] = (!isAVL ? [9,10] : 1);
            sl.push(cs);
          }
  
          var successorParentVertex = iBST[successorVertex]["parent"]
          var successorRightChildVertex = iBST[successorVertex]["rightChild"];
  
          if (parentVertex != null) {
            if (parseInt(parentVertex) < parseInt(cur))
              iBST[parentVertex]["rightChild"] = successorVertex;
            else
              iBST[parentVertex]["leftChild"] = successorVertex;
          }
          else
            iBST["root"] = successorVertex;
  
          iBST[successorVertex]["parent"] = parentVertex;
          iBST[successorVertex]["leftChild"] = leftChildVertex;
  
          iBST[leftChildVertex]["parent"] = successorVertex;
  
          if (successorVertex != rightChildVertex) {
            iBST[successorVertex]["rightChild"] = rightChildVertex;
            iBST[rightChildVertex]["parent"] = successorVertex;
  
            if (successorRightChildVertex != null) {
              if (parseInt(successorParentVertex) < parseInt(successorVertex))
                iBST[successorParentVertex]["rightChild"] = successorRightChildVertex;
              else
                iBST[successorParentVertex]["leftChild"] = successorRightChildVertex;
              iBST[successorRightChildVertex]["parent"] = successorParentVertex;
            }
            else {
              if (parseInt(successorParentVertex) < parseInt(successorVertex))
                iBST[successorParentVertex]["rightChild"] = null;
              else
                iBST[successorParentVertex]["leftChild"] = null;
            }
          }
  
          delete iBST[cur];
          delete vertexTraversed[cur];
          delete edgeTraversed[currentVertexClass];
  
          if (parentVertex == null)
            delete edgeTraversed[successorVertexClass];
  
          calcSize(iBST["root"]);
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          var leftChildVertexClass = iBST[leftChildVertex]["vertexClassNumber"];
          cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          if (parentVertex != null) {
            var parentVertexClass = iBST[parentVertex]["vertexClassNumber"];
            cs["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
          }
          if (successorVertex != rightChildVertex) {
            var rightChildVertexClass = iBST[rightChildVertex]["vertexClassNumber"];
            cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
            if (successorRightChildVertex != null) {
              var successorRightChildVertexClass = iBST[successorRightChildVertex]["vertexClassNumber"];
              cs["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
            }
          }
          cs["status"] = 'Replace vertex {v} with its successor.'.replace("{v}", v);
          cs["lineNo"] = (!isAVL ? 12 : 1);
          sl.push(cs);
  
          recalculatePosition();
  
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          leftChildVertexClass = iBST[leftChildVertex]["vertexClassNumber"];
          cs["vl"][successorVertexClass]["state"] = VERTEX_HIGHLIGHTED;
          cs["el"][leftChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
          if (parentVertex != null) {
            var parentVertexClass = iBST[parentVertex]["vertexClassNumber"];
            cs["el"][successorVertexClass]["state"] = EDGE_HIGHLIGHTED;
          }
          if (successorVertex != rightChildVertex) {
            var rightChildVertexClass = iBST[rightChildVertex]["vertexClassNumber"];
            cs["el"][rightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
            if (successorRightChildVertex != null) {
              var successorRightChildVertexClass = iBST[successorRightChildVertex]["vertexClassNumber"];
              cs["el"][successorRightChildVertexClass]["state"] = EDGE_HIGHLIGHTED;
            }
          }
          cs["status"] = 'Relayout the BST and recompute its height.';
          cs["lineNo"] = (!isAVL ? 13 : 1);
          sl.push(cs);
  
          vertexCheckBf = successorVertex;
          if (successorVertex != rightChildVertex)
            vertexCheckBf = successorParentVertex;
        }
  
        cs = createState(iBST);
        cs["status"] = 'Removal of {v} is complete.'.replace("{v}", v); 
        cs["lineNo"] = (!isAVL ? 0 : 1);
        sl.push(cs);
  
        if (isAVL) {
          recalculateBalanceFactor();
  
          while (vertexCheckBf != null) {
            var vertexCheckBfClass = iBST[vertexCheckBf]["vertexClassNumber"];
  
            var bf = iBST[vertexCheckBf]["balanceFactor"];
			var h = iBST[vertexCheckBf]["height"];
  
            cs = createState(iBST);
            cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
            cs["vl"][vertexCheckBfClass]["extratext"] = "bf = " + bf + " ; h = "+ h;
            cs["status"] = 'Balance factor of {vertexCheckBf} is {bf}.<br>It is {status}.'.replace("{vertexCheckBf}", vertexCheckBf).replace("{bf}", bf).replace('{status}', (Math.abs(bf) <= 1 ? 'ok' : 'not ok'));
            cs["lineNo"] = 3;
            sl.push(cs);
  
            if (bf == 2) {
              var vertexCheckBfLeft = iBST[vertexCheckBf]["leftChild"];
              var vertexCheckBfLeftClass = iBST[vertexCheckBfLeft]["vertexClassNumber"];
              var bfLeft = iBST[vertexCheckBfLeft]["balanceFactor"];
			  var hLeft = iBST[vertexCheckBfLeft]["height"];
  
              cs = createState(iBST);
              cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfClass]["extratext"] = "bf = " + bf + " ; h = "+ h;
              cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfLeftClass]["extratext"] = "bf = " + bfLeft + " ; h = "+ hLeft;
              cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft).replace("{bf}", bfLeft);
              cs["lineNo"] = 3;
              sl.push(cs);
  
              if (bfLeft == 1 || bfLeft == 0) {
                rotateRight(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeft)
                  cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: LEFT-LEFT => Rotate right {vertexCheckBF}.'.replace("{vertexCheckBF}", vertexCheckBf);
                cs["lineNo"] = [4,5];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeft)
                  cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.';
                cs["lineNo"] = 2;
                sl.push(cs);
              }
              else if (bfLeft == -1) {
                var vertexCheckBfLeftRight = iBST[vertexCheckBfLeft]["rightChild"];
                var vertexCheckBfLeftRightClass = iBST[vertexCheckBfLeftRight]["vertexClassNumber"];
  
                rotateLeft(vertexCheckBfLeft);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: LEFT-RIGHT => 1st :Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBfLeft);
                cs["lineNo"] = [8,9];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.';
                cs["lineNo"] = 2;
                sl.push(cs);
  
                rotateRight(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeftRight)
                  cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: LEFT-RIGHT => 2nd :Rotate right {vertexCheckBF}.'.replace("{vertexCheckBF}", vertexCheckBf);
                cs["lineNo"] = [8,10];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfLeftRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfLeftRight)
                  cs["el"][vertexCheckBfLeftRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.';
                cs["lineNo"] = 2;
                sl.push(cs);
              }
            }
            else if (bf == -2) {
              var vertexCheckBfRight = iBST[vertexCheckBf]["rightChild"];
              var vertexCheckBfRightClass = iBST[vertexCheckBfRight]["vertexClassNumber"];
              var bfRight = iBST[vertexCheckBfRight]["balanceFactor"];
			  var hRight = iBST[vertexCheckBfRight]["height"];
  
              cs = createState(iBST);
              cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfClass]["extratext"] = "bf = " + bf + " ; h = "+ h;
              cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
              cs["vl"][vertexCheckBfRightClass]["extratext"] = "bf = " + bfRight + " ; h = "+ hRight;
              cs["status"] = 'And balance factor of {vertexCheckBf} is {bf}.'.replace("{vertexCheckBf}", vertexCheckBfRight).replace("{bf}", bfRight);
              cs["lineNo"] = 3;
              sl.push(cs);
  
              if (bfRight == 1) {
                var vertexCheckBfRightLeft = iBST[vertexCheckBfRight]["leftChild"];
                var vertexCheckBfRightLeftClass = iBST[vertexCheckBfRightLeft]["vertexClassNumber"];
  
                rotateRight(vertexCheckBfRight);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: RIGHT-LEFT => 1st :Rotate right {vertexCheckBF}.'.replace("{vertexCheckBF}", vertexCheckBfRight); 
                cs["lineNo"] = [11,12];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.'; 
                cs["lineNo"] = 2;
                sl.push(cs);
  
                rotateLeft(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRightLeft)
                  cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: RIGHT-LEFT => 2nd :Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                cs["lineNo"] = [11,13];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightLeftClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRightLeft)
                  cs["el"][vertexCheckBfRightLeftClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.';
                cs["lineNo"] = 2;
                sl.push(cs);
              }
              else if (bfRight == -1 || bfRight == 0) {
                rotateLeft(vertexCheckBf);
  
                cs = createState(iBST);
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRight)
                  cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Case: RIGHT-RIGHT => Rotate left {vertexCheckBf}.'.replace("{vertexCheckBf}", vertexCheckBf);
                cs["lineNo"] = [6,7];
                sl.push(cs);
  
                recalculatePosition();
  
                cs = createState(iBST);
  
                cs["vl"][vertexCheckBfClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["vl"][vertexCheckBfRightClass]["state"] = VERTEX_HIGHLIGHTED;
                cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
                if (iBST["root"] != vertexCheckBfRight)
                  cs["el"][vertexCheckBfRightClass]["state"] = EDGE_HIGHLIGHTED;
                cs["status"] = 'Relayout the BST and recompute its height.'; 
                cs["lineNo"] = 2;
                sl.push(cs);
              }
            }
  
            if (vertexCheckBf != iBST["root"]) {
              cs = createState(iBST);
              cs["el"][vertexCheckBfClass]["state"] = EDGE_HIGHLIGHTED;
              cs["status"] = 'Check the parent vertex...';
              cs["lineNo"] = 14;
              sl.push(cs);
            }
  
            vertexCheckBf = iBST[vertexCheckBf]["parent"];
          }
  
          cs = createState(iBST);
          cs["status"] = 'The tree is balanced.';
          cs["lineNo"] = 14;
          sl.push(cs);
        }
      }
  
      gw.startAnimation(sl, callback);
      populatePseudocode(isAVL ? 6 : 4);
      return true;
    };
     
    this.treeTraversal = function(mode, callback) { // mode = 0 (inorder), 1 (preorder), 2 (postorder)
      var sl = [], vertexTraversed = {}, edgeTraversed = {}, cur = iBST["root"], cs, key;
      var vertexHighlighted = {};
      var in_list = "";
  
      if (iBST["root"] == null) {
        cs = createState(iBST);
        cs["status"] = 'The Binary Search Tree is empty.<br>Return empty result.';
        cs["lineNo"] = [1, 2];
        sl.push(cs);
        return true;
      }
      else {
        key = iBST[iBST["root"]]["vertexClassNumber"];
  
        cs = createState(iBST, vertexTraversed, edgeTraversed);
        cs["vl"][key]["state"] = VERTEX_TRAVERSED;
        cs["vl"][key]["extratext"] = "root";
        cs["status"] = 'The root {root} is not null.'.replace("{root}", iBST["root"]);
        cs["lineNo"] = 1;
        sl.push(cs);
  
        traversalRecursion(mode, iBST["root"]);
      }
  
      cs = createState(iBST, vertexTraversed, edgeTraversed);
      highlightVertex(key);
      cs["status"] = '{mode} traversal of the whole BST is complete.<br>Visitation sequence: {in_list}.'.replace("{mode}", (mode == 0 ? "Inorder" : (mode == 1 ? "Preorder" : "Postorder"))).replace("{cur}", cur).replace("{in_list}", limit(in_list.slice(0, -1), 45));
      cs["vl"][key]["extratext"] = "root";
      cs["lineNo"] = 0;
      sl.push(cs);
  
      gw.startAnimation(sl, callback);
  
      function limit(str = '', limit = 0) {
        if (str.length < limit) return str;
        return str.substring(0, limit) + '<br>' + str.substring(limit, 2*limit) + '<br>' + str.substring(2*limit, 3*limit) + '<br>' + str.substring(3*limit, 4*limit) + '<br>' + str.substring(4*limit, 5*limit) + '<br>' + str.substring(5*limit, 6*limit) ;
	  }
	  
      function traversalRecursion(mode, cur) {
        var key = iBST[cur]["vertexClassNumber"], curLeft = iBST[cur]["leftChild"], curRight = iBST[cur]["rightChild"];
        vertexTraversed[cur] = true;
  
        if (mode == 1) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          vertexHighlighted[key] = true;
          highlightVertex(key);
          for (var r = 0; r < iBST[cur]["freq"]; ++r)
            in_list = in_list + cur + ",";
          cs["status"] = 'Visit vertex with value {cur}.<br>Visitation sequence: {in_list}.'.replace("{cur}", cur).replace("{in_list}", limit(in_list.slice(0, -1), 45));
          cs["lineNo"] = 3;
          sl.push(cs);
        }
  
        if (curLeft == null) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          highlightVertex(key);
          cs["status"] = 'The left child of vertex with value {cur} is empty.<br>Return empty.'.replace("{cur}", cur);
          cs["lineNo"] = [1, 2];
          sl.push(cs);
        }
        else {
          var curLeftClass = iBST[curLeft]["vertexClassNumber"];
  
          edgeTraversed[curLeftClass] = true;
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["el"][curLeftClass]["animateHighlighted"] = true;
          highlightVertex(key);
          cs["status"] = 'The left child of vertex with value {cur} is {curLeft} (not null).<br>So recurse to the left child.'.replace("{cur}", cur).replace("{curLeft}", curLeft);
          cs["lineNo"] = mode == 0 ? 3 : (mode == 1 ? 4 : 3);
          sl.push(cs);
  
          traversalRecursion(mode, curLeft);
        }
  
        if (mode == 0) { 
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          vertexHighlighted[key] = true;
          highlightVertex(key);
          for (var r = 0; r < iBST[cur]["freq"]; ++r)
            in_list = in_list + cur + ",";
          cs["status"] = 'Visit vertex with value {cur}.<br>Visitation sequence: {in_list}.'.replace("{cur}", cur).replace("{in_list}", limit(in_list.slice(0, -1), 45)); 
          cs["lineNo"] = 4;
          sl.push(cs);
        }
  
        if (curRight == null) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          highlightVertex(key);

          cs["status"] = 'The right child of vertex with value {cur} is empty.<br>Return empty.'.replace("{cur}", cur);
          cs["lineNo"] = [1, 2];
          sl.push(cs);
        }
        else {
          var curRightClass = iBST[curRight]["vertexClassNumber"];
  
          edgeTraversed[curRightClass] = true;
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          cs["el"][curRightClass]["animateHighlighted"] = true;
          highlightVertex(key);
          cs["status"] = 'The right child of vertex with value {cur} is {curRight} (not null).<br>So recurse to the right child.'.replace("{cur}", cur).replace("{curRight}", curRight);
          cs["lineNo"] = mode == 0 ? 5 : (mode == 1 ? 5 : 4);
          sl.push(cs);
  
          traversalRecursion(mode, curRight);
        }
  
        if (mode == 2) {
          cs = createState(iBST, vertexTraversed, edgeTraversed);
          vertexHighlighted[key] = true;
          highlightVertex(key);
          for (var r = 0; r < iBST[cur]["freq"]; ++r)
            in_list = in_list + cur + ",";
          cs["status"] = 'Visit vertex with value {cur}.<br>Visitation sequence: {in_list}.'.replace("{cur}", cur).replace("{in_list}", limit(in_list.slice(0, -1), 45));
          cs["lineNo"] = 5;
          sl.push(cs);
        }
  
        cs = createState(iBST, vertexTraversed, edgeTraversed);
        if (cur != iBST["root"])
          cs["el"][key]["state"] = EDGE_HIGHLIGHTED;
        highlightVertex(key);
        cs["status"] = '{mode} traversal of {cur} is complete.'.replace("{mode}", (mode == 0 ? "Inorder" : (mode == 1 ? "Preorder" : "Postorder"))).replace("{cur}", cur);
        cs["lineNo"] = 0;
        sl.push(cs);
      }
  
      function highlightVertex(curkey) {
        for (var key in vertexHighlighted) cs["vl"][key]["state"] = VERTEX_HIGHLIGHTED;
        for (var key in vertexHighlighted) cs["vl"][key]["extratext"] = "";
        cs["vl"][curkey]["extratext"] = '^';
      }
  
      if (mode == 0)
        populatePseudocode(7);
      else if (mode == 1)
        populatePseudocode(8);
      else if (mode == 2)
         populatePseudocode(9);
      return true;
    }
  
    function rotateLeft(val) {

  
      var t = parseInt(val);
      var w = iBST[t]["rightChild"];
  
      iBST[w]["parent"] = iBST[t]["parent"];
      if (iBST[t]["parent"] != null) {
        if (iBST[t]["parent"] < t) {
          var tParent = iBST[t]["parent"];
          iBST[tParent]["rightChild"] = w;
        }
        else {
          var tParent = iBST[t]["parent"];
          iBST[tParent]["leftChild"] = w;
        }
      }
  
      iBST[t]["parent"] = w;
      iBST[t]["rightChild"] = iBST[w]["leftChild"];
      if (iBST[w]["leftChild"] != null)
        iBST[iBST[w]["leftChild"]]["parent"] = t;
      iBST[w]["leftChild"] = t;
  
      if (t == iBST["root"])
        iBST["root"] = w;
  
      recalculateBalanceFactor();
    }
  
    function rotateRight(val) {
  
      var t = parseInt(val);
      var w = iBST[t]["leftChild"];
  
      iBST[w]["parent"] = iBST[t]["parent"];
      if (iBST[t]["parent"] != null) {
        if (iBST[t]["parent"] < t) {
          var tParent = iBST[t]["parent"];
          iBST[tParent]["rightChild"] = w;
        }
        else {
          var tParent = iBST[t]["parent"];
          iBST[tParent]["leftChild"] = w;
        }
      }
  
      iBST[t]["parent"] = w;
      iBST[t]["leftChild"] = iBST[w]["rightChild"];
      if (iBST[w]["rightChild"] != null)
        iBST[iBST[w]["rightChild"]]["parent"] = t;
      iBST[w]["rightChild"] = t;
  
      if (t == iBST["root"])
        iBST["root"] = w;
  
      recalculateBalanceFactor();
    }
    
    function createState(iBSTObject, vertexTraversed, edgeTraversed) {
      if (vertexTraversed == null || vertexTraversed == undefined || !(vertexTraversed instanceof Object))
        vertexTraversed = {};
      if (edgeTraversed == null || edgeTraversed == undefined || !(edgeTraversed instanceof Object))
        edgeTraversed = {};
  
      var info_str = "Number of nodes :0, Height :0 (empty BST)";
      if (iBSTObject["root"] != null)
        info_str = "Number of nodes :" + iBSTObject[iBSTObject["root"]]["sz"] + ", Height :" + iBSTObject[iBSTObject["root"]]["height"];
  
      var s = {
        "vl": {},
        "el": {},
        "info": info_str,
      };
  
      var key;
      var vertexClass;
  
      for (key in iBSTObject) {
        if (key == "root") continue;
  
        vertexClass = iBSTObject[key]["vertexClassNumber"]
  
        s["vl"][vertexClass] = {};
        s["vl"][vertexClass]["cx"] = iBSTObject[key]["cx"];
        s["vl"][vertexClass]["cy"] = iBSTObject[key]["cy"];
        s["vl"][vertexClass]["text"] = key + (iBSTObject[key]["freq"] == 1 ? "" : ("-" + iBSTObject[key]["freq"]));
        s["vl"][vertexClass]["state"] = VERTEX_DEFAULT;
  
        if (iBSTObject[key]["parent"] == null) continue;
  
        parentChildEdgeId = iBSTObject[key]["vertexClassNumber"];
  
        s["el"][parentChildEdgeId] = {};
        s["el"][parentChildEdgeId]["vertexA"] = iBSTObject[iBSTObject[key]["parent"]]["vertexClassNumber"];
        s["el"][parentChildEdgeId]["vertexB"] = iBSTObject[key]["vertexClassNumber"];
        s["el"][parentChildEdgeId]["type"] = EDGE_TYPE_UDE;
        s["el"][parentChildEdgeId]["weight"] = 1;
        s["el"][parentChildEdgeId]["state"] = EDGE_DEFAULT;
        s["el"][parentChildEdgeId]["animateHighlighted"] = false;
      }
  
      for (key in vertexTraversed) {
        vertexClass = iBSTObject[key]["vertexClassNumber"];
        s["vl"][vertexClass]["state"] = VERTEX_TRAVERSED;
      }
  
      for (key in edgeTraversed)
        s["el"][key]["state"] = EDGE_TRAVERSED;
  
      return s;
    }
  
    function calcSize(cur) {
      if (cur == null) return 0;
      iBST[cur]["sz"] = 1 + calcSize(iBST[cur]["leftChild"]) + calcSize(iBST[cur]["rightChild"]);
      return iBST[cur]["sz"];
    }
  
    function recalculatePosition() {
      calcDepth(iBST["root"], 0);
      calcHeight(iBST["root"]);
      calcSize(iBST["root"]);
      updatePosition(iBST["root"], 0, 0);
  
      function calcDepth(cur, curDepth) { 
        if (cur == null) return;
        iBST[cur]["depth"] = curDepth;
        calcDepth(iBST[cur]["leftChild"], curDepth+1);
        calcDepth(iBST[cur]["rightChild"], curDepth+1);
      }
  
      function calcHeight(cur) { 
        if (cur == null) return -1;
        iBST[cur]["height"] = 1 + Math.max(calcHeight(iBST[cur]["leftChild"]), calcHeight(iBST[cur]["rightChild"]));
        return iBST[cur]["height"];
      }
  
      function updatePosition(cur, r, d) {
        if (cur == null) return;
  
        var curLeft = iBST[cur]["leftChild"];
        var q = 0;
        if (curLeft != null) 
          q = iBST[curLeft]["sz"];
          if (cur == iBST["root"])
            iBST[cur]["cx"] = MAIN_SVG_WIDTH/2;
          else {
            var xAxisOffset = MAIN_SVG_WIDTH/2; 
            var parentVertex = iBST[cur]["parent"];
            for (var i = 0; i < iBST[cur]["depth"]; ++i)
              xAxisOffset /= 2;
  
            if (parseInt(cur) > parseInt(parentVertex))
              iBST[cur]["cx"] = iBST[parentVertex]["cx"]+xAxisOffset;
            else
              iBST[cur]["cx"] = iBST[parentVertex]["cx"]-xAxisOffset;
          }

  
        iBST[cur]["cy"] = 25 + 34*d;
        updatePosition(iBST[cur]["leftChild"], r, d+1);
        updatePosition(iBST[cur]["rightChild"], r+q+1, d+1);
      }
    }
  
    function recalculateBalanceFactor() {
      balanceFactorRecursion(iBST["root"]);
  
      function balanceFactorRecursion(val) {
        if (val == null) return -1;
  
        var balanceFactorHeightLeft = balanceFactorRecursion(iBST[val]["leftChild"]);
        var balanceFactorHeightRight = balanceFactorRecursion(iBST[val]["rightChild"]);
  
        iBST[val]["balanceFactorHeight"] = Math.max(balanceFactorHeightLeft, balanceFactorHeightRight) + 1;
        iBST[val]["balanceFactor"] = balanceFactorHeightLeft - balanceFactorHeightRight;
  
        return iBST[val]["balanceFactorHeight"];
      }
    }
  
    function populatePseudocode(act) {
      switch (act) {
		case 1://empty
			addParagraphs(1);
			$('#code1').html('*root = null;'); 
			break;	
        case 2://search
		  addParagraphs(7);
          $('#code1').html('if (!root)'); 
          $('#code2').html('&nbsp;&nbsp;return null'); 
          $('#code3').html('else if (root->key == x)'); 
          $('#code4').html('&nbsp;&nbsp;return root;'); 
          $('#code5').html('if (root->key < x)'); 
          $('#code6').html('&nbsp;&nbsp;return search(root->right, x);'); 
          $('#code7').html('return search(root->left, x);');
          break;
        case 3: // Insert
		  addParagraphs(7);
          $('#code1').html('if (*root == NULL)'); 
		  $('#code2').html('&nbsp;&nbsp;*root = newNode(x);'); 
          $('#code3').html('else if ((*root)->key > x)');
          $('#code4').html('&nbsp;&nbsp; insert_elm(&(*root)->left, x);');
          $('#code5').html('else if ((*root)->key < x)'); 
          $('#code6').html('&nbsp;&nbsp; insert_elm(&(*root)->right, x);');
          $('#code7').html('else ++((*root)->freq) //inc freq');
          break;
        case 4: // remove
		  addParagraphs(13);
          $('#code1').html('if (root == NULL) return root;'); 
          $('#code2').html('if (x < root->key) root->small = delete_elm(root->small, x);'); 
          $('#code3').html('else if (x > root->key) root->large = delete_elm(root->large, x);'); 
          $('#code4').html('else {'); 
          $('#code5').html('&nbsp; if (1 > root->freq) --(root->feq);'); 
          $('#code6').html('&nbsp; else if (root->small == NULL || root->large == NULL) {');
          $('#code7').html('&nbsp;&nbsp; sorted_tree *tmp = root->small ? root->small : root->large;');          
		  $('#code8').html('&nbsp;&nbsp; free(root); return tmp; '); 
          $('#code9').html('&nbsp; else {'); 
          $('#code10').html('&nbsp;&nbsp;sorted_tree *tmp = succ(root);'); 
          $('#code11').html('&nbsp;&nbsp; root->key = tmp->key;'); 
          $('#code12').html('&nbsp;&nbsp;root->large = delete_elm(root->large, tmp->key);}}'); 
          $('#code13').html('return root;}');
          break;
        case 5: // insert avl
        case 6: // remove avl
		  addParagraphs(14);
          if (act == 5) {
            $('#code1').html('same insertion as BST of x');
          } 
		  else {
            $('#code1').html('same removal as BST of x');
          }
          $('#code2').html('node->height = 1 + max(getHeight(node->left),getHeight(node->right));');
          $('#code3').html('int balance = getBalance(node);');
          $('#code4').html('if (balance > 1 && key < node->left->key)');
          $('#code5').html('&nbsp;return rightRotate(node);');
          $('#code6').html('if (balance < -1 && key > node->right->key)');
          $('#code7').html('&nbsp;return leftRotate(node);');
          $('#code8').html('if (balance > 1 && key > node->left->key) {');
          $('#code9').html('&nbsp;node->left = leftRotate(node->left);');
          $('#code10').html('&nbsp;return rightRotate(node);');
          $('#code11').html('if (balance < -1 && key < node->right->key) {');
          $('#code12').html('&nbsp;node->right = rightRotate(node->right);');
          $('#code13').html('&nbsp;return leftRotate(node);');
          $('#code14').html('return node;');
          break;
        case 7: // inorder traversal
        case 8: // preorder traversal
        case 9: // postorder traversal
		  addParagraphs(5);
          $('#code1').html('if (!root) '); 
          $('#code2').html('&nbsp;&nbsp;return'); 
          if (act == 7) {
            $('#code3').html('{mode}(root->left);'.replace("{mode}", "Inorder")); 
            $('#code4').html('printf("%d ", root->key);'); 
            $('#code5').html('{mode}(root->right);'.replace("{mode}", "Inorder")); 
          }
          else if (act == 8) {
            $('#code3').html('printf("%d ", root->key);'); 
            $('#code4').html('{mode}(root->left);'.replace("{mode}", "Preorder")); 
            $('#code5').html('{mode}(root->right);'.replace("{mode}", "Preorder"));
          }
          else if (act == 9) {
            $('#code3').html('{mode}(root->left);'.replace("{mode}", "Postorder")); 
            $('#code4').html('{mode}(root->right);'.replace("{mode}", "Postorder")); 
            $('#code5').html('printf("%d ", root->key);'); 
          }
          break;
      }
    }
  }
