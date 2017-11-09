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
var theCounts2 = factNext.map(1).merge(reset.map(0)).merge(factPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {return [x[1], x[1] + y]}}).map(function(p) {return p}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 1} else {if (y[0]>= y[1]) {return x/y[0] } else {return x*y[1]}}});

theCounts2.assign($('#theCounts2'), 'text');

// fib counter
var fibNext = $('#fibNext').asEventStream('click');
var fibPrev = $('#fibPrev').asEventStream('click');
var reset = $('#resetFib').asEventStream('click');

// similar to fact, need to keep in memory the previous value so that reverse fib can work
var  theCounts3 = fibNext.map(1).merge(reset.map(0)).merge(fibPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 1]} else {if (y < 0) { return [x[1]-x[0], x[0]] } else {return [x[1], x[1] + x[0]]}}}).map(function(p) {return p}).scan(1, function(x, y) {if ( y[0] === 0 ) {return 0} else {if (y[0]>= y[1]) {return y[0]} else {return y[1]}}});

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

var incr3 = foldNext.map(1).merge(reset.map(0)).merge(foldPrev.map(-1)).scan([0, 1], function(x,y) {if (y === 0) {return [0, 0]} else {return [x[1], x[1] + y]}});

// higher order function - takes an initial value and a function and applies a foldleft on the integer stream
function myfunc(init, f, inv) {
    return incr3.map(function(p) {return p}).scan(init, function(x, y) {if ( y[0] === 0 ) {return init} else {if (y[0] >= y[1]) {return inv(x, y[1])} else {return f(x, y[0])}}})
}

var theCounts_sum = myfunc(0, sum, diff);
var theCounts_mult = myfunc(1, mult, divide);
var theCounts_div = myfunc(1, divide, mult);
var theCounts_diff = myfunc(0, diff, sum);
    
theCounts_sum.assign($('#theCounts_sum'), 'text');
theCounts_mult.assign($('#theCounts_mult'), 'text');
theCounts_div.assign($('#theCounts_div'), 'text');
theCounts_diff.assign($('#theCounts_diff'), 'text');


// rolling mean of integers
var rollNext = $('#rollNext').asEventStream('click');
var rollPrev = $('#rollPrev').asEventStream('click');
var reset = $('#resetRoll').asEventStream('click');

var theCounts5 = rollNext.map(1).merge(reset.map(0)).merge(rollPrev.map(-1)).scan([0, 1, 0], function(x,y) {if (y === 0) {return [0, 1, 0]} else {if (y < 0) {return [x[0]+y, x[1]+y, diff(x[2], x[0])]} else {return [x[0] + y, x[1] + y, sum(x[2], x[1])]}}}).map(function(p) {return p}).scan(0, function(x, y) {return y[2]/y[1]});;

theCounts5.assign($('#theCounts5'), 'text');
