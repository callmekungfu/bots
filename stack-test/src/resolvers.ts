import { IUserAction, UserActions } from "./models/actions";
import { Context, Octokit } from "probot";
import { IChecksForPR } from "./models/checks";
import { IGetPullRequest } from "./models/pulls";

export const newCommentResolver = async (context: Context) => {
  const startTime: string = new Date().toISOString();
  const { body } = context.payload.comment
  const action = bodyParser(body);
  // console.log('payload: ', context.payload);
  if (action?.action === UserActions.LINK_PULL) {
    let linkCheckParams: IChecksForPR;
    let createCheckParams: Octokit.ChecksCreateParams;
    let linkPullParams: IGetPullRequest | undefined;
    let selfPullParams: IGetPullRequest | undefined;
    try {
      linkPullParams = parseLink(body, ' link ');
      selfPullParams = _parseLink(context.payload.issue.pull_request.html_url);
    } catch (e) {
      await createComment(`Sorry... Your link is unrecognizable`, context);
      return;
    }
    
    if (!linkPullParams) {
      await createComment(`Sorry... Your link is unrecognizable`, context);
      return;
    }

    const [
      linkPull,
      selfPull,
    ] = await Promise.all([
      fetchRepoData(linkPullParams, context),
      fetchRepoData(selfPullParams, context)
    ]);
    console.log(selfPull);
    linkCheckParams = {
      owner: linkPullParams.owner,
      repo: linkPullParams.repo,
      ref: linkPull.head.ref
    }
    const linkChecks = await fetchCheckData(linkCheckParams, context);
    createCheckParams = {
      name: 'They Should Pass First',
      owner: selfPullParams.owner,
      repo: selfPullParams.repo,
      head_sha: selfPull.head.sha,
      conclusion: determineCheckConclusion(linkChecks),
      started_at: startTime,
      status: 'completed',
      completed_at: new Date().toISOString(),
      details_url: body.split(' link ')[1],
      output: determineCheckSummary(linkChecks),

    }
    console.log('checks: ', linkChecks.check_runs.map(cr => cr.conclusion).filter(r => !!r));
    await createCheck(createCheckParams, context);

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

const determineCheckConclusion = (checks: Octokit.ChecksListForRefResponse) => {
  const res = checks.check_runs.map(cr => cr.conclusion).filter(r => 'success')
  if (res.length > 0) {
    return 'action_required'
  }
  return 'success'
}

const determineCheckSummary = (checks: Octokit.ChecksListForRefResponse): Octokit.ChecksCreateParamsOutput => {
  const res = checks.check_runs.map(cr => cr.conclusion).filter(r => 'success')
  if (res.length > 0) {
    return {
      title: `Pull Request cross checking completed.`,
      summary: 'Unfortunately, the cross checking has failed, try running `/they-have-to-pass-first update` to check it again.'
    }
  }
  return {
    title: `Pull Request cross checking completed.`,
    summary: 'Congrats! Cross Checking has passed!'
  }
}

const fetchCheckData = async (query: IChecksForPR, context: Context) => {
  return (await context.github.checks.listForRef({
    owner: query.owner,
    repo: query.repo,
    ref: query.ref,
  })).data;
}

const createCheck = async (params: Octokit.ChecksCreateParams, context: Context) => {
  await context.github.checks.create(params);
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
  if (!link?.includes('github.com') || !link?.includes('pull')) {
    throw new Error('Invalid Link');
  }
  return _parseLink(link);
}

const _parseLink = (link: string) => {
  const commands = link.split('com/')[1].split('/');
  return {
    owner: commands[0],
    repo: commands[1],
    pull_number: Number(commands[3])
  };
}