var theUniverse = null;
var frame1 = null,
	frame2 = null,
	currentFrame = null,
	backFrame = null;

var numRows = 8,
	numCols = 16;

window.addEventListener('keydown', function() { tick();
} );

window.addEventListener('load', function() {
	theUniverse = document.getElementById("universe");
	frame1 = new Array(numRows);
	frame2 = new Array(numRows);

	for (var i=0; i<numRows; i++) {
		frame1[i] = new Array(numCols);
		frame2[i] = new Array(numCols);
		for (var j=0; j<numCols; j++) {
			//frame1[i][j] = (Math.random() < 0.5);
			//frame2[i][j] = false;
		}	
	}
	var z = 0;
	for (var i=0; i<numRows; i++) {
		var rowElem = document.createElement("div");
		rowElem.className = "row";
		rowElem.row = i;
		for (var j=0; j<numCols; j++) {
			var cellElem = document.createElement("div");
			cellElem.setAttribute("id", z);
			cellElem.row = i;
			cellElem.col = j;
			cellElem.onclick = flipHandler;
			cellElem.className = "cell";
			if (frame1[i][j])
				cellElem.classList.add("live");
			rowElem.appendChild(cellElem);
			z = z+1;
		}
		theUniverse.appendChild(rowElem);
	}
	currentFrame = frame1;
	backFrame = frame2;
	navigator.requestMIDIAccess({}).then( onMIDIInit, onMIDIFail );
	
} );

var selectMIDIIn = null;
var selectMIDIOut = null;
var midiAccess = null;
var midiIn = null;
var midiOut = null;
var launchpadFound = false;

function changeMIDIIn( ev ) {
  if (midiIn)
    midiIn.onmidimessage = null;
  var selectedID = selectMIDIIn[selectMIDIIn.selectedIndex].value;

  for (var input of midiAccess.inputs.values()) {
    if (selectedID == input.id)
      midiIn = input;
  }
  midiIn.onmidimessage = midiProc;
}

function changeMIDIOut( ev ) {
  var selectedID = selectMIDIOut[selectMIDIOut.selectedIndex].value;

  for (var output of midiAccess.outputs.values()) {
    if (selectedID == output.id) {
      midiOut = output;
      console.log('changed to output ' + output.name);
	  //midiOut.send( [0xB0,0x00,0x00] ); // Reset Launchpad
	  //midiOut.send( [0xB0,0x00,0x01] ); // Select XY mode
	  //drawFullBoardToMIDI();
	}
  }
}

function onMIDIFail( err ) {
	alert("MIDI initialization failed.");
	console.log('Could not access your MIDI devices.');
}

function onMIDIInit( midi ) {
  midiAccess = midi;
  selectMIDIIn=document.getElementById("midiIn");
  selectMIDIOut=document.getElementById("midiOut");
  console.log('WebMIDI init');

  // clear the MIDI input select
  selectMIDIIn.options.length = 0;

  for (var input of midiAccess.inputs.values()) {
    if ((input.name.toString().indexOf("Launchpad") != -1)||(input.name.toString().indexOf("QUNEO") != -1)) {
      launchpadFound = true;
      selectMIDIIn.add(new Option(input.name,input.id,true,true));
      midiIn=input;
	  midiIn.onmidimessage = midiProc;

    }
    else
    	selectMIDIIn.add(new Option(input.name,input.id,false,false));
    	console.log('changed to input ' + input.name);
  }
  selectMIDIIn.onchange = changeMIDIIn;

  // clear the MIDI output select
  selectMIDIOut.options.length = 0;
  for (var output of midiAccess.outputs.values()) {
    if ((output.name.toString().indexOf("Launchpad") != -1)||(output.name.toString().indexOf("QUNEO") != -1)) {
      selectMIDIOut.add(new Option(output.name,output.id,true,true));
      midiOut=output;
    }
    else
    	selectMIDIOut.add(new Option(output.name,output.id,false,false));
  }
  selectMIDIOut.onchange = changeMIDIOut;

  if (midiOut && launchpadFound) {  
	//midiOut.send( [0xB0,0x00,0x00] ); // Reset Launchpad
	//midiOut.send( [0xB0,0x00,0x01] ); // Select XY mode
	//drawFullBoardToMIDI();
  }
}







function flipHandler(e) {
	flip( e.target );
}

function flip(elem) {
	currentFrame[elem.row][elem.col] = !currentFrame[elem.row][elem.col];
	if (elem.className == "cell")  // dead
		elem.className = "cell live";
	else
		elem.className = "cell";
	var key = elem.row*16 + elem.col;
	//midiOut.send( [0x90, key, elem.classList.contains("live") ? (elem.classList.contains("mature") ? 0x13:0x30) : 0x00]);
}

function flipid(elem) {
	currentFrame[elem.row][elem.col] = !currentFrame[elem.row][elem.col];
	if (elem.className == "cell")  // dead
		elem.className = "cell live";
	else
		elem.className = "cell";
	//var key = elem.row*16 + elem.col;
	//midiOut.send( [0x90, elem.name, elem.classList.contains("live") ? (elem.classList.contains("mature") ? 0x13:0x30) : 0x00]);
}


