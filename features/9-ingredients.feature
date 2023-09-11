@ingredients
Feature: Ingredients

    Scenario: Create duplicate ingredient
        Given ingredients
            | title      |
            | meeorder01 |
        When create an ingredient
            | title      |
            | meeorder01 |
        Then should return status code 409
