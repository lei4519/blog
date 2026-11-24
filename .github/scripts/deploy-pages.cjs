const { setTimeout: delay } = require('node:timers/promises')

module.exports = async function deployPages({ github, context, core }) {
  const artifactId = Number(process.env.PAGES_ARTIFACT_ID)
  if (!Number.isSafeInteger(artifactId) || artifactId < 1) {
    throw new Error('The upload step did not return a valid Pages artifact ID')
  }

  const { repos } = github.rest
  const repo = context.repo
  const oidcToken = await core.getIDToken()
  core.info(`Deploying artifact ${artifactId} for ${context.sha}`)
  let deployment
  try {
    const response = await repos.createPagesDeployment({
      ...repo,
      artifact_id: artifactId,
      pages_build_version: context.sha,
      oidc_token: oidcToken,
    })
    deployment = response.data
  } catch (error) {
    // The original request contains the OIDC token.
    throw new Error(`Pages rejected artifact ${artifactId}: ${error.status ?? 'network error'}`)
  }

  const deploymentId = deployment.id || deployment.status_url?.split('/').pop() || context.sha
  const target = { ...repo, pages_deployment_id: deploymentId }
  const cancel = () => github.request('POST /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}/cancel', target).catch(error => {
    core.warning(`Could not cancel Pages deployment: ${error.message}`)
  })
  const onCancel = () => { void cancel().finally(() => process.exit(1)) }
  process.once('SIGTERM', onCancel)
  process.once('SIGINT', onCancel)
  try {
    const deadline = Date.now() + 10 * 60_000
    while (Date.now() < deadline) {
      await delay(5_000)
      let status
      try {
        const response = await github.request('GET /repos/{owner}/{repo}/pages/deployments/{pages_deployment_id}', target)
        status = response.data.status
      } catch (error) {
        if (error.status === 404 || error.status === 429 || error.status >= 500) continue
        throw error
      }
      if (status === 'succeed') {
        core.setOutput('page_url', deployment.page_url)
        core.info(`Published ${deployment.page_url}`)
        return
      }
      if (['deployment_failed', 'deployment_perms_error', 'deployment_content_failed',
           'deployment_cancelled', 'deployment_lost'].includes(status)) {
        throw new Error(`Pages deployment ended with ${status}`)
      }
    }
    await cancel()
    throw new Error('Pages deployment exceeded ten minutes')
  } finally {
    process.removeListener('SIGTERM', onCancel)
    process.removeListener('SIGINT', onCancel)
  }
}
