@dashboard
Feature: Dashboard
  Scenario: Get Customer Report
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given users
      | _id                      | username | password | created_at       | deleted_at |
      | 64f87576dced99c4e4e93468 | user1    | pass1    | 2023-09-14 10:00 |            |
      | 6520abc6fff4af6d086458df | user2    | pass2    | 2023-09-14 11:00 |            |
      | 6520a88a6acca5dd3b409c9f | user3    | pass3    | 2023-09-15 10:00 |            |
      | 6a2b0b7b6a6c2a5e4b4b4b4b | user4    | pass4    | 2023-09-16 10:00 | 2023-09-16 |
    When get customer report before 1694696400
    Then should return status code 200
    And should response data be
      | total_user | old_user | new_user |
      | 3          | 1        | 2        |

  Scenario: Get Customer Report (Given date before minimum created_at)
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given users
      | _id                      | username | password | created_at       | deleted_at |
      | 64f87576dced99c4e4e93468 | user1    | pass1    | 2023-09-14 10:00 |            |
      | 6520abc6fff4af6d086458df | user2    | pass2    | 2023-09-14 11:00 |            |
      | 6520a88a6acca5dd3b409c9f | user3    | pass3    | 2023-09-15 10:00 |            |
      | 6a2b0b7b6a6c2a5e4b4b4b4b | user4    | pass4    | 2023-09-16 10:00 | 2023-09-16 |
    When get customer report before 1631624400
    Then should return status code 200
    And should response data be
      | total_user | old_user | new_user |
      | 4          | 0        | 4        |

  Scenario: Get Income Report
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given receipts
      | _id                      | total_price | discount_price | created_at       | deleted_at |
      | 6520aeaf596f2b6081e7a33d | 100         | 10             | 2023-09-14 10:00 |            |
      | 6520aec8fc21004e2c8bd9d6 | 200         | 20             | 2023-09-15 11:00 |            |
      | 6520aeeb92ba27d6eaab2999 | 999         | 99             | 2023-09-15 12:00 |            |
      | 6520aed555f7fc6aa48febc8 | 300         | 30             | 2023-09-16 10:00 | 2023-09-16 |
    When get income report from 1694653200 to 1694777400
    Then should return status code 200
    And should response data be
      | total_price | discount_price | total_income |
      | 300         | 30             | 270          |

  Scenario: Get Income Report (Out of range)
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given receipts
      | _id                      | total_price | discount_price | created_at       | deleted_at |
      | 6520aeaf596f2b6081e7a33d | 100         | 10             | 2023-09-14 10:00 |            |
      | 6520aec8fc21004e2c8bd9d6 | 200         | 20             | 2023-09-15 11:00 |            |
      | 6520aeeb92ba27d6eaab2999 | 999         | 99             | 2023-09-15 12:00 |            |
      | 6520aed555f7fc6aa48febc8 | 300         | 30             | 2023-09-16 10:00 | 2023-09-16 |
    When get income report from 1663241400 to 1663500600
    Then should return status code 200
    And should response data be
      | total_price | discount_price | total_income |
      | 0           | 0              | 0            |