import * as github from '@actions/github'
import * as core from '@actions/core'
import axios from 'axios'

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
const SLACK_URL = core.getInput('SLACK_URL')
const ASSETS_LOCATION = core.getInput('ASSETS_LOCATION')
const GITHUB_RELEASES = core.getInput('GITHUB_RELEASES')
const octokit = github.getOctokit(GITHUB_TOKEN)
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
  const newFeatures = context?.payload?.commits?.filter(({message}) =>
    message.includes('feat')
  )
  const bugFixes = context?.payload?.commits?.filter(
    ({message}) => message.includes('bug') || message.includes('fix')
  )
  const docs = context?.payload?.commits?.filter(({message}) =>
    message.includes('docs')
  )
  const uncategorized = context?.payload?.commits?.filter(
    ({message}) =>
      !message.includes('bug') ||
      !message.includes('fix') ||
      !message.includes('feat') ||
      !message.includes('chore') ||
      !message.includes('docs')
  )
  // await axios.post(SLACK_URL)
}
const releaseFromPush = async (): Promise<void> => {
  try {
    const newFeatures = context?.payload?.commits?.filter(({message}) =>
      message.includes('feat')
    )
    const bugFixes = context?.payload?.commits?.filter(
      ({message}) => message.includes('bug') || message.includes('fix')
    )
    const docs = context?.payload?.commits?.filter(({message}) =>
      message.includes('docs')
    )
    const uncategorized = context?.payload?.commits?.filter(
      ({message}) =>
        !message.includes('bug') ||
        !message.includes('fix') ||
        !message.includes('feat') ||
        !message.includes('chore') ||
        !message.includes('docs')
    )
  } catch (e) {
    core.setFailed(e.message)
  }
}
run()
