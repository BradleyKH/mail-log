---
pdfPage: 541
folio: "527"
sectionId: "6.4.1"
kind: mixed
source: ocr
confidence: 77.1
figures: []
---
6.4 _ TABLES
This Section describes the tables used by the MAIL LOG software. -
6.4.1 SYSCOM KEYS.F

Table SYSCOM KEYS.F represents the File System Key Definitions as —

shown:

```text
a     LIST
Cc    TABSET 6 11 28 69
```

Cc
INTEGER*2 KSREAD, KSWRIT, KSPOSN, KSTRNC , KSRPOS, KSPRER, KSPREA,

```text
xX    KSPOSR, KSPOSA, KSCONV, KSRDWR, KSCLOS , KSDELE, KSEXST,
x    KSIUFD, KSISEG, KSCACC, KSNSAM, KSNDAM , KSNSGS , KSNSGD,
xX    KSCURR, KSIMFD, KSICUR, KSSETC , KSSETH, KSALLD, KSSPOS,
X    KSGOND, KSMSIZ , KSMENT, KSENTR, KSSENT, KSGPOS, KSUPOS,
xX    KSPROT, KSDTIM, KSDMP8, KSNRIN, KSSRIN, KSIRIN
```

PARAMETER
xX V parotetalotatalotototatotetotetotatetotatotatotatototototototeiotaiotatatatatoiotoialatotatatataiototatotetatel A
x /*
YX 7
xX /* KEY DEFINITIONS
X /*
X /*
XARA IO III DRIP SS GIR IRI RI IK

```text
X /*   AkKKKK RYKEY *kxkkK
xX    KSREAD = :1,     /* READ
xX    KSWRIT = 3:2,     /* WRITE
x    KSPOSN = :3,     /* POSITION ONLY
x    KSTRNC = :4,     /* TRUNCATE
x    KSRPOS = :5,     /* READ CURRENT POSITION
X /*              kkRKKK POSKEY tktkkk
xX    KSPRER = :8,     /* PRE-POSITION RELATIVE
x    KSPREA = :16,    /* PRE-POSITION ABSOLUTE
x    KSPOSR = :28,    /* POST-POSITION RELATIVE
X    KSPOSA = :36,    /* POST-POSITION ABSOLUTE
X /*              kkkkkk MODE 9 kkkkke
xX    KSCONV = :400;,   /* CONVENIENT NUMBER OF WORDS
```

X /*
X JT akbkbbeAekARAAAAEEEEE SRCHSS &kKKKEKKRREREREKKREKE
X /* kkKKKK ACTION *keRKE
X /* KSREAD = :], | /* OPEN FOR READ

```text
X /* KSWRIT = :2,   /* OPEN FOR WRITE
xX    KSRDWR = 3:3,     /* OPEN FOR READING AND WRITING
x.   KSCLOS = :4,     /* CLOSE FILE WIT
Xx    KoveLE = 35, |   /* DELETE ¥ILE
X . KSEXST = :6,     /* CHECK FILE'S EXISTENCE
```
