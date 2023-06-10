C:\nssm-2.24\win64\nssm install nginx "C:\nginx-1.23.3\nginx.exe"
C:\nssm-2.24\win64\nssm set nginx AppDirectory "C:\nginx-1.23.3"
REM C:\nssm-2.24\win64\nssm set nginx AppParameters index.js
C:\nssm-2.24\win64\nssm start nginx
REM C:\nssm-2.24\win64\nssm remove nginx