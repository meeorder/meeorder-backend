@menus
@menu
Feature: Menus
  Scenario: Create a menu
    When login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    And create a menu
      | title | price |
      | menu1 | 100   |
    Then should return status code 201
    Then should menu appear in database

  Scenario: Get menu by id (No category & addon)
    When login as
        | id                       | username       | role |
        | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given menus
      | _id                      | title  | price |
      | 64c5485a510698e8c9e7bdc0 | Menu_1 | 100   |
    When get menu by id "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should response data be
      | key      | value                    | type   |
      | _id      | 64c5485a510698e8c9e7bdc0 | string |
      | title    | Menu_1                   | string |
      | price    | 100                      | number |
      | addons   |                          | array  |
    Then should category data be
      | key      | value                    | type   |
      | _id      | 64ef35bbe6c66d526b0981f0 | string |
      | title    | Others                   | string |
      | menus    | 64c5485a510698e8c9e7bdc0 | array  |


  Scenario: Get menu by id (With category, no addon)
    When login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given categories
      | _id                      | title  |
      | 64fc6c5759b4b66f30d67843 | ปูไทย   |
    Given menus
      | _id                      | title  | price | category                 |
      | 64c5485a510698e8c9e7bdc0 | Menu_1 | 100   | 64fc6c5759b4b66f30d67843 |
    When get menu by id "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should response data be
      | key      | value                    | type   |
      | _id      | 64c5485a510698e8c9e7bdc0 | string |
      | title    | Menu_1                   | string |
      | price    | 100                      | number |
      | addons   |                          | array  |
    Then should category data be
      | key      | value                    | type   |
      | _id      | 64fc6c5759b4b66f30d67843 | string |
      | title    | ปูไทย                     | string |
      | menus    | 64c5485a510698e8c9e7bdc0 | array  |

  Scenario: Get menu by id (With category & addon)
    When login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given categories
      | _id                      | title  |
      | 64fc6c5759b4b66f30d67843 | ปูไทย   |
    Given addons
      | _id                      | title  | price |
      | 64f5f6b25c81011f9748ba46 | Yesss  | 55    |
      | 64fc724bbb111885fcaf555a | Nooooo | 100   |
    Given menus
      | _id                      | title  | price | category                 | addons                                            |
      | 64c5485a510698e8c9e7bdc0 | Menu_1 | 100   | 64fc6c5759b4b66f30d67843 | 64f5f6b25c81011f9748ba46,64fc724bbb111885fcaf555a |
    When get menu by id "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should addons data at index 0 be
      | key     | value                    | type   |
      | _id     | 64f5f6b25c81011f9748ba46 | string |
      | title   | Yesss                    | string |
      | price   | 55                       | number |
    Then should addons data at index 1 be
      | key     | value                    | type   |
      | _id     | 64fc724bbb111885fcaf555a | string |
      | title   | Nooooo                   | string |
      | price   | 100                      | number |

  Scenario: Get menu by id (With ingredients)
    When login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
    Given menus
      | _id                      | title  | price | ingredients                                       |
      | 64c5485a510698e8c9e7bdc0 | Menu_1 | 100   | 6511318ac1dda7d2d846eb15,651131a2e048924f426da594 |
      | 64c5485a510698e8c9e7bdc1 | Menu_2 | 200 |  |
    And ingredients
      | _id                      | title |
      | 6511318ac1dda7d2d846eb15 | bbbbb |
      | 651131a2e048924f426da594 | aaaaa |
    When get menu by id "64c5485a510698e8c9e7bdc0"
    Then should return status code 200
    Then should response data be
      | key   | value                    | type   |
      | _id   | 64c5485a510698e8c9e7bdc0 | string |
      | title | Menu_1                   | string |
      | ingredients | 6511318ac1dda7d2d846eb15,651131a2e048924f426da594 | array  |
    When get menu by id "64c5485a510698e8c9e7bdc1"
    Then should return status code 200
    Then should response data be
      | key         | value                    | type   |
      | _id         | 64c5485a510698e8c9e7bdc1 | string |
      | title       | Menu_2                   | string |
      | ingredients |                          | array  |

    Scenario: Get all menus (Status All)
      When login as
        | id                       | username       | role |
        | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
      Given categories
        | _id                      | title  |
        | 64fc6c5759b4b66f30d67843 | Cat1   |
        | 64fc75f0808cb60b8ab9f906 | Cat2   |
      Given menus
       | _id                      | title  | price | category                 | addons                                            |
       | 650b3e13e57d82a5170a5b2a | Menu_1 | 10    | 64fc6c5759b4b66f30d67843 | 64f5f6b25c81011f9748ba46,64fc724bbb111885fcaf555a |
       | 650b3e1d260e9aec3203f548 | Menu_2 | 20    | 64fc6c5759b4b66f30d67843 |                                                   |
       | 650b3e2267c946b867f5d0f8 | Menu_3 | 30    | 64fc75f0808cb60b8ab9f906 | 64f5f6b25c81011f9748ba46                          |
       | 650b3e2a668b84ca2f65f8f3 | Menu_4 | 40    |                          |                                                   |
      When update cateogries rank
        | rank                                                                       |
        | 64fc6c5759b4b66f30d67843,64fc75f0808cb60b8ab9f906,64ef35bbe6c66d526b0981f0 |
      Given addons
        | _id                       | title  | price |
        | 64f5f6b25c81011f9748ba46 | Yesss  | 55    |
        | 64fc724bbb111885fcaf555a | Nooooo | 100   |

      When get all menus with status "all"
      Then should category data at index 0 be
        | key     | value                                               | type   |
        | _id     | 64fc6c5759b4b66f30d67843                            | string |
        | title   | Cat1                                                | string |
        | menus   | 650b3e13e57d82a5170a5b2a,650b3e1d260e9aec3203f548   | array  |
      Then should menu data at index [0][0] be
        | key     | value                                             | type   |
        | _id     | 650b3e13e57d82a5170a5b2a                          | string |
        | title   | Menu_1                                            | string |
        | price   | 10                                                | number |
      Then should addons data at index [0][0][0] be
        | key     | value                                             | type   |
        | _id     | 64f5f6b25c81011f9748ba46                          | string |
        | title   | Yesss                                             | string |
        | price   | 55                                                | number |
      Then should addons data at index [0][0][1] be
        | key     | value                                             | type   |
        | _id     | 64fc724bbb111885fcaf555a                          | string |
        | title   | Nooooo                                            | string |
        | price   | 100                                               | number |
      Then should menu data at index [0][1] be
       | key     | value                                             | type   |
       | _id     | 650b3e1d260e9aec3203f548                          | string |
       | title   | Menu_2                                            | string |
       | price   | 20                                                | number |

      Then should category data at index 1 be
        | key     | value                                             | type   |
        | _id     | 64fc75f0808cb60b8ab9f906                          | string |
        | title   | Cat2                                              | string |
        | menus   | 650b3e2267c946b867f5d0f8                          | array  |
      Then should menu data at index [1][0] be
        | key     | value                                             | type   |
        | _id     | 650b3e2267c946b867f5d0f8                          | string |
        | title   | Menu_3                                            | string |
        | price   | 30                                                | number |

      Then should category data at index 2 be
        | key     | value                                             | type   |
        | _id     | 64ef35bbe6c66d526b0981f0                          | string |
        | title   | Others                                            | string |
        | menus   | 650b3e2a668b84ca2f65f8f3                          | array  |
      Then should menu data at index [2][0] be
        | key     | value                                             | type   |
        | _id     | 650b3e2a668b84ca2f65f8f3                          | string |
        | title   | Menu_4                                            | string |
        | price   | 40                                                | number |

    Scenario: Unpublish Menu
      When login as
        | id                       | username       | role |
        | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
      Given menus
        | _id                      | title  | price |
        | 64fc76201867d411087a0bbf | Menu_1 | 10    |
      When unpublish menu "64fc76201867d411087a0bbf"
      Then should return status code 200
      When get menu by id "64fc76201867d411087a0bbf"
      Then should response data be
        | key          | value                    | type   |
        | _id          | 64fc76201867d411087a0bbf | string |
        | published_at | null                     | null   |

    Scenario: Publish Menu
      When login as
        | id                       | username       | role |
        | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
      Given menus
       | _id                      | title  | price |
       | 64fc76201867d411087a0bbf | Menu_1 | 10    |
      When unpublish menu "64fc76201867d411087a0bbf"
      When publish menu "64fc76201867d411087a0bbf"
      Then should return status code 200
      When get menu by id "64fc76201867d411087a0bbf"
      Then "published_at" field should not be null in response

  Scenario: Get menus
    When login as
      | id                       | username       | role |
      | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
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

    Scenario: Get all menus (Status: published)
      When login as
        | id                       | username       | role |
        | 64ff1bbf76e1dfabe0337a1b | meeorder_owner | 100  |
      Given categories
          | _id                      | title  |
          | 64fc6c5759b4b66f30d67843 | Cat1   |
          | 64fc75f0808cb60b8ab9f906 | Cat2   |
      Given menus
      | _id                      | title  | price | category                 |
      | 64fc76201867d411087a0bbf | Menu_1 | 10    | 64fc6c5759b4b66f30d67843 |
      | 64fc764a1867d411087a0bc0 | Menu_2 | 20    | 64fc6c5759b4b66f30d67843 |
      | 64fc76621867d411087a0bc1 | Menu_3 | 30    | 64fc75f0808cb60b8ab9f906 |
      | 64fc76751867d411087a0bc2 | Menu_4 | 40    |                          |
      When update cateogries rank
        | rank                                                                       |
        | 64fc6c5759b4b66f30d67843,64fc75f0808cb60b8ab9f906,64ef35bbe6c66d526b0981f0 |
      When publish menu "64fc76201867d411087a0bbf"
      When publish menu "64fc76621867d411087a0bc1"
      When get all menus with status "published"
      Then should menu data at index [0][0] be
        | key     | value                                             | type   |
        | _id     | 64fc76201867d411087a0bbf                          | string |
        | title   | Menu_1                                            | string |
        | price   | 10                                                | number |
      Then should menu data at index [1][0] be
        | key     | value                                             | type   |
        | _id     | 64fc76621867d411087a0bc1                          | string |
        | title   | Menu_3                                            | string |
        | price   | 30                                                | number |