Feature: Menu Test
    Scenario: Create Menu, Get Menu and Delete Menu
        Given a menu
        When create a menu
        Then should return status code 201
        And should return a same menu id when get by the same id
        When delete this menu
        And get this menu by the same id
        Then should return status code 404

    Scenario: Update Menu
        Given a menu
        When create a menu
        And update this menu with name "Menu 2"
        Then should return status code 200
        And menu name should be "Menu 2" when get by the same id
        And delete this menu



