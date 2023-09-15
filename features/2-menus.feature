@menu
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

  Scenario: Get menus
    Given menus
      | _id                      | title | description | price | category                 | published_at             | ingredients                                       |
      | 6504b0f69a22c9b19517a35c | Menu1 | Menu1       | 1000  | 003d09009a22c9b19517a35d | 2023-09-15T19:31:41.731Z | 6504b1479a22c9b19517a35e                          |
      | 6504b0f69a22c9b19517a35d | Menu1 | Menu1       | 1000  | 003d09009a22c9b19517a35d | 2023-09-15T19:31:41.731Z | 6504b1479a22c9b19517a35f                          |
      | 6504b0f69a22c9b19517a35e | Menu1 | Menu1       | 1000  | 003d09009a22c9b19517a35d | 2023-09-15T19:31:41.731Z | 6504b1479a22c9b19517a35e,6504b1479a22c9b19517a35f |
    And categories
      | _id                      | title     | menus                                                                      |
      | 003d09009a22c9b19517a35d | Category1 | 6504b0f69a22c9b19517a35c,6504b0f69a22c9b19517a35d,6504b0f69a22c9b19517a35e |
    And ingredients
      | _id                      | title | available |
      | 6504b1479a22c9b19517a35e | E     | 1         |
      | 6504b1479a22c9b19517a35f | F     | 0         |
    When get all menus with status "all"
    Then should return status code 200
    And should menu id "6504b0f69a22c9b19517a35c" can_order to be "true"
    And should menu id "6504b0f69a22c9b19517a35d" can_order to be "false"
    And should menu id "6504b0f69a22c9b19517a35e" can_order to be "false"


