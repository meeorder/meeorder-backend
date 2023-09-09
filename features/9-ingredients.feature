@ingredients
Feature: Ingredients

    Scenario: Create duplicate ingredient
        Given ingredients
            | title | available |
            | moo   | true      |
        When create an ingredient
            | title | available |
            | moo   | true      |
        Then should return status code 400
