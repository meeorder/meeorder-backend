@dashboard
Feature: Dashboard

    Scenario: Get amount or registered users
        Given login as
            | id                       | username       | role |
            | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
        And users
            | id                       | username   | password | role | point | create_at                | delete_at |
            | 64ff1bbf76e1dfabe0337a1b | customer_1 | 1234     | 1    | 0     | 2023-08-15T12:27:43.559Z | null      |
            | 64ff1bbf76e1dfabe0337a1c | customer_2 | 12345    | 1    | 0     | 2023-08-16T12:27:43.559Z | null      |
            | 64ff1bbf76e1dfabe0337a1d | customer_3 | 12346    | 1    | 0     | 2023-08-17T12:27:43.559Z | null      |
            | 64ff1bbf76e1dfabe0337a1e | customer_4 | 12347    | 1    | 0     | 2023-08-18T12:27:43.559Z | null      |
        When Get dashboard with date 1692316800000
        Then should return status code 200
        Then should get dashboard with total 4, old 3, new 1
