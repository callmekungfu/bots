import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars

export = (app: Application) => {
  // app.on('issues.opened', async (context) => {
  //   const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
  //   await context.github.issues.createComment(issueComment)
  // })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/

  app.on('issue_comment.created', async (context) => {
    const { payload } = context;
    if (skipComment(context)) {
      return;
    }
    console.log(payload);
    const response = context.issue({
      body: `**Stack Test Connected!**
      
      Applying Status Check now :)`
    });
    await context.github
    await context.github.issues.createComment(response)
    await context.github.checks.create({
      name: 'Stack Test Check',
      status: 'in_progress',
      repo: '',
      head_sha: '',
      owner: '',
    })
  });

  app.on('pull_request.assigned', async (context) => {
    console.log(context.payload);
  });
}

const skipComment = (context: Context) => {
  const { payload } = context;
  return !payload.issue.pull_request || payload.sender.type === 'Bot'
}