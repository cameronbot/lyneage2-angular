'use strict';

window.angular.module('ngl2.directives.tree', [])
	.directive('tree', ['Trees', '$rootScope', function (Trees, $rootScope) {
		return {
			restrict: 'A',
			scope: {
				person: '='
			},
			link: function (scope, elem, attrs) {
				scope.toggle = false;
				
				var d3 = window.d3;
				var width = 800, height = 400;

				var vis = d3.select(elem[0]).append('svg')
					.attr('width', width)
					.attr('height', height)
						.append('g');
				      //.attr('transform', 'translate(20, 120)'); // shift everything to accomodate diagonal labels
				 
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
							//.size([height*0.8,width*0.8]);
							.nodeSize([20,80]);

				var diagonal = d3.svg.diagonal()
							// change x and y (for the left to right tree)
							.projection(function(d) { return [d.y, d.x]; });

				var redraw = function(newValue, oldValue) {
					console.log("REDRAW");
          if (newValue) {
          	var node, nodes, links;

            // clear existing chart
            vis.remove();

            vis = d3.select('svg')
								.append('g')
					      // shift everything to accomodate diagonal labels
					      .attr('transform', 'translate(20, 50)');
				 
						// build node list
			      nodes = tree.nodes( Trees.descendancy( scope.person ));
			      links = tree.links(nodes);
			 
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
		 
			      node = vis.selectAll('g.node').data(nodes);
				
						node.enter().append('svg:g')
				      .attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })
				      .attr('class', function(d) {
								if(d.gender === undefined) { return; }

								var classes = '';
								if(d.gender) {
									classes += (d.gender === 1) ? 'm' : 'f';
								}
								return classes;
							})
							.on('click', function (d, i) {
								scope.clickedPersonId = d._id;
								console.log(scope.clickedPersonId, d._id, d.birth_name);
								var controls = $('.controls');
								var coords = d3.mouse(d3.select('#col-canvas')[0][0]);

								controls.show().css({ 'left': coords[0], 'top': coords[1] });
							});
					
						node.append('svg:circle').attr('r', 3.5);
			 
			      node.append('svg:text')
							.text(function(d) { return d.birth_name; })
							.attr('transform', function(d) {
								// rotate label
								return 'rotate(-45)translate(6,2)';
							});

						var g = d3.select('g'); // gbb = g[0][0].getBBox();
						g.attr('transform', 'translate(20, ' + height/2 + ')');

          }
        };

        //scope.$watch('Trees.redraw', redraw, true);
				scope.$watch('person', redraw, true);
			}
		};
	}]);