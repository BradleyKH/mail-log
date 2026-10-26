C     READ ONE LINE FROM CONSOLE OR COMMAND FILE                     a
C                                                              oo,

      SUBROUTINE RDCOM( BUF)
C
      COMMON /X/ PEDL
C
      INTEGER BUF (1) ePEOL s CHAR oANL PAKILL»AERASE
C
C     ANLs AKILL» AERASE ARE OCTAL 2129 2779 242
      DATA  ANLsAKILLesAERASE/13941919136/
C
      PEOL=1
C 0.   N=1
100   CALL CTIN(CHAR)
      BUF (N) =CHAR
      IF(CHARSEQ,ANL)  RETURN
      IF (CHAR.EQ.AKILL) GOTO 90
      IF(CHAR.EQ.AERASE)  GOTO 200
      N=N41
      IF(N.GT.77) GCTO 399
      GOTO 100
C
200   IF(N.LE.2)  GOTO 90
      N=N-1
      GOTO 100
C
999   ILF=:212
      CALL TIOU(ILF)
      RETURN
      END
