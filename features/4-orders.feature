@session
Feature: Orders

  Scenario: Create a order
    When create order
    Then should return status code 201
    When get all orders
    Then should return status code 200
    When update order to preparing
    Then should return status code 204
    When update order to ready to serve
    Then should return status code 204
    When update order to done
    Then should return status code 204