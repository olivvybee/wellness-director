import { config as loadEnv } from 'dotenv';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { generate } from './generate';
import { postStatus } from './postStatus';
import { Visibility } from './types';

interface MainArgs {
  dryRun?: boolean;
  visibility?: Visibility;
}

const main = async ({ dryRun = false, visibility }: MainArgs) => {
  const post = generate(dryRun);

  if (dryRun) {
    console.log(`This is a dry run, but I would have posted "${post}".`);
  } else if (post) {
    postStatus(post, { visibility });
  } else {
    console.log('There are no entries left to post');
  }
};

const argv = yargs(hideBin(process.argv))
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: "Generate a post, but don't post to fedi",
  })
  .option('visibility', {
    type: 'string',
    choices: Object.values(Visibility),
    description: 'Set the visibility of the post',
  })
  .help()
  .alias('h', 'help')
  .parseSync();

loadEnv();
main(argv);
