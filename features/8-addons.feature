@addons
Feature: Addons

  Scenario: Create a addon
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a addon
      | title  | price |
      | Addon1 | 22    |
    Then should return status code 201
    Then should addon appear in database

  Scenario: Get Addon By Id
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And addons
      | _id                      | title  | price |
      | 64f5f6b25c81011f9748ba46 | Addon2 | 69    |
    When get addon by id "64f5f6b25c81011f9748ba46"
    Then should return status code 200
    Then should response data be
      | _id                      | title  | price |
      | 64f5f6b25c81011f9748ba46 | Addon2 | 69    |

  Scenario: Delete addon
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And addons
      | _id                      | title  | price |
      | 64f5f6b25c81011f9748ba46 | Addon2 | 69    |
    When delete addon by id "64f5f6b25c81011f9748ba46"
    Then should return status code 204
    When get addon by id "64f5f6b25c81011f9748ba46"
    Then "deleted_at" field should not be null in response

  Scenario: Get All Addons With Status Active
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And addons
      | _id                      | title  | price | deleted_at               |
      | 64f87a87bf47f5c1e79a04db | Addon1 | 22    | 2023-08-30T12:27:43.559Z |
      | 64f5f6b25c81011f9748ba46 | Addon2 | 69    | 2023-08-30T12:27:43.559Z |
      | 64f87ae8f0ee4aa643f74fc3 | Addon3 | 12    |                          |
    When get all addons with status "active"
    Then should return status code 200
    Then response size should equal to 1

  Scenario: Get All Addons With Status All
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And addons
      | _id                      | title  | price | deleted_at               |
      | 64f87a87bf47f5c1e79a04db | Addon1 | 22    | 2023-08-30T12:27:43.559Z |
      | 64f5f6b25c81011f9748ba46 | Addon2 | 69    | 2023-08-30T12:27:43.559Z |
      | 64f87ae8f0ee4aa643f74fc3 | Addon3 | 12    |                          |
    When get all addons with status "all"
    Then should return status code 200
    Then response size should equal to 3

  Scenario: Update addon
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And addons
      | _id                      | title  | price | deleted_at |
      | 64f87a87bf47f5c1e79a04db | Addon1 | 22    |            |
    When update addon by id "64f87a87bf47f5c1e79a04db"
      | title  | price |
      | Addon1 | 999   |
    Then should return status code 200
    When get addon by id "64f87a87bf47f5c1e79a04db"
    Then should response data be
      | key        | value                    | type   |
      | _id        | 64f87a87bf47f5c1e79a04db | string |
      | title      | Addon1                   | string |
      | price      | 999                      | number |
      | deleted_at | null                     | null   |

