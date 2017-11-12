// regular counter
var up = $('#up').asEventStream('click');
var down = $('#down').asEventStream('click');
var reset = $('#reset').asEventStream('click');

var theCounts1 = up.map(+1).merge(down.map(-1)).merge(reset.map(0)).scan(0, function(x, y) {if (y === 0) {return 0} else { return x + y }});
//assign value to counter
theCounts1.assign($('#theCounts1'), 'text');

// factorial counter
var factNext = $('#factNext').asEventStream('click');
var factPrev = $('#factPrev').asEventStream('click');
var reset = $('#resetFact').asEventStream('click');

// need to create an input stream of "consecutive pairs" of integers to build fact and reverse fact
var theCounts2 = factNext.map(1).merge(reset.map(0)).merge(factPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 1} else {if (y[0]>= y[1]) {return x/y[0] } else {return x*y[1]}}});

theCounts2.assign($('#theCounts2'), 'text');

// fib counter
var fibNext = $('#fibNext').asEventStream('click');
var fibPrev = $('#fibPrev').asEventStream('click');
var reset = $('#resetFib').asEventStream('click');

// similar to fact, need to keep in memory the previous value so that reverse fib can work
var  theCounts3 = fibNext.map(1).merge(reset.map(0)).merge(fibPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {if (y < 0) { return [x[1]-x[0], x[0]] } else {return [x[1], x[1] + x[0]]}}}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 0} else {if (y[0]>= y[1]) {return y[0]} else {return y[1]}}});

theCounts3.assign($('#theCounts3'), 'text');

// foldleft counter

// some options for the folding function
function divide(x, y) {
    return x/y
}

function diff(x, y) {
    return x-y
}

function mult(x, y) {
    return x*y
}

function sum(x, y) {
    return x+y
}

var foldNext = $('#foldNext').asEventStream('click');
var foldPrev = $('#foldPrev').asEventStream('click');
var reset = $('#resetFold').asEventStream('click');

var s = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});

// higher order function - takes an initial value, a function (and its inverse) and applies a foldleft on the integer stream
function myfunc(st, init, f, inv) {
    return st.scan(init, function(x, y) {if ( y[0] === 0 ) {return init} else {if (y[0] >= y[1]) {return inv(x, y[1])} else {return f(x, y[0])}}})
}

var theCounts_sum = myfunc(s, 0, sum, diff);
var theCounts_mult = myfunc(s, 1, mult, divide);
var theCounts_div = myfunc(s, 1, divide, mult);
var theCounts_diff = myfunc(s, 0, diff, sum);
    
theCounts_sum.assign($('#theCounts_sum'), 'text');
theCounts_mult.assign($('#theCounts_mult'), 'text');
theCounts_div.assign($('#theCounts_div'), 'text');
theCounts_diff.assign($('#theCounts_diff'), 'text');


// rolling mean on integers
var rollNext = $('#rollNext_m').asEventStream('click');
var rollPrev = $('#rollPrev_m').asEventStream('click');
var reset = $('#resetRoll_m').asEventStream('click');

var theCounts5 = rollNext.map(1).merge(reset.map(0)).merge(rollPrev.map(-1)).scan([0, 1, 0], function(x,y) {if (y === 0) {return [0, 1, 0]} else {if (y < 0) {return [x[0]+y, x[1]+y, diff(x[2], x[0])]} else {return [x[0] + y, x[1] + y, sum(x[2], x[1])]}}}).scan(0, function(x, y) {return y[2]/y[1]});

theCounts5.assign($('#theCounts5'), 'text');


// square (map) counter on integers
var sqNext = $('#sqNext').asEventStream('click');
var sqPrev = $('#sqPrev').asEventStream('click');
var reset = $('#resetSq').asEventStream('click');

function square(x) {
    return x*x
}

var theCounts6 = sqNext.map(1).merge(reset.map(0)).merge(sqPrev.map(-1)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}}).scan(0, function(x, y) {return square(y)});

theCounts6.assign($('#theCounts6'), 'text');


// foldleft2 counter
var foldNext = $('#fold2Next').asEventStream('click');
var foldPrev = $('#fold2Prev').asEventStream('click');
var reset = $('#resetFold2').asEventStream('click');

var s1 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});
var s2 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}});

// higher order function - takes an initial value, a function (and its inverse) and applies a foldleft on a combination of the 2 integer streams
function myfunc2(st1, st2, init, f, inv) {
    return st1.combine(st2, function (x, y) {return [x, y]}).scan(init, function(x, y) {if ( y[0][0] === 0 ) {return init} else {if (y[0][0] >= y[0][1]) {return inv(x, y[0][0], y[1][0])} else {return f(x, y[0][1], y[1][1])}}})
}

function sumSq(x, y, z) {
    return x + y*z
}

function sumSqInv(x, y, z) {
    return x - y*z
}

function sumInvSq(x, y, z) {
    return x + 1/(y*z)
}

function sumInvSqInv(x, y, z) {
    return x - 1/(y*z)
}

var theCounts_sumSq = myfunc2(s1, s2, 0, sumSq, sumSqInv);
var theCounts_sumInvSq = myfunc2(s1, s2, 1, sumInvSq, sumInvSqInv);
    
theCounts_sumSq.assign($('#theCounts_sumSq'), 'text');
theCounts_sumInvSq.assign($('#theCounts_sumInvSq'), 'text');

// theNatsPairs counter
var pairNext = $('#pairsNext').asEventStream('click');
var pairPrev = $('#pairsPrev').asEventStream('click');
var reset = $('#resetPairs').asEventStream('click');

function aux(n, i) {
    if (i <= n) {
	return "( " + [i, n-i] + " )" + ", " + aux(n, i+1)
    } else {
	return []
    }
}

function diag(n) {
    return aux(n, 0)
}

var next = pairNext.map(1).merge(pairPrev.map(-1)).merge(reset.map(0)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}});
var theCounts_pairs = next.map(function(x) {return "( " + diag(x).toString().slice(0, -2) + " )"});

theCounts_pairs.assign($('#theCounts_pairs'), 'text');


// theNatsTriples counter
var tripleNext = $('#triplesNext').asEventStream('click');
var triplePrev = $('#triplesPrev').asEventStream('click');
var reset = $('#resetTriples').asEventStream('click');

function aux(n, i, j) {
    if (i+j < n) {
	return "( " + [i, j, n-(i+j)] + " )" + ", " + aux(n, i+1, j)
    } else {
	if (j <= n) {
	    return "( " + [i, j, n-(i+j)] + " )" + ", " + aux(n, 0, j+1)
	} else {
	    return []
	}
    }
}

function triang(n) {
    return aux(n, 0, 0)
}

var next = tripleNext.map(1).merge(triplePrev.map(-1)).merge(reset.map(0)).scan(0, function(x,y) {if (y === 0) {return 0} else {return x + y}});
var theCounts_triples = next.map(function(x) {return "( " + triang(x).toString().slice(0, -2) + " )"});

theCounts_triples.assign($('#theCounts_triples'), 'text');
