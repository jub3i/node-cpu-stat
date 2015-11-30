var os = require('os');

module.exports = {
  usagePercent: usagePercent,
  totalCores: totalCores,
  clockMHz: clockMHz,
  avgClockMhz: avgClockMhz,
};

/* PUBLIC */

function usagePercent(opts, cb) {
  var cpus = os.cpus();

  var timeTotalDelta0 = 0;
  var timeTotalDelta1 = 0;

  var timeIdleDelta0 = 0;
  var timeIdleDelta1 = 0;

  var cpuDelta1;
  var cpuDelta0;

  var time;

  //opts is optional
  if (typeof opts === 'function') {
    cb = opts;
    opts = {
      coreIndex: -1,
      sampleMs: 1000,
    };
  } else {
    opts.coreIndex = opts.coreIndex || -1;
    opts.sampleMs = opts.sampleMs || 1000;
  }

  //check if core exists
  if (opts.coreIndex >= cpus.length || opts.coreIndex < -1) {
    _error(opts.coreIndex, cpus.length);
    return cb('coreIndex out of bounds');
  }

  //all cpu's average
  if (opts.coreIndex === -1) {
    cpuDelta0 = os.cpus();
    time = process.hrtime();

    setTimeout(function() {
      cpuDelta1 = os.cpus();

      var diff = process.hrtime(time);
      var diffSeconds = diff[0] + diff[1] * 1e-9;

      //do the number crunching below and return
      for (var i = 0; i < cpuDelta1.length; i++) {
        timeTotalDelta1 += cpuDelta1[i].times.user;
        timeTotalDelta1 += cpuDelta1[i].times.nice;
        timeTotalDelta1 += cpuDelta1[i].times.sys;
        timeIdleDelta1 += cpuDelta1[i].times.idle;
      }

      for (i = 0; i < cpuDelta0.length; i++) {
        timeTotalDelta0 += cpuDelta0[i].times.user;
        timeTotalDelta0 += cpuDelta0[i].times.nice;
        timeTotalDelta0 += cpuDelta0[i].times.sys;
        timeIdleDelta0 += cpuDelta0[i].times.idle;
      }

      var timeTotalDelta = timeTotalDelta1 - timeTotalDelta0;
      var timeIdleDelta = timeIdleDelta1 - timeIdleDelta0;

      var percentPerSecond =
        ((timeTotalDelta / timeIdleDelta) / (diffSeconds * diffSeconds)) * 100;

      cb(percentPerSecond);
    }, opts.sampleMs);

  //only one cpu core
  } else {
    cpuDelta0 = os.cpus();
    time = process.hrtime();

    setTimeout(function() {
      cpuDelta1 = os.cpus();

      var diff = process.hrtime(time);
      var diffSeconds = diff[0] + diff[1] * 1e-9;

      timeTotalDelta1 += cpuDelta1[opts.coreIndex].times.user;
      timeTotalDelta1 += cpuDelta1[opts.coreIndex].times.nice;
      timeTotalDelta1 += cpuDelta1[opts.coreIndex].times.sys;
      timeIdleDelta1 += cpuDelta1[opts.coreIndex].times.idle;

      timeTotalDelta0 += cpuDelta0[opts.coreIndex].times.user;
      timeTotalDelta0 += cpuDelta0[opts.coreIndex].times.nice;
      timeTotalDelta0 += cpuDelta0[opts.coreIndex].times.sys;
      timeIdleDelta0 += cpuDelta0[opts.coreIndex].times.idle;

      var timeTotalDelta = timeTotalDelta1 - timeTotalDelta0;
      var timeIdleDelta = timeIdleDelta1 - timeIdleDelta0;

      var percentPerSecond =
        ((timeTotalDelta / timeIdleDelta) / (diffSeconds * diffSeconds)) * 100;

      cb(percentPerSecond);
    }, opts.sampleMs);

  }
}

function totalCores() {
  return os.cpus().length;
}

function clockMHz(coreIndex) {
  var cpus = os.cpus();

  //check core exists
  if (coreIndex < 0 || coreIndex >= cpus.length) {
    _error(coreIndex, cpus.length);
    return 'coreIndex out of bounds';
  }

  return cpus[coreIndex].speed;
}

function avgClockMhz() {
  var cpus = os.cpus();
  var totalHz = 0;

  for (var i = 0; i < cpus.length; i++) {
    totalHz += cpus[i].speed;
  }

  var avgHz = totalHz / cpus.length;
  return avgHz;
}

/* PRIVATE */

function _error(coreIndex, maxCores) {
  var errMsg =
    '[cpu-stats] Error: Core "' + coreIndex + '" not found, use one of ' +
    '[0, ' + (maxCores - 1) + '], ' +
    'since your system has ' + maxCores + ' cores.';
  console.log(errMsg);
}
