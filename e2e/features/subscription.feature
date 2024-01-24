Feature: Subscriptions
  As an user, I'm able to view the subscription page

  Scenario: User open the app and navigate subscription page
    Given user open the app
    And user open the subscription link
    Then user should see the subscription page

  Scenario: User on subscription page, should be able to filter the list of subscriptions
    Given user open the "subscriptions" page
    Then user should see "3" subscriptions
    When user change filter by "One Time Purchase"
    Then user should see "1" subscriptions

  Scenario: User upon refreshing subscription page, should see filter persisted
    Given user open the "subscriptions" page
    And user change filter by "One Time Purchase"
    Then user should see "1" subscriptions
    When user reload current page
    Then user should see "1" subscriptions

