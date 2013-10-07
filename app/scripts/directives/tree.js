'use strict';

window.angular.module('ngl2.directives.tree', [])
	.directive('tree', ['Trees', '$rootScope', function (Trees, $rootScope) {
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
			 
				scope.$watch('person', function(newValue, oldValue) {
          if (newValue) {
            console.log("I see a data change!");

            vis.remove();

            vis = d3.select(elem[0])
				      .append('svg:g')
				      .attr('transform', 'translate(20, 50)'); // shift everything to accomodate diagonal labels
				 
            nodeData = angular.copy(scope.person);

						// build node list
						nodeData.children = [];
						nodeData.spouses = [];
						for (var i in nodeData.spouse_ids) {
							var id = nodeData.spouse_ids[i],
									spouse = angular.copy(_people[id]),
									children = [];

							for (var j in spouse.child_ids) {
								var childId = spouse.child_ids[j];

								if (nodeData.child_ids.indexOf(childId) > -1) {
									children.push(angular.copy(_people[childId]));
								}
							}

							if(children.length) {
								spouse.children = children;
							}

							nodeData.spouses.push(spouse);
						}
						// TODO: intersect spouse children to nest under this spouse
						// for(var i in nodeData.child_ids) {
						// 	var id = nodeData.child_ids[i];

						// 	nodeData.children.push(angular.copy(_people[id]));
						// }

			      
			      
			 
			      
			      var nodes = tree.nodes(nodeData);
			      var links = tree.links(nodes);
			 
			      var link = vis.selectAll('pathlink')
				      .data(links.filter(function(d) {
								// links where target is in source.child list
								return d.source.child_ids.indexOf(d.target._id) > -1;
				      }))
				      .enter().append('svg:path')
				      .attr('class', 'link')
				      .attr('d', diagonal);
		 
						var spouseLink = vis.selectAll('pathlink')
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
			 
			      // place the name atribute left or right depending if children
			      node.append('svg:text')
			      	//.attr('text-anchor', function(d) { return d.children ? 'end' : 'start'; })
				      .attr('transform', function(d) {
								return 'rotate(-45)translate(6,2)';
							})
			      	.text(function(d) { return d.birth_name; });

          }
        }, true);
			}
		};
	}]);