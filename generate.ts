import path from 'path';
import fs from 'fs';

import { entries, noEntriesMessages } from './arrays';
import { randomElement } from './utils';

const USED_ENTRIES_PATH = path.resolve('.', 'usedEntries');
const USED_NO_ENTRIES_MESSAGES_PATH = path.resolve(
  '.',
  'usedNoEntriesMessages'
);

export const generate = (dryRun: boolean) => {
  const usedEntries = getUsedWords(USED_ENTRIES_PATH);
  const usedNoEntriesMessages = getUsedWords(USED_NO_ENTRIES_MESSAGES_PATH);

  let unusedEntries = entries.filter((entry) => !usedEntries.includes(entry));
  let unusedNoEntriesMessages = entries.filter(
    (message) => !usedNoEntriesMessages.includes(message)
  );

  if (!unusedNoEntriesMessages.length) {
    resetUsedWords(USED_NO_ENTRIES_MESSAGES_PATH);
    unusedNoEntriesMessages = noEntriesMessages;
  }

  const hasEntry = unusedEntries.length > 0;

  const post = hasEntry
    ? randomElement(unusedEntries)
    : randomElement(unusedNoEntriesMessages);

  if (!dryRun) {
    saveUsedWord(
      hasEntry ? USED_ENTRIES_PATH : USED_NO_ENTRIES_MESSAGES_PATH,
      post
    );
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
