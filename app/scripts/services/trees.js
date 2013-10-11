'use strict';

window.angular.module('ngl2.services.trees', [])
	.factory('Trees', ['$resource', '$rootScope', '$location', 'API_ROOT', 'Auth', function ($resource, $rootScope, $location, API_ROOT, Auth) {
		var _ = window._;
		
		var currentTree;
		var people = {};

		var TreeService = {};

		if (!Auth.token()) {
			$location.path('/');
		}

		/*
			creates a descendancy tree for a given person formatted for consumption by d3
			by walking through person's spouses and children as deeply as possible, building
			a nested json tree in the process 
		 */
		TreeService.descendancy = function (person) {
			// configure api object property names
			var spouseIds = 'spouse_ids';
			var childIds = 'child_ids';
			//var parentIds = 'parent_ids';

			var root = angular.copy(person),
				id, spouse, children,
				i = 0, j = 0;
			
			root.children = [];
			root.spouses = [];

			// loop over spouses
			for ( i in root[spouseIds] ) {
				id = root[spouseIds][i];
				spouse = angular.copy( people[id] );
				children = [];

				// find children of spouse and person (intersection)
				for ( j in spouse[childIds] ) {
					id = spouse[childIds][j];

					if ( root[childIds].indexOf( id ) > -1 ) {
						// recurse here
						// children.push( angular.copy(people[id]) );
						children.push( TreeService.descendancy( people[id] ));
					}
				}

				if( children.length ) {
					spouse.children = children;
				}

				root.spouses.push(spouse);
			}

			return root;
		};

		function buildIndex() {
			var i = 0,
					index = [],
					person, temp;

			for(i in people) {
				person = people[i];

				temp = {
					_id: person._id,
					birth_name: person.birth_name,
					dob: {
						m: person.dob_m,
						d: person.dob_d,
						y: person.dob_y
					},
					dod: {
						m: person.dod_m,
						d: person.dod_d,
						y: person.dod_y
					}
				};

				index.push(temp);
			}

			return index;
		}

		TreeService.currentTree = currentTree;
		TreeService.redraw = 0;

		TreeService.reset = function () {
			currentTree = undefined;
			people = {};
		};

		TreeService.getPeople = function () {
			return people;
		};
			
		TreeService.getPerson = function (id) {
			return people[id];
		};

		TreeService.deletePerson = function (id) {
			delete people[id];
			return people;
		};

		TreeService.updateTree = function (response) {
			currentTree = response.tree;
		};

		TreeService.updatePeople = function (modified, deleted) {
			var i = 0,
					person;

			TreeService.redraw++;

			for (i in modified) {
				person = modified[i];
				people[person._id] = person;
			}

			if (deleted) {
				// ensure array
				deleted = [].concat(deleted);
				for (i in deleted) {
					person = deleted[i];
					delete people[person._id];
				}
			}

			$rootScope._peopleIndex = buildIndex();
			return people;
		};

		TreeService.resource = $resource(API_ROOT + '/trees/:treeId',
			{
				'auth_token': Auth.token()
			},
			{
				update: { method: 'PUT'},
				getData: {
					method: 'GET',
					isArray: false,
				}
			});

		return TreeService;
	}]);