'use strict';

window.angular.module('ngl2.directives.tree', [])
	.directive('tree', ['Trees', '$rootScope', function (Trees, $rootScope) {
		return {
			restrict: 'A',
			transclude: true,
			scope: {
				add: '&',
				select: '&',
				root: '='
			},
			template: '' +
				'<div class="controls">' +
					'<div class="btn-group" style="position: relative; left: -50%;">' +
					  '<button ng-click="select({ _id: selectedId });hideControls()" type="button" class="btn btn-default"><i class="glyphicon glyphicon-user"></i></button>' +
					  '<button ng-click="add({ options: { create: \'child\', root: selectedId }});hideControls()" type="button" class="btn btn-default"><i class="glyphicon glyphicon-link"></i> child</button>' +
					  '<button ng-click="add({ options: { create: \'spouse\', root: selectedId }});hideControls()" type="button" class="btn btn-default"><i class="glyphicon glyphicon-link"></i> spouse</button>' +
					  '<button type="button" class="btn btn-default" ng-click="hideControls()"><i class="glyphicon glyphicon-remove"></i></button>' +
					'</div>' +
				'</div>',
			link: function (scope, elem, attrs) {
				scope.hideControls = function() {
					$('.controls').hide();
				};

				console.log(scope, elem, attrs);


				var d3 = window.d3;
				var width = 800, height = 400, radius = 200;
				var vis;
				var svg = d3.select(elem[0]).append('svg');
				// var vis = d3.select(elem[0]).append('svg')
				// 	.attr('width', width)
				// 	.attr('height', height)
				// 		.append('g');
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
							//.nodeSize([20,80])
							.size([180, radius*2])
							.separation(function(a, b) { return (a.parent == b.parent ? 1 : 2) / a.depth; });

				// var diagonal = d3.svg.diagonal()
				// 			// change x and y (for the left to right tree)
				// 			.projection(function(d) { return [d.y, d.x]; });

				var diagonal = d3.svg.diagonal.radial()
					.projection(function(d) { return [d.y, Math.PI/2 + d.x / 180 * Math.PI]; });

				var redraw = function(newValue, oldValue) {
          if (newValue) {
          	var node, nodes, links;

            // clear existing chart
            if (vis) {
            	vis.remove();
            }

            vis = svg.append('g')
					      // shift everything to accomodate diagonal labels
					      //.attr('transform', 'translate(20, 50)');
					      .attr("transform", "translate(" + 600 + "," + 20 + ")");
						// build node list
			      nodes = tree.nodes( Trees.descendancy( scope.root ));
			      links = tree.links(nodes);

			      vis.selectAll('pathlink')
				      .data(links.filter(function(d) {
								// links where target is in source.child list
								return d.source.child_ids.indexOf(d.target._id) > -1;
				      }))
				      .enter().append('path')
				      .attr('class', 'link')
				      .attr('d', diagonal);

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
							.attr("transform", function(d) { return "rotate(" + (d.x) + ")translate(" + d.y + ")"; })
				      //.attr('transform', function(d) { return 'translate(' + d.y + ',' + d.x + ')'; })
				      .attr('class', function(d) {
								var classes = '';

								classes += ( d._id === 'unknown' ) ? 'placeholder ' : '';
								classes += ( typeof d.gender === 'number' ) ? (( d.gender === 1) ? 'm' : 'f') : '';

								return classes;
							})
							.on('click', function (d, i) {
								// skip action on placeholder entities
								if (d._id === 'unknown') {
									return;
								}

								scope.selectedId = d._id;

								console.log(scope.selectedId, d._id, d.birth_name);

								var coords = d3.mouse(d3.select('#col-canvas')[0][0]);
								$('.controls').show().css({ 'left': coords[0], 'top': coords[1] });
							});

						node.append('svg:circle').attr('r', 3.5);

			      node.append('svg:text')
							.text(function(d) { return d.birth_name; })
							.attr('transform', function(d) {
								// rotate label
								return 'rotate(-45)translate(6,2)';
							});

						var g = d3.select('g'), gbb = g[0][0].getBBox();
						svg.attr('height', gbb.height + 20);

          }
        };

				scope.$watch('root', redraw, true);
			}
		};
	}]);