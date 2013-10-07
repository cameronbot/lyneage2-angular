'use strict';

window.angular.module('ngl2.directives.tree', [])
	.directive('tree', ['Trees', function (Trees) {
		return {
			restrict: 'A',
			scope: {
				person: '='
			},
			link: function (scope, elem, attrs) {
				var d3 = window.d3,
						nodeData = angular.copy(scope.person),
						_people = Trees.getPeople();

				var vis = d3.select(elem[0])
				      .append('svg:g')
				      .attr('transform', 'translate(20, 50)'); // shift everything to accomodate diagonal labels
				 
		 		// Create a tree "canvas"
	      var tree = d3.layout.tree()
				      .children(function(d) {
								//return d.spouses;

								if(d.spouses) {
									return d.children.concat(d.spouses);
									//return (Object.prototype.toString.call( d.spouses ) === '[object Array]') ? d.spouses : [d.spouses];
								} else {
									return d.children;
								}
							})
							.size([150,150]);

				var diagonal = d3.svg.diagonal()
							// change x and y (for the left to right tree)
							.projection(function(d) { return [d.y, d.x]; });
			
				var drawTree = function(newValue, oldValue) {
					var i = 0, j = 0,
							id, spouse, children;

          if (newValue) {
            // clear existint chart
            vis.remove();

            vis = d3.select(elem[0])
				      .append('svg:g')
				      // shift everything to accomodate diagonal labels
				      .attr('transform', 'translate(20, 50)');
				 
						// build node list
            nodeData = angular.copy(scope.person);
						nodeData.children = [];
						nodeData.spouses = [];

						// loop over spouses
						for (i in nodeData.spouse_ids) {
							id = nodeData.spouse_ids[i];
							spouse = angular.copy(_people[id]);
							children = [];

							// find children of spouse and person (intersection)
							for (j in spouse.child_ids) {
								id = spouse.child_ids[j];

								if (nodeData.child_ids.indexOf(id) > -1) {
									children.push(angular.copy(_people[id]));
								}
							}

							if(children.length) {
								spouse.children = children;
							}

							nodeData.spouses.push(spouse);
						} // end spouse loop

			      var nodes = tree.nodes(nodeData);
			      var links = tree.links(nodes);
			 
			      //var link =
			      vis.selectAll('pathlink')
				      .data(links.filter(function(d) {
								// links where target is in source.child list
								return d.source.child_ids.indexOf(d.target._id) > -1;
				      }))
				      .enter().append('svg:path')
				      .attr('class', 'link')
				      .attr('d', diagonal);
		 
						//var spouseLink = 
						vis.selectAll('pathlink')
				      .data(links.filter(function(d) {
								// links where target is in source.spouse list
								return d.source.spouse_ids.indexOf(d.target._id) > -1;
				      }))
				      .enter().append('svg:path')
				      .attr('class', 'link spouse')
				      .attr('stroke-dasharray', '4,4')
				      .attr('d', diagonal);
		 
			      var node = vis.selectAll('g.node')
				      .data(nodes)
				      .enter().append('svg:g')
				      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })
				      .attr('class', function(d) {
								if(d.gender === undefined) { return; }

								var classes = '';
								if(d.gender) {
									classes += (d.gender === 1) ? 'm' : 'f';
								}
								return classes;
							});
				
			      node.append('svg:circle').attr('r', 3.5);
			 
			      node.append('svg:text')
							.text(function(d) { return d.birth_name; })
							.attr('transform', function(d) {
								// rotate label
								return 'rotate(-45)translate(6,2)';
							});

          }
        };

				scope.$watch('person', drawTree, true);
			}
		};
	}]);