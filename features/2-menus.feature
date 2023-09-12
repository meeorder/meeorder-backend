Feature: Menu Test
  Scenario: Create Menu, Publish, Get Menu and Delete Menu
    Given a menu
    And login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    When create a menu
    And publish this menu
    Then should return status code 200
    And should return a same menu id when get by the same id
    And "published_date" field should not be null in response
    When delete this menu
    And get this menu by the same id
    Then "deleted_date" field should not be null in response



