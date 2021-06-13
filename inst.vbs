Option Explicit

dim WshShell, WshExec_1, FSO, f, str
set WshShell = WScript.CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
Set f = FSO.OpenTextFile("install_package.txt", 1)
Do While Not f.AtEndOfStream
  str = f.ReadLine
   
 WshShell.Run str,1,true
 
Loop
f.Close


