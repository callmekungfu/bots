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
  
  app.on('pull_request.synchronize', async (context: Context) => {
    console.log('sync');
  });
}

/**
 * Check if the command exists in the message, if not don't do anything
 * 
 * Check if the issue is a pull request
 * 
 * Check if the message is sent by a bot
 * 
 * @param context The execution context provided by github
 */
const skipComment = (context: Context) => {
  const { payload } = context;
  const body: string = payload.comment.body;
  if (!body.includes('/they-have-to-pass-first') && !body.includes('/stack-test')) {
    return true;
  }
  return !payload.issue.pull_request || payload.sender.type === 'Bot'
}