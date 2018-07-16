// HANGUL IME BY PERRY H
// TODO make the input of initial, medial and finals complete (currently only works with initials)

/**
 * A stack data structure containing a fixed amount of elements.
 * If the stack is full, the oldest elements are overwritten by newly added elements
 */
function FixedStack(stackSize) {
	this.size = stackSize;
	this.top = -1;
	this.stack = new Array(stackSize);
}

// Push an item onto the top of the stack
FixedStack.prototype.push = function(item) {
	this.top = (this.top + 1) % this.size;
	this.stack[this.top] = item;
	return false;
}

// Get the 1st element (top) in the stack
FixedStack.prototype.top = function() {
	return this.stack[this.top];
}

// Get the nth added element in the stack
FixedStack.prototype.nthTop = function(n) {
	if (n >= 0 && n < this.size) {
		var nIndex = this.top - n;
		return this.stack[(nIndex % this.size + this.size) % this.size];
	}
	return undefined;
}

// DEBUGGING ONLY: Print the contents of the stack starting with the most recently pushed one
FixedStack.prototype.showContents = function() {
	var res = "[";
	for (var i = 0; i > (-this.size); i--) {
		var iAdjusted = ((i + this.top) % this.size + this.size) % this.size;
		var disp = (this.stack[iAdjusted] != undefined) ? this.stack[iAdjusted] : "null";
		res += (disp + ",");
	}
	res += "]";
	return res;
}

var initials = new Map([
	["r", 'ᄀ'],
	["R", 'ᄁ'],
	["s", 'ᄂ'],
	["e", 'ᄃ'],
	["E", 'ᄄ'],
	["f", 'ᄅ'],
	["a", 'ᄆ'],
	["q", 'ᄇ'],
	["Q", 'ᄈ'],
	["t", 'ᄉ'],
	["T", 'ᄊ'],
	["d", 'ᄋ'],
	["w", 'ᄌ'],
	["W", 'ᄍ'],
	["c", 'ᄎ'],
	["z", 'ᄏ'],
	["x", 'ᄐ'],
	["v", 'ᄑ'],
	["g", 'ᄒ']
]);


var medials = new Map([
	["k",  'ᅡ'],
	["o",  'ᅢ'],
	["i",  'ᅣ'],
	["O",  'ᅤ'],
	["j",  'ᅥ'],
	["p",  'ᅦ'],
	["u",  'ᅧ'],
	["P",  'ᅨ'],
	["h",  'ᅩ'],
	["hk", 'ᅪ'],
	["ho", 'ᅫ'],
	["hl", 'ᅬ'],
	["y",  'ᅭ'],
	["n",  'ᅮ'],
	["nj", 'ᅯ'],
	["np", 'ᅰ'],
	["nl", 'ᅱ'],
	["b",  'ᅲ'],
	["m",  'ᅳ'],
	["ml", 'ᅴ'],
	["l",  'ᅵ']
]);

var finals = new Map([
	["", ' '],
	["r",  'ᆨ'],
	["R",  'ᆩ'],
	["rt", 'ᆪ'],
	["s",  'ᆫ'],
	["sw", 'ᆬ'],
	["sg", 'ᆭ'],
	["e",  'ᆮ'],
	["f",  'ᆯ'],
	["fr", 'ᆰ'],
	["fa", 'ᆱ'],
	["fq", 'ᆲ'],
	["ft", 'ᆳ'],
	["fx", 'ᆴ'],
	["fv", 'ᆵ'],
	["fg", 'ᆶ'],
	["a",  'ᆷ'],
	["q",  'ᆸ'],
	["qt", 'ᆹ'],
	["t",  'ᆺ'],
	["T",  'ᆻ'],
	["d",  'ᆼ'],
	["w",  'ᆽ'],
	["c",  'ᆾ'],
	["z",  'ᆿ'],
	["x",  'ᇀ'],
	["v",  'ᇁ'],
	["g",  'ᇂ']
]);

// Check if this char is a Hangul Jamo initial
function isInitial(c) {
	return ('\u1100' <= c && c <= '\u1112');
}
// Check if this char is a Hangul Jamo medial
function isMedial(c) {
	return ('\u1161' <= c && c <= '\u1175');
}
// Check if this char is a Hangul Jamo final
function isFinal(c) {
	return ('\u11A8' <= c && c <= '\u11C2');
}

