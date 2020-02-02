import { IUserAction, UserActions } from "./models/actions";
import { Context, Octokit } from "probot";
import { IChecksForPR } from "./models/checks";
import { IGetPullRequest } from "./models/pulls";

export const newCommentResolver = async (context: Context) => {
  const { body } = context.payload.comment
  const action = bodyParser(body);
  console.log('ran');
  if (action?.action === UserActions.LINK_PULL) {
    const pullParams = parseLink(body, ' link ');
    let checkParams;
    if (pullParams) {
      const pull = await fetchRepoData(pullParams, context);
      checkParams = {
        owner: pullParams.owner,
        repo: pullParams.repo,
        ref: pull.head.ref
      }
      const checks = await fetchCheckData(checkParams, context);
      console.log('checks: ', checks);
    }
    await createComment(`**Repository Connected!**
    
    Applying Status Check now :)`, context);
  }
}

export const pullRequestResolver = async (context: Context) => {
  const pr = context.payload.pull_request;
  try {
    await context.github.checks.create({
      head_sha: pr.head.sha,
      name: 'They Should Pass First',
      owner: context.payload.repository.owner.login,
      repo: context.payload.repository.name,
    });
  } catch (e) {
    console.error(e);
  }
}

const fetchRepoData = async (query: IGetPullRequest | undefined, context: Context) => {
  if (!query) {
    throw Error('No pull request params found');
  }
  return (await context.github.pulls.get(query)).data;
}

const fetchCheckData = async (query: IChecksForPR, context: Context) => {
  return (await context.github.checks.listForRef({
    owner: query.owner,
    repo: query.repo,
    ref: query.ref,
  })).data;
}


const createComment = async (body: string, context: Context) => {
  const response = context.issue({
    body
  });
  await context.github.issues.createComment(response)
} 

const bodyParser = (body: string): IUserAction | undefined => {
  if (body.includes(' link ')) {
    return {
      action: UserActions.LINK_PULL,
    }
  }
  return undefined;
}

export const parseLink = (body: string, splitter: string): IGetPullRequest | undefined => {
  let link = body.split(splitter)[1];
  let commands;
  if (!link?.includes('github.com') || !link?.includes('pull')) {
    throw new Error('Invalid Link');
  }
  commands = link.split('com/')[1].split('/');
  return {
    owner: commands[0],
    repo: commands[1],
    pull_number: Number(commands[3])
  };
}