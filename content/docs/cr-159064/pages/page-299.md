---
pdfPage: 299
folio: null
sectionId: "C.SYSDR"
kind: listing
source: ocr
confidence: 49.9
figures: []
listing:
  appendix: "C"
  routines: ["SYSDR"]
  listingPage: 70
---
```fortran
(0835)       SUBROUTINE SYSDR
(0836) C
(0836)       COMMON BLOCK FOR THE DIR FILE
(0836) C
(0836)       COMMON TIT,PTIT,DIR sRPT DT eSYS eWAN,CON,ID, VEHSACT OR
(0836)       COMMON COMP eREV,RDAT WA              .
(0836) C
(0836) C
(0836) C     DATA DECLARATION BLOCK FOR THE OIR FILE                 ae
(0836) C                                                           Coe,
(0836)       INTEGER#4 TIT(21) sPTITCLI DIR (4)» RPT(4) (SYS(3) @CON(S) 9 ID9 ACT
(0836)       INTEGER*4 COMP(21)
(0836)       INTEGER*2 DT (3) eWAN(4S) GVEH (202) eR, REV,RDAT (3) GP WA(4)
(0836) C
(0837) C
(0838) C
(0839) C     THIS ROUTINE LOCATES ALL DOCUMENTS WITH A SPCIFIED SYSTEM
(0840) C
(0841)       INTEGER*4 DS,KNT
(0842)       KNT=0
(0843)       WRITE (1,1)
(0844) 1     FORMAT(' WHAT IS THE DESIRED SYSTEM')
(0845)       READ(C192,ERR=3)DS                                               I
(0846) 2     FORMAT(3A4)
(0847) 100   READ(G,END=200) TIT,PTIT,DIR,OT,SYSoWAN,VEH,REV,RDAT
(0848)       00.150 I=1,3
(0849)       IF(COS.EQ.SYS(I)) GO TO 175
(0850) 150   CONTINUE                                                        .
(0851)       GO TO 100
(0852) 175   CONTINUE
(0853)       CALL FMAIN
(0854)       KNT=KNT41
(0855)       GOTO 100
(0856) 200   WRITE (1250) KNT DS
(0857) 250   FORMAT(' THERE ARE 'I19' DOCUMENTS WITH A SYSTEM OF ''3A4)
(0858)       RETURN                                   .
(0859)       END                                   .
```
