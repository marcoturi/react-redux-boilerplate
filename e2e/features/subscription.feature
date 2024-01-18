Feature: Subscriptions
  As an user, I'm able to view the subscription page

  Scenario: as a user, open the app, open the subscription page
    Given open the app
    And click the subscription link
    Then I should see the subscription page
