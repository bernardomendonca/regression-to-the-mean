const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 100;
  const k = 10;

  _.range(0, 3).forEach((feature) => {
    const data = _.map(outputs, (row) => [row[feature], _.last(row)]);
    // running the splitDataset function and spliting them into two
    // just before splitting, we want to normalise our dataset by running the minMax function for 3 features
    const [testSet, trainingSet] = splitDataset(minMax(data, 1), testSetSize);
    const accuracy = _.chain(testSet)
      .filter(
        (testPoint) =>
          knn(trainingSet, _.initial(testPoint), k) === _.last(testPoint)
      )
      .size()
      .divide(testSetSize)
      .value();

    console.log("For feature of ", feature, " the accuracy is:", accuracy);
  });
}

function knn(data, point, k) {
  // points has to be passed without the label (last element)
  return _.chain(data)
    .map((row) => {
      return [
        distance(_.initial(row), point),
        //label
        _.last(row),
      ];
    })
    .sortBy((row) => row[0])
    .slice(0, k)
    .countBy((row) => row[1])
    .toPairs()
    .sortBy((row) => row[1])
    .last()
    .first()
    .parseInt()
    .value();
}

function distance(pointA, pointB) {
  // distance between arrays, such as
  // pointA = [] and pointB =[]
  // using the pythagorean theorem
  return (
    _.chain(pointA)
      .zip(pointB)
      .map(([a, b]) => (a - b) ** 2)
      .sum()
      .value() ** 0.5
  );
}

//testCount is how many sets we want to have in the test set
function splitDataset(data, testCount) {
  // shuffling the data
  const shuffled = _.shuffle(data);
  // split set into two
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}

function minMax(data, featureCount) {
  // we'll clone the outputs array, so we can modify it freely
  // there's a lodash method for that:
  const clonedData = _.cloneDeep(data);
  // we'll iterate over each feature that we want to normalise:
  for (let i = 0; i < featureCount; i++) {
    // extracting each column
    const column = clonedData.map((row) => row[i]);
    // getting min and max from each column of that array
    const min = _.min(column);
    const max = _.max(column);
    // iterating over each row of the column:
    for (let j = 0; j < clonedData.length; j++) {
      // update the value of each drop position
      // cloneData at ROW j and COLUMN i
      clonedData[j][i] = (clonedData[j][i] - min) / (max - min);
    }
  }

  return clonedData;
}
