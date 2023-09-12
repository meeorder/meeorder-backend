@session
Feature: Session
  Background:
    Given tables
      | _id                      | title |
      | 64f55c53561fa6a99fc45b29 | 1     |
      | 64f55c65561fa6a99fc45b2a | 2     |

  Scenario: Create a session
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create session
      | table                    |
      | 64f55c53561fa6a99fc45b29 |
    Then should return status code 201
    Then should session appear in database

  Scenario: Get session by table
    Given login as
      | id                       | username         | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_cashier | 50   |
    And sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdb5 | 2016-01-01  | 64f55c53561fa6a99fc45b29 |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 |
    When get session by table "64f55c53561fa6a99fc45b29"
    Then should return status code 200
    Then should response data be
      | key         | value                    | type   |
      | _id         | 64c5485a510698e8c9e7bdc0 | string |
      | finished_at |                          | null   |

  Scenario: Finish session
    Given login as
      | id                       | username         | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_cashier | 50   |
    And sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdb5 |             | 64f55c53561fa6a99fc45b29 |
    When finish session "64c5485a510698e8c9e7bdb5"
    Then should return status code 204
    Then should session "64c5485a510698e8c9e7bdb5" update to finished

  Scenario: Get all sessions
    Given login as
      | id                       | username         | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_cashier | 50   |
    And sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdb5 | 2016-01-01  | 64f55c53561fa6a99fc45b29 |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 |
    When get all sessions
    Then should return status code 200
    Then should not finished session appear

  Scenario: Get session
    Given login as
      | id                       | username         | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_cashier | 50   |
    And sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 |
    When get session "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should response data be
      | key         | value                    | type   |
      | _id         | 64c5485a510698e8c9e7bdc0 | string |
      | finished_at |                          | null   |
