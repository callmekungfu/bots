import { Application } from 'probot' // eslint-disable-line no-unused-vars

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
    if (!context.payload.issue.url) {

    }
    const commitComment = context.payload;
    const response = context.issue({
      body: 'Thanks for testing!'
    })
    await context.github.issues.createComment(response)
    console.log(commitComment);
  });

  app.on('pull_request.assigned', async (context) => {
    console.log(context.payload);
  })
}