// Enum for storing current state
var state = {
	"NO_SYLLABLE": 1,
	"CV_SYLLABLE": 2,
	"CVC_SYLLABLE": 3,
	"NONE": 4,
};
Object.freeze(state);

var currentStatus = state.NO_SYLLABLE;
console.log("STATUS = " + currentStatus);

var input = "";

var lastChar = ' ';

// Change the state for every new character inputted
function changeStatus(cs, prevChar) {
	if (isFinal(prevChar) || prevChar === undefined) {
		cs = state.NO_SYLLABLE;
	} else if (isInitial(prevChar)) {
		cs = state.CV_SYLLABLE;
	} else if (isMedial(prevChar)) {
		cs = state.CVC_SYLLABLE;
	} else {
		cs = state.NONE;
	}

	return cs;
}

function calculate(input, pressedKey, selStart, thisObject) {
	var lastNchars = (input.length < 2)
			? input.substring(0, selStart)
			: input.substring(selStart-2, selStart);
	var lastChar = lastNchars.charAt(lastNchars.length-1);

	currentStatus = changeStatus(currentStatus, lastChar);

	// Get current char
	// TODO Use the NAKD technique in HangulReplacer to decide whether consonant goes to previous or next syllable
	var b = pressedKey;
	var character = undefined;
	if (currentStatus === state.NONE) {
		character = initials.get(b);
	}
	else if (currentStatus === state.NO_SYLLABLE) {
		character = initials.get(b);
	} else if (currentStatus === state.CV_SYLLABLE)  {
		character = medials.get(b);
	} else if (currentStatus === state.CVC_SYLLABLE) {
		character = finals.get(b);
	} else {
		character = b;
	}
	if (character === undefined) {
		character = b;
	}
	console.log("lastChar" + lastChar + " PressedKey=" + b
			+ " CHAR=" + character
			+ " isIni()=" + isInitial(character)
			+ " isMed()=" + isMedial(character)
			+ " isFin()=" + isFinal(character)
			+ " STATUS=" + currentStatus);

	// Insert character at cursor position
	var output = input.slice(0, selStart) + character + input.slice(selStart);
	console.log("LAST CHAR = " + input.charAt(selStart-1));
	console.log("INPUT =  '" + input + "'");
	console.log("OUTPUT = '" + output + "'");

	return output;
}

function fixedStackTest() {
	var stacko = new FixedStack(5);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(1);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(2);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(3);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(4);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(5);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(6);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());
	stacko.push(7);
	console.log("STACKO TOP = " + stacko.top + " " + stacko.showContents());

	var stacka = new FixedStack(9);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(1);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(2);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(3);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(4);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(5);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(6);
	console.log("stacka TOP = " + stacka.top + " " + stacka.showContents());
	stacka.push(7);
	console.log("STACKA TOP = " + stacka.top + " " + stacka.showContents());
}

function doSomething(e, thisObject) {
	console.log("=================");

	// Get keycode of pressed key
	var keynum;
	if (window.event) { // IE
		keynum = e.keyCode;
	} else if (e.which) { // Netscape/Firefox/Opera
		keynum = e.which;
	}

	var pressedKey = String.fromCharCode(keynum);
	console.log("Pressed Key: -" + keynum + "- " + pressedKey);

	// TODO for some reason, the selectionStart value (cursor position) is delayed by 1 keypress!
	// TODO find out why!
	var selStart = thisObject.selectionStart;
	var selEnd = thisObject.selectionEnd;
	console.log("START=" + selStart + " END=" + selEnd);

	// Disable inserting the char if it's an ASCII char or the Enter key
	if (keynum == 13 || (keynum >= 32 && keynum <= 126)) e.preventDefault();

	//if (document.forms[0].hangulime.value==input)
	//	return;

	// Do not calculate if backspace is pressed
	if (keynum != 8 && keynum != undefined) {
		input = thisObject.value;
		thisObject.value = calculate(input, pressedKey, selStart, thisObject);
		thisObject.selectionEnd = selStart + 1; // resets cursor to previously known position
	}

	//fixedStackTest();
}
