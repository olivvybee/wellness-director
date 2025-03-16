import path from 'path';
import fs from 'fs';

import { entries } from './entries';
import { randomElement } from './utils';

const USED_ENTRIES_PATH = path.resolve('.', 'usedEntries');

export const generate = (dryRun: boolean) => {
  const usedEntries = getUsedWords(USED_ENTRIES_PATH);

  let unusedEntries = entries.filter((entry) => !usedEntries.includes(entry));

  if (unusedEntries.length === 0) {
    return undefined;
  }

  const post = randomElement(unusedEntries);

  if (!dryRun) {
    saveUsedWord(USED_ENTRIES_PATH, post);
  }

  return post;
};

const getUsedWords = (path: string) => {
  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '');
  }

  const contents = fs.readFileSync(path, 'utf-8');
  return contents.split('\n').filter((str) => !!str.length);
};

const saveUsedWord = (path: string, word: string) => {
  const usedWords = getUsedWords(path);
  usedWords.push(word);
  const contents = usedWords.join('\n');
  fs.writeFileSync(path, contents);
};

const resetUsedWords = (path: string) => {
  fs.writeFileSync(path, '');
};
