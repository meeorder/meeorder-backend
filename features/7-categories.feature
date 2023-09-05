@categories
Feature: Categories

  Scenario: Get All Cateogires
    Given categories
      | _id                      | title | rank |
      | 64f5f6ac50c26b28d962965e | Cat5  | 69   |
      | 64f5f6b25c81011f9748ba46 | Cat6  |      |
      | 64f5f7863588f08483c7ee4d | Cat7  | 1    |
    When get all categories
    Then should return status code 200
    Then response size should equal to 3

  Scenario: Create a category
    When create a category
      | title |
      | Cat1  |
    Then should return status code 201
    Then should category appear in database

  Scenario: Get Category by Id
    Given categories
      | _id                      | title | rank |
      | 64f4a310e4984065865a2580 | Cat2  | 2    |
      | 64f4a310e4984065865a257e | Cat3  |      |
    When get category by id "64f4a310e4984065865a257e"
    Then should return status code 200
    Then should response data be
      | key   | value                    | type   |
      | _id   | 64f4a310e4984065865a257e | string |
      | title | Cat3                     | string |
      | rank  |                          | null   |

  Scenario: Update category
    Given categories
      | _id                      | title | rank |
      | 64f5ec463ec7999abb9b6f0f | Cat4  | 2    |
    When update category at id "64f5ec463ec7999abb9b6f0f"
      | title     | rank |
      | New_Cat4  | 69   |
    Then should return status code 200
    When get category by id "64f5ec463ec7999abb9b6f0f"
    Then should response data be
      | key   | value                    | type   |
      | _id   | 64f5ec463ec7999abb9b6f0f | string |
      | title | New_Cat4                 | string |
      | rank  | 69                       | number |