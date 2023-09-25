@ingredients
Feature: Ingredients
	Scenario: Get all menus
		When login as
			| id                       | username       | role |
			| 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
		Given menus
      | _id                      | title  | price | ingredients 																			|
      | 64c5485a510698e8c9e7bdc0 | Menu_1 | 100   | 65108ab9fc6b88fc8675700e,65108ac252a822bfd77730f2 |
			| 65108acc42fcb6893910736a | Menu_2 | 100   | 65108ab9fc6b88fc8675700e												  |
		And ingredients
			| _id 										 | title			  |
			| 65108ab9fc6b88fc8675700e | Ingredient_1 |
			| 65108ac252a822bfd77730f2 | Ingredient_2 |
		When get all ingredients
		Then should return status code 200
		And should ingredient at index 0 be
			| key   				| value          				   | type	  |
			| _id   				| 65108ab9fc6b88fc8675700e | string |
			| title 			  | Ingredient_1   				   | string |
			| menus_applied | 2 				   						 | number |
		And should ingredient at index 1 be
			| key  					| value          				   | type	  |
			| _id   				| 65108ac252a822bfd77730f2 | string |
			| title 			  | Ingredient_2   				   | string |
			| menus_applied | 1 				   						 | number |
