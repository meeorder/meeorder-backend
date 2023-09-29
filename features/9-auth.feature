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

  Scenario: Create username with max length more than 32
    When register with username "123213123121231231231231231231231231231231231231231123132131231231231312321312313123213123123123213123123123123123113121231231231231231231231231231123123123123122312312312231231231231231312" and password "123"
    Then should return status code 400

  Scenario: Create username with min length less than 3
    When register with username "12" and password "123"
    Then should return status code 400

  Scenario: Create username with special character
    When register with username "nath!" and password "123"
    Then should return status code 400