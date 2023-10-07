Feature: Table

  Scenario: Get Table by Id
    Given login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given sessions
      | _id                      | table                    | finished_at              |
      | 65215481436c37c64c78f916 | 6521548f436c37c64c78f917 |                          |
      | 65215481436c37c64c38f920 | 6521548f436c37c64c78f917 | 2023-10-07T12:53:00.943Z |
    Given tables
      | _id                      | title   |
      | 6521548f436c37c64c78f917 | Title 1 |

    When get table by id "6521548f436c37c64c78f917"
    Then table session id will be "65215481436c37c64c38f920"
