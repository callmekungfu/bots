import { Octokit } from "probot";

export interface IChecksForPR {
  owner: string;
  repo: string;
  ref: string;
}

export interface ICreateCheck extends Octokit.ChecksCreateParams {
  
}