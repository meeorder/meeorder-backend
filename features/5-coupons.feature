@coupon
Feature: Coupons
  Scenario: Create a coupon
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a coupon
      | title    | discount | required_points | quota |
      | MyCoupon | 100      | 100             | 1     |
    Then should return status code 201
    Then should coupon appear in database

  Scenario: Get coupon by id
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And coupons
      | _id                      | title   | discount | required_point | quota |
      | 64c5485a510698e8c9e7bdc0 | Coupon1 | 22       | 100            | 1     |
      | 64f34297ad045cb1f407c478 | Coupon2 | 11       | 200            | 1     |
    When get coupon by id "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should response data be
      | key   | value                    | type   |
      | _id   | 64c5485a510698e8c9e7bdc0 | string |
      | title | Coupon1                  | string |

  Scenario: Get coupon by id (with required_menus)
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And menus
      | _id                      | title   | price |
      | 650e27bd338ff1ad3089c37b | Menu1   | 100   |
      | 650e27cc7261ef1da04db59b | Menu2   | 200   |
    And coupons
      | _id                      | title   | discount | required_point | required_menus                                    | quota |
      | 64c5485a510698e8c9e7bdc0 | Coupon1 | 22       | 100            | 650e27bd338ff1ad3089c37b,650e27cc7261ef1da04db59b | 1     |
    When get coupon by id "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should required_menus at index 0 be
      | key   | value                    | type   |
      | _id   | 650e27bd338ff1ad3089c37b | string |
      | title | Menu1                    | string |
    Then should required_menus at index 1 be
      | key   | value                    | type   |
      | _id   | 650e27cc7261ef1da04db59b | string |
      | title | Menu2                    | string |

  Scenario: Get all coupons
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And coupons
      | _id                      | title   | discount | required_point | quota |
      | 64f09e7476b02c5ea04be8ea | Coupon1 | 100      | 100            | 1     |
      | 64f09e7476b02c5ea04be8eb | Coupon2 | 200      | 200            | 1     |
    When get all coupons
    Then should return status code 200
    Then should response be length 2

  Scenario: Get all coupons (with required_menus)
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And menus
      | _id                      | title   | price |
      | 650e27bd338ff1ad3089c37b | Menu1   | 100   |
      | 650e27cc7261ef1da04db59b | Menu2   | 200   |
    And coupons
      | _id                      | title   | discount | required_point | required_menus                                    | quota |
      | 64f09e7476b02c5ea04be8ea | Coupon1 | 100      | 100            | 650e27bd338ff1ad3089c37b,650e27cc7261ef1da04db59b | 1     |
    When get all coupons
    Then should return status code 200
    Then should required_menus at index [0][0] be
      | key   | value                    | type   |
      | _id   | 650e27bd338ff1ad3089c37b | string |
      | title | Menu1                    | string |
    Then should required_menus at index [0][1] be
      | key   | value                    | type   |
      | _id   | 650e27cc7261ef1da04db59b | string |
      | title | Menu2                    | string |

  Scenario: Get all coupons by session
    Given login as
      | id                       | username          | role |
      | 64fc66f62435f7fb964ac058 | meeorder_customer | 1    |
    And coupons
      | _id                      | title   | discount | required_point | quota |
      | 64f09e7476b02c5ea04be8ea | Coupon1 | 100      | 100            | 1     |
      | 64f09e7476b02c5ea04be8eb | Coupon2 | 200      | 200            | 1     |
    And sessions
      | _id                      | finished_at | table                    | user                     |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 | 64fc66f62435f7fb964ac058 |
    And users
      | _id                      | username          | password | point |
      | 64fc66f62435f7fb964ac058 | meeorder_customer | hole     | 150   |

    When get all coupons by session "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    And coupon response id "64f09e7476b02c5ea04be8ea" redeemable should be "true"
    And coupon response id "64f09e7476b02c5ea04be8eb" redeemable should be "false"
