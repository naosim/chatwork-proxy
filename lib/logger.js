module.exports = (function(){
  var SimpleDateFormat = function() {
    var zerofill = function(num, zeros) {
      zeros = zeros || 2;
      return (Array(zeros).join('0') + num).slice(-zeros);
    };
    var formatDate = function(d) {
      d = d || new Date();
      return d.getFullYear() + '-' + zerofill(d.getMonth() + 1) + '-' + zerofill(d.getDate()) + 'T' + d.toLocaleTimeString();
    };
    return formatDate
  };
  var format = SimpleDateFormat();

  var log = function(/* args */) {
    var l = [format()];
    for(var i = 0; i < arguments.length; i++) {
      l.push(arguments[i]);
    }
    console.log.apply(console, l);
  };
  return { log: log };
})();
