'use strict';

window.angular.module('ngl2.directives.tree', [])
	.directive('tree', ['Trees', function (Trees) {
		return {
			restrict: 'E',
			template: '<div class="tree"></div>',
			scope: {
				person: '='
			},
			link: function (scope, elem, attrs) {
				var nodeData = angular.copy(scope.person),
						_people = Trees.getPeople();

				// build node list
				nodeData.children = [];
				for(var i in scope.person.child_ids) {
					var id = scope.person.child_ids[i];
					nodeData.children.push(angular.copy(_people[id]));
				}

				console.log('nodes', nodeData);
				console.log('elem', elem);
				// Create a svg canvas
	      var vis = d3.select(elem[0]).append('svg:svg')
	      .attr('width', 400)
	      .attr('height', 150)
	      .append('svg:g')
	      .attr('transform', 'translate(100, 0)'); // shift everything to the right
	 
	      // Create a tree "canvas"
	      var tree = d3.layout.tree()
	      .children(function(d) {
					if(d.spouses) {
						return (Object.prototype.toString.call( d.spouses ) === '[object Array]') ? d.spouses : [d.spouses];
					} else {
						return d.children;
					}
				})
	    	.size([150,150]);
	 
	      var diagonal = d3.svg.diagonal()
	      // change x and y (for the left to right tree)
	      .projection(function(d) { return [d.y, d.x]; });
	 
	      // Preparing the data for the tree layout, convert data into an array of nodes
	      var nodes = tree.nodes(nodeData);
	      // Create an array with all the links
	      var links = tree.links(nodes);
	 
	      console.log(nodeData);
	      console.log(nodes);
	      console.log(links);
	 
	      var link = vis.selectAll('pathlink')
	      .data(links)
	      .enter().append('svg:path')
	      .attr('class', 'link')
	      .attr('d', diagonal);
	 
	      var node = vis.selectAll('g.node')
	      .data(nodes)
	      .enter().append('svg:g')
	      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; });
	 
	      // Add the dot at every node
	      node.append('svg:circle')
	      .attr('r', 3.5);
	 
	      // place the name atribute left or right depending if children
	      node.append('svg:text')
	      .attr('dx', function(d) { return d.children ? -8 : 8; })
	      .attr('dy', 3)
	      .attr('text-anchor', function(d) { return d.children ? 'end' : 'start'; })
	      .text(function(d) { return d.birth_name; });
	 
			}
		};
	}]);