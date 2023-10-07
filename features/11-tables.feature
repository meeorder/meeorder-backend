@tables
Feature: Tables
  Background:
    Given tables
      | _id                      | title | created_at               |
      | 64f55c53561fa6a99fc45b29 | 1     | 2023-10-03T19:36:57.251Z |
    And sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdb5 | 2016-01-01  | 64f55c53561fa6a99fc45b29 |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 |
      | 64f57944349d90ff3cf574d9 |             | 64f55c65561fa6a99fc45b2a |
    And menus
      | _id                      | title  | price | category                 | addons                                            |
      | 650b3e13e57d82a5170a5b2a | Menu_1 | 10    | 64fc6c5759b4b66f30d67843 | 64f5f6b25c81011f9748ba46,64fc724bbb111885fcaf555a |
      | 650b3e1d260e9aec3203f548 | Menu_2 | 20    | 64fc6c5759b4b66f30d67843 |                                                   |
      | 650b3e2267c946b867f5d0f8 | Menu_3 | 30    | 64fc75f0808cb60b8ab9f906 | 64f5f6b25c81011f9748ba46                          |
      | 650b3e2a668b84ca2f65f8f3 | Menu_4 | 40    |                          |                                                   |
    And addons
      | _id                      | title  | price |
      | 64f5f6b25c81011f9748ba46 | Yesss  | 55    |
      | 64fc724bbb111885fcaf555a | Nooooo | 100   |
    And coupons
      | _id                      | title   | discount | required_point | quota |
      | 64f09e7476b02c5ea04be8ea | Coupon1 | 100      | 0              | 1     |
    And orders
      | _id                      | session                  | menu                     | additional_info |
      | 64fb0700ab4bb1fde967f3b1 | 64c5485a510698e8c9e7bdc0 | 650b3e2a668b84ca2f65f8f3 | Test Menu       |

  Scenario: When get all table
    When login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And get all tables
    Then should return status code 200
    And table should have session and session_create_at
    And table total price should be 40
    And table allOrdersCount should be 1
    And table unfinishOrdersCount should be 1
    When update order "64fb0700ab4bb1fde967f3b1" to done
    Then should return status code 204
    When get all tables
    And table unfinishOrdersCount should be 0
    When create order
      | session                  | menu                     | addon                    |
      | 64c5485a510698e8c9e7bdc0 | 650b3e13e57d82a5170a5b2a | 64fc724bbb111885fcaf555a |
    Then should return status code 201
    When get all tables
    Then should return status code 200
    And table allOrdersCount should be 2
    And table unfinishOrdersCount should be 1
    And table total price should be 150
    When apply user to session "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    When session "64c5485a510698e8c9e7bdc0" use coupon "64f09e7476b02c5ea04be8ea"
    Then should return status code 204
    Then session "64c5485a510698e8c9e7bdc0" should have coupon
    When get all tables
    Then should return status code 200
    And table total price should be 50