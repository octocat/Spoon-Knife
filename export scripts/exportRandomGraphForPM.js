var fs = require('fs');
var gexf = require('ngraph.gexf');
var createLayout = require('ngraph.offline.layout');

// a random 10000 by 100000 graph
var graph = require('ngraph.generators').grid(100, 100);

graph.forEachNode(function(node){
    console.log(node.id, node.data);
});

console.log("Graph has " + graph.getNodesCount() + " nodes.");

// run 1000 iterations of forcelayout3d and save to positions.bin
var layout = createLayout(graph, {
  iterations: 1000, // Run `100` iterations only
  saveEach: 1000, // Save each `10th` iteration
  outDir: './output', // Save results into `./myFolder`
  layout: require('ngraph.forcelayout3d') // use custom layouter
});
layout.run();

// export meta.json, labels.json, and links.bin
var save = require('ngraph.tobinary');
save(graph, {
  outDir: './output',
});
