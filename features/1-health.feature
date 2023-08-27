Feature: Health Test

  Scenario: Get Health
    When called health check
    Then should return status code 200
    And should response data be
      | key | value | type   |
      | msg | pong  | string |