---
pdfPage: 533
folio: null
sectionId: "F.CHECKS"
kind: listing
source: reviewed
confidence: 90
figures: []
listing:
  appendix: "F"
  routines: ["OPEN", "CLOSE"]
  listingPage: null
---
```fortran
C     **********************************************************************
C     **********************************************************************
C     **                                                                    **
C     **                                                                    **
C     **    WWWW  W   W W   W                                               **
C     **    W   W W  W  W   W                                               **
C     **    W   W W W   WWWWW                                               **
C     **    W   W W W   W   W                                               **
C     **    W   W W  W  W   W                                               **
C     **    WWWW  W   W W   W                                               **
C     **                                                                    **
C     **                                                                    **
C     **     WWW  W   W WWWWW  WWW  W   W  WWW                              **
C     **    W   W W   W W     W   W W  W  W   W                             **
C     **    W     WWWWW WWWW  W     W W    WWW                              **
C     **    W     W   W W     W     W W       W                             **
C     **    W   W W   W W     W   W W  W  W   W                             **
C     **     WWW  W   W WWWWW  WWW  W   W  WWW                              **
C     **                                                                    **
C     **********************************************************************
C     **********************************************************************
C
$INSERT COMMON
      KNT=0
      CALL OPEN
20    READ(12,END=1000) DRAW,SHTN,FREV,INEO,FEOREF
      WRITE(7,100)DRAW,SHTN,FREV,INEO
100   FORMAT(1X,3A4,A2,3X,I2,'.',I2,5X,A2,5X,I2)
      WRITE(7,101) ((FEOREF(I,J),J=1,2),I=1,10)
101   FORMAT(10(1X,2A4),/,'  '/)
      KNT=KNT+1
      GO TO 20
1000  WRITE(1,103) KNT
103   FORMAT(1X,'THERE ARE ',I4,' SHEETS'/)
      CALL CLOSE
      END
      SUBROUTINE OPEN
$INSERT SYSCOM>KEYS.F
      CALL SRCH$$(K$RDWR+K$NDAM,'SHEET ',6,8,1,IC)
      CALL SRCH$$(K$RDWR+K$NSAM,'SHT   ',6,3,0,0)
      REWIND 12
      RETURN
      END
      SUBROUTINE CLOSE
$INSERT SYSCOM>KEYS.F
      CALL SRCH$$(K$CLOS,'SHEET ',6,0,0,0)
      CALL SRCH$$(K$CLOS,'SHT   ',6,0,0,0)
      CALL EXIT
      END
```
