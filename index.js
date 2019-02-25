module.exports = (robot) => {
  robot.on(['pull_request.opened', 'pull_request.reopened'], async context => {
    const config = await context.config('labeler.yml')
    const issue = await context.github.issues.get(context.issue())

    if (!config) return;

    let labelsToAdd = []

    // map target branch names to labels
    let targetLabel = config.branchMappings[context.payload.pull_request.base.ref];
    if (targetLabel) labelsToAdd.push(targetLabel);

    // map title words to labels
    for (let k in config.titleMappings) {
        if (context.payload.pull_request.title.toLowerCase().includes(k)
            || context.payload.pull_request.body.toLowerCase().includes(k))
        {
            labelsToAdd.push(config.titleMappings[k]);
        }
    }

    return context.github.issues.addLabels(context.issue({ labels: labelsToAdd }))
  })
}
