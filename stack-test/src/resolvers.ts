import { IUserAction, UserActions } from "./models/actions";
import { Context } from "probot";

export const newCommentResolver = async (context: Context) => {
  const action = bodyParser(context.payload.comment.body);
  if (action?.action === UserActions.LINK_PULL) {
    await createComment(`**Repository Connected!**
    
    Applying Status Check now :)`, context);
  }
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
      action: UserActions.LINK_PULL
    }
  }
  return undefined;
}