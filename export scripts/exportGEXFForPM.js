var fs = require('fs');
var gexf = require('ngraph.gexf');
var createLayout = require('ngraph.offline.layout');

// import celegans.gexf
var graph = gexf.load(fs.readFileSync('cryo_computation_network.gexf', 'utf8'));

graph.forEachNode(function(node){
    console.log(node.id, node.data);
});

console.log("Graph has " + graph.getNodesCount() + " nodes.");

// run 1000 iterations of forcelayout3d and save to positions.bin
var layout = createLayout(graph, {
  iterations: 1000, // Run `100` iterations only
  saveEach: 1000, // Save each `10th` iteration
  outDir: './cryo/data', // Save results into `./myFolder`
  layout: require('ngraph.forcelayout3d') // use custom layouter
});
layout.run();

// export meta.json, labels.json, and links.bin
var save = require('ngraph.tobinary');
save(graph, {
  outDir: './cryo/data',
});
