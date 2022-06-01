![Workflow Status](https://github.com/BaharaJr/releases/actions/workflows/test.yml/badge.svg)

# Automatically Send Releases to Slack and GitHub Assets

## Requirements

- This runner accepts the following parameters.

|        Key        |                         Description                               | Required   |      Required Condition       |
| ----------------- | ----------------------------------------------------------------- | ---------- | ----------------------------- |
| GITHUB_TOKEN      | A string GitHub token from a user with accesss to the repo.       |     NO     | Assets is true                |
| ASSETS_LOCATION   | A string location of the assets if sending to slack or GitHub.    |     NO     | Assets is true                |
| ASSETS            | A boolean dictating whether or not to add GitHub Assets.          |     NO     |                               |
| SLACK_WEBHOOK_URL | Slack webhook URL for sending release summaries to slack.         |     NO     |                               |
| SLACK_ASSET       | A boolean dictating whether to send assets to slack or not.       |     NO     |                               |
| SLACK_CHANNEL     | Slack channel to send assets.                                     |     NO     | Slack asset is true           |
| APP_NAME          | Your application/asset name for reference                         |     YES    |                               |

## Roadmap

- We look forward to adding more functions in the future, feel free to drop an issue for any features you might want added.

## Contributing

Contributions are always welcome and highly encourage!
