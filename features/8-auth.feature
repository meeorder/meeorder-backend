@auth
Feature: Authentication
  Background: User
    Given users
      | _id                      | username | password | role | point |
      | 64f87576dced99c4e4e93468 | nath     | ixq      | 50   | 0     |

  Scenario: User can login
    When login with username "nath" and password "ixq"
    Then should return status code 200

  Scenario: User can't login when password is wrong
    When login with username "nath" and password "wrong"
    Then should return status code 401

  Scenario: User can't login when username is wrong
    When login with username "wrong" and password "ixq"
    Then should return status code 401