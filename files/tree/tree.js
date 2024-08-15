  let i;
  var bw, gw;
  
  $(function() {
    bw = new BST();
    gw = bw.getGraphWidget();
    gw.setAnimationDuration(700); 

    $('#mode-BST').click();
  
      $("#N").val(Math.floor(1 + Math.random() * 15)); 
      random();

  
    $("#v-search").val(bw.getRandom(true));
    $("#v-insert").val(bw.getRandom(false) + "," + bw.getRandom(false));
    $("#v-remove").val(bw.getRandom(true) + "," + bw.getRandom(true));
  });
  
  function adjust_scale() {
      setDefaultScale(true);
  }
  
  $('#mode-BST').click(function() {
    if (isPlaying) stop();
    $("#N").val(Math.floor(1 + Math.random() * 10));
    bw.isAVL(false);
    adjust_scale();
  });
  
  $('#mode-AVL').click(function() {
    if (isPlaying) stop();
    $("#N").val(Math.floor(1 + Math.random() * 30));
    bw.isAVL(true);
    adjust_scale();
  });

   function example(id, callback) {
    stop();
    adjust_scale();
    commonAction(bw.generateExample(id,callback), "Empty");
  } 
  
  function random() {
    if (isPlaying) stop();
    if (bw.generateRandom()) {
      isPlaying = false;
    }
    adjust_scale();
  }
  
  function searchVertex(mode = 0, callback) {
    stop();
    adjust_scale();
    var v = $('#v-search').val();
    commonAction(bw.search(v, mode, callback), "Search(" + v + ")");
    setTimeout(function() {$("#v-search").val(bw.getRandom(true));}, 500);
  }
  
  function insertVertex(callback) {
    stop();
    adjust_scale();
    var v = $('#v-insert').val();
    commonAction(bw.insertArr(v.split(","), callback), "Insert(" + v + ")");
    setTimeout(function() { $("#v-insert").val(bw.getRandom(false));}, 500); 
  }
  
  function removeVertex(callback) {
	stop();
    adjust_scale();
    var v = $('#v-remove').val();
    commonAction(bw.removeArr(v.split(","), callback), "Remove(" + v + ")");
    setTimeout(function() { $("#v-remove").val(bw.getRandom(true)); }, 500);
  }
      
  function traversal(mode, callback) {
    stop();
    adjust_scale();
    commonAction(bw.treeTraversal(mode, callback), (mode == 0 ? "Inorder Traversal" : (mode == 1 ? "Preorder Traversal" : "Postorder Traversal")));
  }

  function commonAction(retval, msg) {
    if (retval) {
      $('#current').show();
      $('#current').html(msg);
	  triggerPanels();      
      isPlaying = true;
    }
  }  


