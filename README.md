cpu-stat
========

```
  _______ _______ ___ ___ _______ _______ _______ _______
 |   _   |   _   |   Y   |   _   |       |   _   |       |
 |.  1___|.  1   |.  |   |   1___|.|   | |.  1   |.|   | |
 |.  |___|.  ____|.  |   |____   `-|.  |-|.  _   `-|.  |-'
 |:  1   |:  |   |:  1   |:  1   | |:  | |:  |   | |:  |
 |::.. . |::.|   |::.. . |::.. . | |::.| |::.|:. | |::.|
 `-------`---'   `-------`-------' `---' `--- ---' `---'
```

**Note:** This repo can be found on npm here: [cpu-stat](https://www.npmjs.com/package/cpu-stat)

**Note:** This module only relies on the `os` module, so it should be cross compatible on all OS's where Node.js runs.

Install
-------

```
npm install cpu-stat
```

Example
-------

```
var cpuStat = require('cpu-stat');

//by default returns average cpu usage percent over all cores
cpuStat.usagePercent(function(percent) {
    console.log(percent);
});

//get the average cpu usage percent for core 0 over a sample period of 2000ms
cpuStat.usagePercent({
    coreIndex: 0,
    sampleMs: 2000,
  },
  function(coreZeroPercent) {
    console.log(coreZeroPercent);
});

//get the total number of cores
var totalCores = cpuStat.totalCores();
console.log(totalCores);

//get the average clock Mhz over all cores
var avgClockMhz = cpuStat.avgClockMhz();
console.log(avgClockMhz);

//get the average clock Mhz for core with index 2
var avgClockMhzCore2 = cpuStat.clockMhz(2);
console.log(avgClockMhzCore2);
```

usagePercent(opts, cb)
----------------------

Returns an integer representing the number of `units` received on `iface`.

Option               | Type         | Default            | Explanation
-------------------- | -------------| ------------------ | ------------
opts                 | `Object`     | see below          | Options object, specify what you need the defaults will be filled in
opts.coreIndex       | `Number`     | all cores          | The index of the core to calculate the usage on. Can use any `coreIndex` such that `0 >= coreIndex < memStat.totalCores()`
opts.sampleMs        | `String`     | `1000`             | `sampleMs` is the amount of time to take the measurement over
cb                   | `Function`   | none               | Callback which has signature `cb(percent)`

totalCores()
------------

Returns the total number of cores available on the cpu

clockMHz(coreIndex)
-------------------

Returns the clock speed in Mhz of core with index `coreIndex`

avgClockMhz()
-------------

Returns the average clock speed in Mhz over all cores

Contributing
------------

Just send a PR, or create an issue if you are not sure.

Areas ripe for contribution:
- testing
- performance
- bugs

License
-------

MIT

