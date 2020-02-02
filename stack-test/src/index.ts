import { Application, Context, Octokit } from 'probot' // eslint-disable-line no-unused-vars
import { newCommentResolver, pullRequestResolver } from './resolvers';
import { PULL_REQUEST } from './models/events';

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
    await newCommentResolver(context);
  });
  
  // app.on(PULL_REQUEST, async (context: Context) => {
  //   const pr = context.payload.pull_request;
  //   // console.log(context.payload);
  //   console.log(await context.github.pulls.get({
  //     owner: 'callmekungfu',
  //     repo: 'secret-santa-for-facebook-messenger',
  //     pull_number: 3
  //   }));
  //   try {
  //     await context.github.checks.create({
  //       head_sha: pr.head.sha,
  //       name: 'They Should Pass First',
  //       owner: context.payload.repository.owner.login,
  //       repo: context.payload.repository.name,
  //     });
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });
}



const skipComment = (context: Context) => {
  const { payload } = context;
  if (!(payload.comment.body as string).includes('/they-have-to-pass-first')) {
    return true;
  }
  return !payload.issue.pull_request || payload.sender.type === 'Bot'
}