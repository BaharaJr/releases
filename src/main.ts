/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as github from '@actions/github'
import * as core from '@actions/core'
import axios from 'axios'
// const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
// const octokit = github.getOctokit(GITHUB_TOKEN)
// const SLACK_UPLOADS = 'https://slack.com/api/files.upload'
// const INITIAL_COMMENT = core.getInput('INITIAL_COMMENT')
const SLACK_CHANNEL = core.getInput('SLACK_CHANNEL')
const SLACK_ASSET = core.getInput('SLACK_ASSET')
const ASSETS_LOCATION: string = core.getInput('ASSETS_LOCATION')
const ASSETS = core.getInput('ASSETS')
const GITHUB_RELEASES = core.getInput('GITHUB_RELEASES')
const APP_NAME = core.getInput('APP_NAME')
const SLACK_WEBHOOK_URL = core.getInput('SLACK_WEBHOOK_URL')
const {context = {}}: any = github

const newFeatures = context?.payload?.commits
  ?.filter(({message}) => message.includes('feat'))
  ?.map((commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`)
  .join('\n\n > ')

const bugFixes = context?.payload?.commits
  ?.filter(({message}) => message.includes('bug') || message.includes('fix'))
  ?.map((commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`)
  .join('\n\n > ')

const docs = context?.payload?.commits
  ?.filter(({message}) => message.includes('docs'))
  ?.map((commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`)
  .join('\n\n > ')

const uncategorized = context?.payload?.commits
  ?.filter(
    ({message}) =>
      !message.includes('bug') &&
      !message.includes('fix') &&
      !message.includes('feat') &&
      !message.includes('chore') &&
      !message.includes('docs')
  )
  ?.map((commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`)
  .join('\n\n > ')

const run = async () => {
  checkParams()
  const eventName = context.eventName
  switch (eventName) {
    case 'push':
      return releaseFromPush()
    case 'pull_request':
      return releaseFromPR()
    default:
      return releaseFromPush()
  }
}

const checkParams = () => {
  if (!SLACK_WEBHOOK_URL && !GITHUB_RELEASES) {
    core.setFailed('Atleast one functionality is required')
    return
  }

  if (GITHUB_RELEASES && ASSETS && !ASSETS_LOCATION) {
    core.setFailed('GitHub Assets require an asset location')
    return
  }

  if (SLACK_ASSET && !SLACK_CHANNEL) {
    core.setFailed('Slack channel is required to send  Assets')
    return
  }
}

const releaseFromPR = async (): Promise<void> => {
  try {
    if (SLACK_WEBHOOK_URL) {
      const options = getWebHookOptions()
      await axios.post(SLACK_WEBHOOK_URL, JSON.stringify(options))
    }
    if (SLACK_ASSET) {
      core.warning('Slack Assets are currently not supported')
      /*
      const formData = new FormData()
      formData.append('file', readFileSync(ASSETS_LOCATION))
      formData.append('initial_comment', INITIAL_COMMENT || '')
      formData.append('channels', SLACK_CHANNEL)

      await axios.post(SLACK_UPLOADS)
      */
    }
    return
  } catch (e) {
    core.setFailed('Failed to send to slack')
  }
}
const releaseFromPush = async (): Promise<void> => {
  try {
    const options = getWebHookOptions()
    await axios.post(SLACK_WEBHOOK_URL, JSON.stringify(options))
  } catch (e) {
    core.setFailed('Failed to send to slack')
  }
}

const getWebHookOptions = () => {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: `:sparkles: New version released on *${APP_NAME}*`,
          emoji: true
        }
      },
      {
        type: 'context',
        elements: [
          {
            text: ` *${APP_NAME}*`,
            type: 'mrkdwn'
          }
        ]
      },
      {
        type: 'divider'
      },
      {
        type: 'section',

        fields: [{type: 'mrkdwn', text: `*New Features* \n ${newFeatures}`}]
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        fields: [{type: 'mrkdwn', text: `*Bug Fixes* \n ${bugFixes}`}]
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        fields: [{type: 'mrkdwn', text: `*Documentation* \n ${docs}`}]
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        fields: [{type: 'mrkdwn', text: `*Miscellaneous* \n ${uncategorized}`}]
      }
    ]
  }
}
run()
