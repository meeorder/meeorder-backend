@menus
Feature: Menus
  Scenario: Create a menu
    When create a menu
      | title | price |
      | menu1 | 100   |
    Then should return status code 201
    Then should menu appear in database

  Scenario: Get menu by id (No category & addon)
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

    Scenario: Get all menus (Status All)
      Given categories
        | _id                      | title  |
        | 64fc6c5759b4b66f30d67843 | Cat1   |
        | 64fc75f0808cb60b8ab9f906 | Cat2   |
      Given menus
       | _id                      | title  | price | category                 | addons                                            |
       | 64fc76201867d411087a0bbf | Menu_1 | 10    | 64fc6c5759b4b66f30d67843 | 64f5f6b25c81011f9748ba46,64fc724bbb111885fcaf555a |
       | 64fc764a1867d411087a0bc0 | Menu_2 | 20    | 64fc6c5759b4b66f30d67843 |                                                   |
       | 64fc76621867d411087a0bc1 | Menu_3 | 30    | 64fc75f0808cb60b8ab9f906 | 64f5f6b25c81011f9748ba46                          |
       | 64fc76751867d411087a0bc2 | Menu_4 | 40    |                          |                                                   |
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
        | menus   | 64fc76201867d411087a0bbf,64fc764a1867d411087a0bc0   | array  |
      Then should menu data at index [0][0] be
        | key     | value                                             | type   |
        | _id     | 64fc76201867d411087a0bbf                          | string |
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
       | _id     | 64fc764a1867d411087a0bc0                          | string |
       | title   | Menu_2                                            | string |
       | price   | 20                                                | number |

      Then should category data at index 1 be
        | key     | value                                             | type   |
        | _id     | 64fc75f0808cb60b8ab9f906                          | string |
        | title   | Cat2                                              | string |
        | menus   | 64fc76621867d411087a0bc1                          | array  |
      Then should menu data at index [1][0] be
        | key     | value                                             | type   |
        | _id     | 64fc76621867d411087a0bc1                          | string |
        | title   | Menu_3                                            | string |
        | price   | 30                                                | number |

      Then should category data at index 2 be
        | key     | value                                             | type   |
        | _id     | 64ef35bbe6c66d526b0981f0                          | string |
        | title   | Others                                            | string |
        | menus   | 64fc76751867d411087a0bc2                          | array  |
      Then should menu data at index [2][0] be
        | key     | value                                             | type   |
        | _id     | 64fc76751867d411087a0bc2                          | string |
        | title   | Menu_4                                            | string |
        | price   | 40                                                | number |

    Scenario: Unpublish Menu
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
      Given menus
       | _id                      | title  | price |
       | 64fc76201867d411087a0bbf | Menu_1 | 10    |
      When unpublish menu "64fc76201867d411087a0bbf"
      When publish menu "64fc76201867d411087a0bbf"
      Then should return status code 200
      When get menu by id "64fc76201867d411087a0bbf"
      Then "published_at" field should not be null in response

    Scenario: Get all menus (Status: published)
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
        When unpublish menu "64fc76201867d411087a0bbf"
        When unpublish menu "64fc76621867d411087a0bc1"
        When get all menus with status "published"
        Then should category data at index 0 be
          | key     | value                                             | type   |
          | _id     | 64fc6c5759b4b66f30d67843                          | string |
          | title   | Cat1                                              | string |
          | menus   | 64fc764a1867d411087a0bc0                          | array  |

        Then should category data at index 1 be
          | key     | value                                             | type   |
          | _id     | 64fc75f0808cb60b8ab9f906                          | string |
          | title   | Cat2                                              | string |
          | menus   |                                                   | array  |

        Then should category data at index 2 be
          | key     | value                                             | type   |
          | _id     | 64ef35bbe6c66d526b0981f0                          | string |
          | title   | Others                                            | string |
          | menus   | 64fc76751867d411087a0bc2                          | array  |
