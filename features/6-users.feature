@users
Feature: Users

  Scenario: Create User (Correct Role)
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a user
      | username   | password   | role     |
      | meeorder01 | meeorder01 | employee |
    Then should return status code 201
    And should response data be
      | key      | value      | type   |
      | username | meeorder01 | string |
      | role     | 25         | number |

  Scenario: Create User (Incorrect Role)
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a user
      | username   | password   | role |
      | meeorder01 | meeorder01 | test |
    Then should return status code 400

  Scenario: Create duplicate user
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And users
      | username   | password   | role | point |
      | meeorder01 | meeorder01 | 50   | 100   |
    When create a user
      | username   | password | role     |
      | meeorder01 | 1q2w3e4r | employee |
    Then should return status code 400

  Scenario: Create username with max length more than 32
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a user
      | username                                                                                                                                                                                      | password | role     |
      | 123213123121231231231231231231231231231231231231231123132131231231231312321312313123213123123123213123123123123123113121231231231231231231231231231123123123123122312312312231231231231231312 | 123      | employee |
    Then should return status code 400

  Scenario: Create username with min length less than 3
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a user
      | username | password | role     |
      | 12       | 1q2w3e4r | employee |
    Then should return status code 400

  Scenario: Create username with special character
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a user
      | username    | password | role     |
      | !meeorder01 | 1q2w3e4r | employee |
    Then should return status code 400