import { Application, Context } from 'probot' // eslint-disable-line no-unused-vars
import { newCommentResolver } from './resolvers';

export = (app: Application) => {
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
    await newCommentResolver(context);
    // await context.github.checks.create({
    //   name: 'Stack Test Check',
    //   status: 'in_progress',
    //   repo: '',
    //   head_sha: '',
    //   owner: '',
    // })
  });
  
  app.on(['pull_request.opened', 'pull_request.editted'], async (context) => {
    console.log(context.payload.pull_request.head);
  });
}



const skipComment = (context: Context) => {
  const { payload } = context;
  if (!(payload.comment.body as string).includes('/they-have-to-pass-first')) {
    return true;
  }
  return !payload.issue.pull_request || payload.sender.type === 'Bot'
}