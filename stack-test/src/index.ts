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

  app.on('commit_comment.created', async (context) => {
    const commitComment = context.payload;
    console.log(commitComment);
  });
}
