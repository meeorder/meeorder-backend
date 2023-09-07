@session
Feature: Orders
  Background:
    Given tables
      | _id                      | title |
      | 64f55c53561fa6a99fc45b29 | 1     |
      | 64f55c65561fa6a99fc45b2a | 2     |
    Given sessions
      | _id                      | finished_at | table                    |
      | 64c5485a510698e8c9e7bdb5 | 2016-01-01  | 64f55c53561fa6a99fc45b29 |
      | 64c5485a510698e8c9e7bdc0 |             | 64f55c53561fa6a99fc45b29 |
      | 64f57944349d90ff3cf574d9 |             | 64f55c65561fa6a99fc45b2a |


  Scenario: Create a order
    Given orders
      | _id                      | session                  | menu                     | addon                    | additional_info |
      | 64f5707f6d126db5cc098a36 | 64c5485a510698e8c9e7bdc0 | 000000014aaec6eb813e8bc0 | 000000014aaec6eb813e8bc0 |                 |
    When create order
      | session                  | menu                     | addon                    |
      | 64c5485a510698e8c9e7bdc0 | 000000014aaec6eb813e8bc0 | 000000014aaec6eb813e8bc0 |
    Then should return status code 201
    When get all orders
    Then should return status code 200
    Then should response be length 2
    When update order "64f5707f6d126db5cc098a36" to preparing
    Then should return status code 204
    When update order "64f5707f6d126db5cc098a36" to ready to serve
    Then should return status code 204
    When update order "64f5707f6d126db5cc098a36" to done
    Then should return status code 204