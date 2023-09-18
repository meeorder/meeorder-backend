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

  Scenario: Update Role
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And users
      | id                       | username | password | role |
      | 6505b9c900f367f6586cc20f | test     | pass     | 1    |
    When update user role
      | id                       | role     |
      | 6505b9c900f367f6586cc20f | employee |
    Then should return status code 204

  Scenario: Update role myself
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When update user role
      | id                       | role     |
      | 64ff1bbf76e1dfabe0337a1b | employee |
    Then should return status code 400

  Scenario: Update new username with corrected password
    Given users
      | _id                      | username | password | role | point |
      | 64f87576dced99c4e4e93468 | nath     | ixq      | 50   | 0     |
    When login with username and password
      | username | password |
      | nath     | ixq      |
    When update user info
      | newUsername | oldPassword |
      | vjump       | ixq         |
    Then should return status code 204

  Scenario: Update new username with incorrected password
    Given users
      | _id                      | username | password | role | point |
      | 64f87576dced99c4e4e93468 | nath     | ixq      | 50   | 0     |
    When login with username and password
      | username | password |
      | nath     | ixq      |
    When update user info
      | newUsername | oldPassword |
      | vjump       | xxx         |
    Then should return status code 400

  Scenario: Update new password with corrected password
    Given users
      | _id                      | username | password | role | point |
      | 64f87576dced99c4e4e93468 | nath     | ixq      | 50   | 0     |
    When login with username and password
      | username | password |
      | nath     | ixq      |
    When update user info
      | newPassword | oldPassword |
      | pass_word   | ixq         |
    Then should return status code 204

  Scenario: Update new password with incorrected password
    Given users
      | _id                      | username | password | role | point |
      | 64f87576dced99c4e4e93468 | nath     | ixq      | 50   | 0     |
    When login with username and password
      | username | password |
      | nath     | ixq      |
    When update user info
      | newPassword | oldPassword |
      | kkk         | xxx         |
    Then should return status code 400

