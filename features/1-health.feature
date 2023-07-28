Feature: Health Test

  Scenario: Get Health
    Given a health
    When called health check
    Then should return status code 200
    And should appear "createdAt" in response