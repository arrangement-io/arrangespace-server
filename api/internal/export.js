const { convertArrayToCSV } = require('convert-array-to-csv');

exports.exportArrangement = async function (arrangement, type) {
  if (type === 'json') {
    return arrangement;
  } else if (type === 'tsv') {
    return this.convertToTsv(arrangement);
  } else {
    return this.convertToCsv(arrangement);
  }
};

exports.convertToCsv = function (arrangement) {
  let matrix = this.renderArrangement(arrangement);
  let tsvOutput = [];

  for (let line of matrix) {
    let result = convertArrayToCSV(line, { separator: ',' });
    tsvOutput.push(result);
  }
  let result = tsvOutput.join('\n');

  return result;
};

exports.convertToTsv = function (arrangement) {
  let matrix = this.renderArrangement(arrangement);
  let tsvOutput = [];

  for (let line of matrix) {
    let result = convertArrayToCSV(line, { separator: '\t' });
    tsvOutput.push(result);
  }
  let result = tsvOutput.join('\n');

  return result;
};

exports.renderArrangement = function (arrangement) {
  let render = [];

  for (let snapshot of arrangement.snapshots) {
    let snapshotRender = this.renderSnapshot(snapshot, arrangement.containers, arrangement.items);

    // Workaround for transpose bug (only works for length of first row). Just
    //   extend length of first row to match longest length
    let longestArrayIndex = snapshotRender.reduce(function (maxI, el, i, arr) {
      return el.length > arr[maxI].length ? i : maxI;
    }, 0);
    // If index is not 0, then the first row is not the longest, so extend it.
    if (longestArrayIndex > 0) {
      let lengthDiff = snapshotRender[longestArrayIndex].length - snapshotRender[0].length;
      let extend = Array(lengthDiff).fill('');
      snapshotRender[0].push(...extend);
    }

    // Transpose array to format we want
    // [1, 1, 1, 1]         [1, 2, 3]
    // [2, 2,]        --->  [1, 2, 3]
    // [3, 3, 3, 3]]        [1,  , 3]
    //                      [1,  , 3]
    //
    let result = snapshotRender[0].map((row, i) => snapshotRender.map(col => col[i]));
    render.push(result);
  };

  return render;
};

exports.renderSnapshot = function (snapshot, containers, items) {
  let output = [];
  let sider = [snapshot.name, 'car', 'driver', 'passenger'];
  output.push(sider);

  for (let container of snapshot.snapshotContainers) {
    let containerAndItems = ['', this.retrieveName(container._id, containers)];

    for (let item of container.items) {
      containerAndItems.push(this.retrieveName(item, items));
    };
    output.push(containerAndItems);
  };

  let unassignedItems = ['', 'unassigned'];
  for (let item of snapshot.unassigned) {
    unassignedItems.push(this.retrieveName(item, items));
  };
  output.push(unassignedItems);

  return output;
};

exports.retrieveName = function (objectId, objectList) {
  for (let obj of objectList) {
    if (obj._id === objectId) {
      return obj.name;
    }
  };
};
