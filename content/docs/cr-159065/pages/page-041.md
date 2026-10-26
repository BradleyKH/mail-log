---
pdfPage: 41
folio: "29"
sectionId: "4.1.3.2"
kind: text
source: reviewed
confidence: 100
figures: []
---
Step #37 A header followed by document data is displayed. See Figure 31. Terminal message is displayed after last found.

```text
THERE ARE XXX DOCUMENTS WITH A DATE OF MM-DD-YY
```

Where XXX represents the number of documents found and MMDDYY is the input date entered for search.

Step #38 Go to #17

Step #39

```text
HOW MANY WORDS DO YOU WISH TO MATCH (MAX OF 4)
X
```

Enter number X

Step #40

```text
WHAT IS THE DESIRED WORD
AAAA
```

Enter word AAAA
If word is QUIT, go to #45

Step #41 As each subject is found containing the desired word, the subject is displayed on the terminal. Following the last subject is displayed a message.

```text
THERE ARE XXX DOCUMENTS CONTAINING THE WORD AAAA
```

Where XXX represents the number of documents found and AAAA is the desired word entered.

Step #42 Steps #40 and #41 are repeated X number of times from Step #39, unless zero (0) documents are found. If no documents are found, go to #45.

Step #43 A header followed by document data is displayed after the last word is searched. See Figure 33.

Step #44 Go to #17.
