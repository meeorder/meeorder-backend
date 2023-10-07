@session
Feature: Orders
  Background:
    Given tables
      | _id                      | title |
      | 64f55c53561fa6a99fc45b29 | 1     |
      | 64f55c65561fa6a99fc45b2a | 2     |
    Given sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdb5 | 2016-01-01  | 64f55c53561fa6a99fc45b29 |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 |
      | 64f57944349d90ff3cf574d9 |             | 64f55c65561fa6a99fc45b2a |


  Scenario: Create a order
    Given orders
      | _id                      | session                  | menu                     | addon                    | additional_info |
      | 64f5707f6d126db5cc098a36 | 64c5485a510698e8c9e7bdc0 | 000000014aaec6eb813e8bc0 | 000000014aaec6eb813e8bc0 |                 |
    When create order
      | session                  | menu                     | addon                    |
      | 64c5485a510698e8c9e7bdc0 | 000000014aaec6eb813e8bc0 | 000000014aaec6eb813e8bc0 |
    Then should return status code 201

  Scenario: Cancel order with reason lack of addons
    Given login as
      | id                       | username          | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_employee | 25   |
    And addons
      | _id                      | title   | price | available |
      | 64fb0605ab4bb1fde967f3b0 | addon_1 | 100   | true      |
      | 64fb0605ab4bb1fde967f3b1 | addon_2 | 200   | true      |
    And orders
      | _id                      | session                  | menu                     | addons                   | additional_info |
      | 64fb0700ab4bb1fde967f3b1 | 64fb0700ab4bb1fde967e3b1 | 64fb0952ab4bb1fde967f3b3 | 64fb0605ab4bb1fde967f3b0 | Test Menu       |
    When cancel order "64fb0700ab4bb1fde967f3b1"
      | reason | addons                   |
      | 1      | 64fb0605ab4bb1fde967f3b0 |
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" should be cancelled
    And addon "64fb0605ab4bb1fde967f3b0" should be disabled
    And order "64fb0700ab4bb1fde967f3b1" status should be "CANCELLED"

  Scenario: Cancel order with reason lack of ingredients
    Given login as
      | id                       | username          | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_employee | 25   |
    And ingredients
      | _id                      | title | available |
      | 6504aeab9a22c9b19517a35b | Moo   | 1         |
      | 6504aeab9a22c9b19517a35c | Kai   | 1         |
    And orders
      | _id                      | session                  | menu                     | addons                   | additional_info |
      | 64fb0700ab4bb1fde967f3b1 | 64fb0700ab4bb1fde967e3b1 | 64fb0952ab4bb1fde967f3b3 | 64fb0605ab4bb1fde967f3b0 | Test Menu       |
    When cancel order "64fb0700ab4bb1fde967f3b1"
      | reasons | ingredients              |
      | 1       | 6504aeab9a22c9b19517a35b |
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" should be cancelled
    And ingredient "6504aeab9a22c9b19517a35b" should be disabled
    And order "64fb0700ab4bb1fde967f3b1" status should be "CANCELLED"

  Scenario: Delete order
    Given login as
      | id                       | username          | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_employee | 25   |
    And orders
      | _id                      | session                  | menu                     | addons                   | additional_info |
      | 64fb0700ab4bb1fde967f3b1 | 64fb0700ab4bb1fde967e3b1 | 64fb0952ab4bb1fde967f3b3 | 64fb0605ab4bb1fde967f3b0 | Test Menu       |
    When delete order "64fb0700ab4bb1fde967f3b1"
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" should be deleted

  Scenario: Test Update Order status
    Given login as
      | id                       | username          | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_employee | 25   |
    And orders
      | _id                      | session                  | menu                     | addons                   | additional_info |
      | 64fb0700ab4bb1fde967f3b1 | 64fb0700ab4bb1fde967e3b1 | 64fb0952ab4bb1fde967f3b3 | 64fb0605ab4bb1fde967f3b0 | Test Menu       |
    When update order "64fb0700ab4bb1fde967f3b1" to in queue
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" status should be "IN_QUEUE"
    When update order "64fb0700ab4bb1fde967f3b1" to preparing
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" status should be "PREPARING"
    When update order "64fb0700ab4bb1fde967f3b1" to ready to serve
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" status should be "READY_TO_SERVE"
    When update order "64fb0700ab4bb1fde967f3b1" to done
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" status should be "DONE"

  Scenario: Cancel order and change status back to IN_QUEUE
    Given login as
      | id                       | username          | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_employee | 25   |
    And addons
      | _id                      | title   | price | available |
      | 64fb0605ab4bb1fde967f3b0 | addon_1 | 100   | true      |
      | 64fb0605ab4bb1fde967f3b1 | addon_2 | 200   | true      |
    And orders
      | _id                      | session                  | menu                     | addons                   | additional_info |
      | 64fb0700ab4bb1fde967f3b1 | 64fb0700ab4bb1fde967e3b1 | 64fb0952ab4bb1fde967f3b3 | 64fb0605ab4bb1fde967f3b0 | Test Menu       |
    When cancel order "64fb0700ab4bb1fde967f3b1"
      | reason | addons                   |
      | 1      | 64fb0605ab4bb1fde967f3b0 |
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" should be cancelled
    And addon "64fb0605ab4bb1fde967f3b0" should be disabled
    And order "64fb0700ab4bb1fde967f3b1" status should be "CANCELLED"
    When update order "64fb0700ab4bb1fde967f3b1" to in queue
    Then should return status code 204
    And order "64fb0700ab4bb1fde967f3b1" status should be "IN_QUEUE"
    And order "64fb0700ab4bb1fde967f3b1" cancel schama should be null