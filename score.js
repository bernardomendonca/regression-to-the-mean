const outputs = [];

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
}

function runAnalysis() {
  const testSetSize = 10;
  // running the splitDataset function and spliting them into two:
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize);

  _.range(1, 20).forEach((k) => {
    const accuracy = _.chain(testSet)
      .filter((testPoint) => knn(trainingSet, testPoint[0], k) === testPoint[3])
      .size()
      .divide(testSetSize)
      .value();

    console.log("the value of K is: ", k, " and the accuracy is:", accuracy);
  });
}

function knn(data, point, k) {
  return _.chain(data)
    .map((row) => [distance(row[0], point), row[3]])
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
  // using the pitagorean theorem
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