function findElemByXY( x, y ) {
	var e, i, j, c;

	for (i in theUniverse.children) {
		e = theUniverse.children[i];
		if (e.row == y) {
			for (j in e.children) {
				if (e.children[j].col == x)
					return e.children[j];
			}
		}
	}
	return null;
}

function flipXY( x, y ) {
	var elem = findElemByXY( x, y );
	if (elem)
		flip( elem );
}

function countLiveNeighbors(frame,x,y) {
	var c=0;

	for (var i=x-1; i<x+2; i++) {
		for (var j=y-1; j<y+2; j++) {
			if ((i!=x)||(j!=y)) {	// skip the cell itself
				if (frame[((i+numRows)%numRows)][((j+numCols)%numCols)])
					c++;
			}
		}
	}
	return c;
}

function drawFullBoardToMIDI() {
//	var t = window.performance.webkitNow();

	if (!launchpadFound)
		return;
	for (var i=0; i<numRows; i++) {
		for (var j=0; j<numCols; j++) {
			var key = i*16 + j;
			if (midiOut)
				midiOut.send( [0x90, key, currentFrame[i][j] ? (findElemByXY(j,i).classList.contains("mature")?0x13:0x30) : 0x00]);
		}	
	}

//	console.log( "draw took " + (window.performance.webkitNow() - t) + " ms.");
}

function drawFullBoardToQUNEO() {
	if (!quneoFound)
		return;
	for (var i=0; i<numRows; i++) {
		for (var j=0; j<numCols; j++) {
			var key = i*32 + j*2;
			if (midiOut)
				midiOut.send( [0x90, key, currentFrame[i][j] ? (findElemByXY(j,i).classList.contains("mature")?0x13:0x30) : 0x00]);
		}	
	}

//	console.log( "draw took " + (window.performance.webkitNow() - t) + " ms.");
}


function updateMIDIFromLastFrame() {
	for (var i=0; i<numRows; i++) {
		for (var j=0; j<numCols; j++) {
			var key = i*16 + j;
			if (currentFrame[i][j] || backFrame[i][j])
				if (midiOut)
					midiOut.send( [0x90, key, currentFrame[i][j] ? (findElemByXY(j,i).classList.contains("mature")?0x13:0x30) : 0x00]);
		}	
	}
}

function tick() {
	var tempFrame = currentFrame;
	var c;

	// swap the frame buffers
	currentFrame = backFrame;
	backFrame = tempFrame;

	// run the algorithm
	for (var i=0; i<numRows; i++) {
		for (var j=0; j<numCols; j++) {
			c = countLiveNeighbors(backFrame,i,j);
			if (backFrame[i][j]) // the cell was alive last frame
				currentFrame[i][j] = ((c==2)||(c==3));
			  else // the cell was dead last frame
			  	currentFrame[i][j] = (c==3);
		}
	}

	//update the cells
	for (var i=0; i<numRows; i++) {
		var rowElem = theUniverse.children[i];
		for (var j=0; j<numCols; j++) {
			var cellElem = rowElem.children[j];
			if (currentFrame[i][j]) {
				cellElem.className = "cell live";
				if (backFrame[i][j])
					cellElem.classList.add("mature");
			} else
			  	cellElem.className = "cell";
		}
	}
//	drawFullBoardToMIDI();
	updateMIDIFromLastFrame();
}

function midiProc(ev) {
	console.log(ev);
	
	var cmd = ev.data[0] >> 4;
	var channel = ev.data[0] & 0xf;
	var noteNumber = ev.data[1];
	var velocity = ev.data[2];

	if ( cmd==8 || ((cmd==9)&&(velocity==0)) ) { // with MIDI, note on with velocity zero is the same as note off
		// note off
		noteOff( noteNumber );
		console.log('noteOff');
	} else if (cmd == 9) {  // Note on
		// note on
		noteOn( noteNumber, velocity);
		console.log('noteOn');
	} else if (cmd == 11) {
		//controller( noteNumber, velocity/127.0);
		console.log('controller');
	} else if (cmd == 14) {
		// pitch wheel
		//pitchWheel( ((velocity * 128.0 + noteNumber)-8192)/8192.0 );
	}
}

function noteOn( note, velocity ) {
	//clog(' note on '+note+' '+velocity);
	//$('notenum').value = note;
	//$('noteval').value = velocity;
	
	//$('grid').id = note;
	midiOut.send( [0x90, note, velocity]);
}

function noteOff( note ) {
	//$('notenum').value = note;
	//$('noteval').value = 0;
	midiOut.send( [0x80, note, 0x00]);

}
function $(id) {
	return document.getElementById(id);
}
// 'value' is normalized to 0..1.
function controller( number, value ) {
	//clog('cc '+number+' '+value);
	$('ccnum').value = number;
	$('ccval').value = value;
	  //send back to controller to update LEDs
	  //ring(number,value);
}

var currentPitchWheel = 0.0;
// 'value' is normalized to [-1,1]
function pitchWheel( value ) {
	var i;
	currentPitchWheel = value;
	clog('pitchwheel '+value);
}
