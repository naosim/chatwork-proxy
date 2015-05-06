var exec = require('child_process').exec;
var CycleLogCopy = function () {
    var getInterval = function () {
        var today = new Date();
        var nextday = new Date("" + today.getFullYear() + "/" + (today.getMonth() + 1) + "/" + (today.getDate() + 1));
        return nextday.getTime() - today.getTime();
    };
    var loop = function () {
        exec('sh ./logcopy.sh');
        setTimeout(loop, getInterval());
    };
    var runByDay = function () {
        setTimeout(loop, getInterval());
    };
    return {
        runByDay: runByDay
    };
};
module.exports = CycleLogCopy;
