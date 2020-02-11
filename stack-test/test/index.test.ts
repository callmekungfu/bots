// You can import your modules
// import index from '../src/index'

import nock from 'nock'
// Requiring our app implementation
import myProbotApp from '../src'
import { Probot } from 'probot'
// Requiring our fixtures
import payload from './fixtures/issues.opened.json'

import { parseLink } from '../src/resolvers'

const issueCreatedBody = { body: 'Thanks for opening this issue!' }

describe('Command Parser', () => {
  it('should parse command link ', () => {
    const res = parseLink('/they-have-to-pass-first link https://github.com/callmekungfu/secret-santa-for-facebook-messenger/pull/3', ' link ')
    expect(res).toEqual({
      owner: 'callmekungfu',
      repo: 'secret-santa-for-facebook-messenger',
      pull_number: 3
    })
  })
})

// For more information about testing with Jest see:
// https://facebook.github.io/jest/

// For more information about using TypeScript in your tests, Jest recommends:
// https://github.com/kulshekhar/ts-jest

// For more information about testing with Nock see:
// https://github.com/nock/nock
