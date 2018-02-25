@echo off
echo.
echo /======================================/
echo / 项目：静态文件合成、导出程序         /                       /
echo / 最后改进时间：2018/02/24             /
echo / 改进目标：分模块导出                 /
echo /======================================/
echo.

cd .

:InputPath
set/p name=输入模块名称：
rem set name=room
if "%name%" == "" (
    echo 模块名称不能为空
    goto InputPath
)
echo ============ 执行grunt ===================

grunt build:%name%

pause