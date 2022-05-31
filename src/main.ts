/* eslint-disable @typescript-eslint/explicit-function-return-type */
import * as github from '@actions/github'
import * as core from '@actions/core'
import axios from 'axios'
// const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
// const SLACK_URL = core.getInput('SLACK_URL')
// const ASSETS_LOCATION = core.getInput('ASSETS_LOCATION')
// const GITHUB_RELEASES = core.getInput('GITHUB_RELEASES')
// const APP_NAME = core.getInput('APP_NAME')
const APP_NAME = 'TEST'
const SLACK_WEBHOOK_URL = core.getInput('SLACK_WEBHOOK_URL')
// const octokit = github.getOctokit(GITHUB_TOKEN)
const {context = {}}: any = github

const run = async () => {
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

const releaseFromPR = async (): Promise<void> => {
  try {
    const newFeatures = context?.payload?.commits
      ?.filter(({message}) => message.includes('feat'))
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const bugFixes = context?.payload?.commits
      ?.filter(
        ({message}) => message.includes('bug') || message.includes('fix')
      )
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const docs = context?.payload?.commits
      ?.filter(({message}) => message.includes('docs'))
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const uncategorized = context?.payload?.commits
      ?.filter(
        ({message}) =>
          !message.includes('bug') ||
          !message.includes('fix') ||
          !message.includes('feat') ||
          !message.includes('chore') ||
          !message.includes('docs')
      )
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const options = getWebHookOptions({
      newFeatures,
      docs,
      bugFixes,
      uncategorized
    })
    await axios.post(SLACK_WEBHOOK_URL, JSON.stringify(options))
  } catch (e) {
    console.log(e)
    core.setFailed('Failed to send to slack')
  }
}
const releaseFromPush = async (): Promise<void> => {
  try {
    const newFeatures = context?.payload?.commits
      ?.filter(({message}) => message.includes('feat'))
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const bugFixes = context?.payload?.commits
      ?.filter(
        ({message}) => message.includes('bug') || message.includes('fix')
      )
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const docs = context?.payload?.commits
      ?.filter(({message}) => message.includes('docs'))
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const uncategorized = context?.payload?.commits
      ?.filter(
        ({message}) =>
          !message.includes('bug') ||
          !message.includes('fix') ||
          !message.includes('feat') ||
          !message.includes('chore') ||
          !message.includes('docs')
      )
      ?.map(
        (commit: {message: string}, i: number) => `${i + 1}. ${commit.message}`
      )
      .join('\n\n > ')
    const options = getWebHookOptions({
      newFeatures,
      docs,
      bugFixes,
      uncategorized
    })
    await axios.post(SLACK_WEBHOOK_URL, JSON.stringify(options))
  } catch (e) {
    console.log(e)
    core.setFailed('Failed to send to slack')
  }
}

const getWebHookOptions = ({newFeatures, docs, bugFixes, uncategorized}) => {
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
        text: {
          type: 'mrkdwn',
          text: `New Features`,
          fields: [{type: 'mrkdwn', text: '1. add test webhook sms'}]
        }
      }
    ]
  }
}
run()
