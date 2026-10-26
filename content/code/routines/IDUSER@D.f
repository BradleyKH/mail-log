      SUBROUTINE IDUSER(IAI)
      INTEGER*®2 IPASS(4)—(IAC15)
C
C     THIS ROUTINE CHECKS TO MAKE SURE THAT THE
C     INCOMMING USER IS VALID                o
C                                            Do
      CALL BREAK$( TRUE)
      CALL TIMDAT(IA,15)
      CALL CLEAR
102   IF (IA(13) NEo*SY*) GO TO 101
      IF (IA(14) ANES*ST®) GO TO 101
      IF(IA(15).NE.*EN*) GO TO 101
      GO TO 103
C 101° CALL COMINPC6HLOUSERe10)                                     eo
      CALL EXIT
103   CALL BREAK$(.FALSE.)
      TAI=IA(13)
      RETURN
      END                                             A        SO
