var fs = require('fs');
var gexf = require('ngraph.gexf');

// import .gexf file
var graph = gexf.load(fs.readFileSync('cryo_computation_network.gexf', 'utf8'));

var labelsText = "["
var firstIteration = new Boolean(true);
graph.forEachNode(function(node){
    var id = node.id;
    var label = node.data['label'];
    console.log(id, label);
    if(firstIteration) {
      labelsText += ('"' + label + '"');
      firstIteration = !firstIteration;
    }
    labelsText += (', "' + label + '"');
});
labelsText = labelsText.concat("]");

console.log(labelsText);

console.log("Graph has " + graph.getNodesCount() + " nodes.");

fs.writeFile("../cryo/data/labels.json", labelsText, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
