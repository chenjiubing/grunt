@echo off
echo.
echo /======================================/
echo / ��Ŀ����̬�ļ��ϳɡ���������         /                       /
echo / ���Ľ�ʱ�䣺2018/02/24             /
echo / �Ľ�Ŀ�꣺��ģ�鵼��                 /
echo /======================================/
echo.

cd .

:InputPath
set/p name=����ģ�����ƣ�
rem set name=room
if "%name%" == "" (
    echo ģ�����Ʋ���Ϊ��
    goto InputPath
)
echo ============ ִ��grunt ===================

grunt build:%name%

pause