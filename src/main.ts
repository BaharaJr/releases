/* eslint-disable camelcase */
import * as github from '@actions/github'
import * as core from '@actions/core'

const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN')
const octokit = github.getOctokit(GITHUB_TOKEN)
const {context = {}}: any = github

const run = async() => {
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

const releaseFromPR = async ():Promise<void> => {
  const {owner, repo, pull_number} = context.payload
octokit.rest.pulls.listCommits({
  owner,
  repo,
  pull_number,
});
}
const releaseFromPush = async ():Promise<void> => {
  try {
    console.log(JSON.stringify(context?.payload))
    const {message} = context?.payload?.head_commit
  } catch (e) {
    core.setFailed(e.message)
  }
}
run()
