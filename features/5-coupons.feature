Feature: Coupons
	Scenario: Create a coupon
		When create coupon
			| title 	 | required_menus							| price | required_point |
			| MyCoupon | [64ef35bde6c66d526b0981ff] | 100 	| 100 					 |
		Then should return status code 201
		Then should coupon appear in database

		Scenario: Get coupon by id
		Given coupon
			| _id											 | title 		| price | required_point |
			| 64c5485a510698e8c9e7bdc0 | Coupon1	| 22		| 100						 |
			| 64c5485a510698e8c9e7bdc1 | Coupon2	| 11		| 200						 |
		When get coupon by id 64c5485a510698e8c9e7bdc0
		Then should return status code 200
		Then should response response data be
			| key 					| value 										| type   |
			| _id 					| 64c5485a510698e8c9e7bdc0 	| string |
			|	title 				| Coupon1 								  | string |

		Scenario: Get all coupons by owner
		Given coupon
			| _id											 | title 		| price | required_point |
			| 64c5485a510698e8c9e7bdc0 | Coupon1	| 100		| 100						 |
			| 64c5485a510698e8c9e7bdc1 | Coupon2	| 100		| 100						 |
		When get all coupons by owner
		Then should return status code 200
		Then should response response data be
			| key 					| value 										| type   |
			| _id 					| 64c5485a510698e8c9e7bdc0 	| string |
			|	title 				| Coupon1 								  | string |
			| _id 					| 64c5485a510698e8c9e7bdc1 	| string |
			|	title 				| Coupon2 								  | string |