# Dona

An educational AI reading assistant. Load a document, and Dona reads it to you with an expressive avatar, quizzes you as you go, and answers your questions about it.

> Personal project, about 2,600 lines of Python in a single desktop application.

## Why

Reading long material is hard for a lot of learners: attention drifts, nothing checks whether you understood, and when you have a question there is nobody to ask. Dona puts a reader, a tutor and a quizmaster in one window.

## Reader

- Loads **PDF, Word and plain-text** files; the language is detected automatically and the voice follows it.
- Reads **sentence by sentence** (NLTK tokeniser) with Google text-to-speech, playing the audio through pygame and highlighting the current sentence in the text. Bookmarks let you stop and resume later; font size and family are adjustable.
- An **avatar** generated with python-avatars lip-syncs while speaking. Its expression (eyes, mouth, eyebrows) follows the **sentiment** of each sentence, scored with VADER: a sad sentence gets a sad face, a happy one a smile.

![The reader: sentence highlighting, bookmarks, voice and font controls](/optimized/images/dona_3-large.webp)

![The avatar reacts to the sentiment of the sentence being read](/optimized/images/dona_2-large.webp)

The avatar itself is customisable: style, hair, eyes, skin, glasses, clothing.

![Avatar editor](/optimized/images/dona_5-large.webp)

## Challenge mode

Flip a switch and Dona interrupts the reading every few sentences with a **multiple-choice quiz** about what was just read. Questions are generated from the passage; points accumulate, so a reading session becomes a game.

![Challenge mode: a quiz generated from the passage just read](/optimized/images/dona_4-large.webp)

## Chatbot (RAG)

The second tab is a chatbot grounded on the loaded document:

1. The document is split into chunks (recursive splitter, 1,000 characters with 150 overlap).
2. Chunks are embedded with a HuggingFace sentence-transformer and stored in a local **FAISS** index.
3. A question retrieves the closest chunks, and **Gemini 2.5 Flash** answers from them.

Answers can be read aloud by the same avatar.

![The chatbot tab, answering from the loaded document](/optimized/images/dona_1-large.webp)

## Stack

Python, CustomTkinter, gTTS, pygame, NLTK (tokenising, VADER), spaCy, LangChain (splitter, embeddings), FAISS, Google Gemini, python-avatars, PyPDF2, python-docx.
