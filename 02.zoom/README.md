# Noom

강의 시작 (2022.10.30 ~ )
Zoom Clone using NodeJS , WebRTC and Websockets.


# Admin UI 사용시 주의 사항 <br>
설정시 , path 는 Advanced Option 에서 name path 붙여야 사용 가능.<br>
아래 에러는 admin-ui 를 생성할때 vscode 에서 터미널에다가 입력하면 나는 에러 인데 이때 윈도우 기본 cmd 창에 입력하거나  npm i "@socket.io/admin-ui" 이렇게 입력하면 됨.( 나는 후자로 다운로드)<br>
PS D:\01.Development\02.workspace\02.study\NomadCoder\02.zoom> npm i @socket.io/admin-ui<br>
+ npm i -g @socket.io/admin-ui<br>

식에서 변수를 참조하는 데 스플랫(splat) 연산자 '@'를 사용할 수 없습니다. '@socket'은(는) 명령 인수로만 사용할 수 있습니다. 식에서 변수를 참조하려면 '$socket'을(를) 사용하십시오.<br>
    + CategoryInfo          : ParserError: (:) [], ParentContainsErrorRecordException<br>
    + FullyQualifiedErrorId : SplattingNotPermitted<br>
