@users
Feature: Users

  Scenario: Create User (Correct Role)
    When create a user
      | username   | password   | role     |
      | meeorder01 | meeorder01 | employee |
    Then should return status code 201
    And should response data be
      | key      | value      | type   |
      | username | meeorder01 | string |
      | role     | 25         | number |

  Scenario: Create User (Incorrect Role)
    When create a user
      | username   | password   | role |
      | meeorder01 | meeorder01 | test |
    Then should return status code 400
