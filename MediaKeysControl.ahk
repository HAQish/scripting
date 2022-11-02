counterFOne := 0
counterFTwo := 0
counterFThree := 0
counterBOne := 0
counterBTwo := 0
counterBThree := 0

counterVLCFOne := 0
counterVLCBOne := 0

counterYTFOne := 0
counterYTFTwo := 0
counterYTFThree := 0
counterYTBOne := 0
counterYTBTwo := 0
counterYTBThree := 0

counterWinOne := 0
counterWinTwo := 0

VLCMaximizedState := 0
WinampNonMinimizedState := 0

SetTitleMatchMode, 2

Media_Next::
    if WinActive("ahk_exe CDisplay.exe") {
        if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterFOne := 1
            if WinExist("ahk_class Winamp v1.x") {
                ControlSend, ahk_parent, b
            }
            SetTimer, counterReset, -1500 ; 
        }
        else if (counterFOne = 1 && counterFTwo = 1 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            Send {Shift Down}
            Send {l} 
            Send {Shift Up}
        }
        else if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 1 && counterBTwo = 0 && counterBThree = 0) {
            counterBTwo := 1
            if WinExist("ahk_class Winamp v1.x") {
                ControlSend, ahk_parent, b
            }
        }
    }
    else if WinActive(" - YouTube") {
        if (counterYTFOne = 0 && counterYTFTwo = 0 && counterYTBOne = 0 && counterYTBTwo = 0) {
            counterYTFOne := 1
            Send {l}
            sleep 25 ;
            Send {l}
            SetTimer, counterResetYT, -1500 ; 
        }
        else if (counterYTFOne = 1 && counterYTFTwo = 1 && counterYTBOne = 0 && counterYTBTwo = 0) {
            Send {Shift Down}
            Send {n} 
            Send {Shift Up}
        }
        else if (counterYTFOne = 0 && counterYTFTwo = 0 && counterYTBOne = 1 && counterYTBTwo = 0) {
            counterYTBTwo := 1
            Send {l}
            sleep 25 ;
            Send {l}
        }
        else {
            Send {l}
            sleep 25 ;
            Send {l}
        }
    }
    else if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        if (counterVLCFOne = 0) {
            counterVLCFOne := 1
            Send {WheelUp}
            sleep 25 ;
            Send {WheelUp} 
            sleep 25 ;
            Send {WheelUp}
            sleep 25 ;
            Send {WheelUp}
            sleep 25 ;
            Send {WheelUp}
            SetTimer, counterResetVLC, -850 ; 
        }
        else if (counterVLCFOne = 1) {
            Send {n}
        }
    }
    else if WinActive("Joe Rogan Experience") {
        
    }
    else {
        if WinExist("ahk_class Winamp v1.x") or WinExist("ahk_class Winamp PE") {
            ControlSend, ahk_parent, b
        }
        else {
            Send {Media_Next}
        }
    }
return

Media_Prev::
    if WinActive("ahk_exe CDisplay.exe") {
        if (counterFOne = 1 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterFTwo := 1
            if WinExist("ahk_class Winamp v1.x") {
                ControlSend, ahk_parent, z
            }
        }
        else if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterBOne := 1
            if WinExist("ahk_class Winamp v1.x") {
                ControlSend, ahk_parent, z
            }
            SetTimer, counterReset, -1500 ; 
        }
        else if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 1 && counterBTwo = 1 && counterBThree = 0) {
            Send {Shift Down}
            Send {k} 
            Send {Shift Up}
        }
    }
    else if WinActive(" - YouTube") {
        if (counterYTFOne = 0 && counterYTFTwo = 0 && counterYTBOne = 0 && counterYTBTwo = 0) {
            counterYTBOne := 1
            Send {j}
            sleep 25 ;
            Send {j}
            SetTimer, counterResetYT, -1500 ; 
        }
        else if (counterYTFOne = 0 && counterYTFTwo = 0 && counterYTBOne = 1 && counterYTBTwo = 1) {
            Send {Shift Down}
            Send {p} 
            Send {Shift Up}
        }
        else if (counterYTFOne = 1 && counterYTFTwo = 0 && counterYTBOne = 0 && counterYTBTwo = 0) {
            counterYTFTwo := 1
            Send {j}
            sleep 25 ;
            Send {j}
        }
        else {
            Send {j}
            sleep 25 ;
            Send {j}
        }
    }
    else if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        if (counterVLCBOne = 0) {
            counterVLCBOne := 1
            Send {WheelDown}
            sleep 25 ;
            Send {WheelDown} 
            sleep 25 ;
            Send {WheelDown}
            sleep 25 ;
            Send {WheelDown}
            sleep 25 ;
            Send {WheelDown}
            SetTimer, counterResetVLC, -850 ; 
        }
        else if (counterVLCBOne = 1) {
            Send {p}
        }
    }
    else if WinActive("Joe Rogan Experience") {
        
    }
    else {
        if WinExist("ahk_class Winamp v1.x") or WinExist("ahk_class Winamp PE") {
            ControlSend, ahk_parent, z
        }
        else {
            Send {Media_Prev}
        }
    }
return

Media_Play_Pause::
    if WinActive(" - YouTube") {
        ControlSend, ahk_parent, {Space}
    }
    else if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        Send {Space}
    }
    else if WinActive("Joe Rogan Experience") {
        Send {Space}
    }
    else {
        if WinExist("ahk_class Winamp v1.x") or WinExist("ahk_class Winamp PE") {
            if (counterWinOne = 0 && counterWinTwo = 0) {
                counterWinOne := 1
                ControlSend, ahk_parent, c
                SetTimer, counterResetPlayWinamp, -2000 ; 
            } else if (counterWinOne = 1 && counterWinTwo = 0) {
                counterWinTwo := 1
                ControlSend, ahk_parent, c
            } else if (counterWinOne = 1 && counterWinTwo = 1) {
                ControlSend, ahk_parent, x
            }
            else {
                ControlSend, ahk_parent, c
            }
        }
        else {
            Send {Media_Play_Pause}
        }
    }
    VLCMaximizedState := 0
    WinampNonMinimizedState := 0
return

PgUp::
    if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        Send {p}
    } else if WinActive("ahk_exe CDisplay.exe") {
        if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterBOne := 1
            Send {PgUp}
            SetTimer, counterReset, -1500 ; 
        }
        else if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 1 && counterBTwo = 1 && counterBThree = 0) {
            counterBThree := 1
            Send {PgUp}
        }
        else if (counterFOne = 1 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterFTwo := 1
            Send {PgUp}
        } else {
            Send {PgUp}
        }
    } else {
        Send {PgUp}
    }
return

PgDn::
    if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        Send {n}
    } else if WinActive("ahk_exe CDisplay.exe") {
       if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterFOne := 1
            Send {PgDn}
            SetTimer, counterReset, -1500 ; 
        }
        else if (counterFOne = 1 && counterFTwo = 1 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterFThree := 1
            Send {PgDn}
        }
        else if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 1 && counterBTwo = 0 && counterBThree = 0) {
            counterBTwo := 1
            Send {PgDn}
        } else {
            Send {PgDn}
        }
    } else {
        Send {PgDn}
    }
return

~Volume_Down::
    if WinActive("ahk_exe CDisplay.exe") {
        if (counterFOne = 1 && counterFTwo = 1 && counterFThree = 1 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            Send {Shift Down}
            Send {l} 
            Send {Shift Up}
        } else if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 1 && counterBTwo = 1 && counterBThree = 1) {
            Send {Shift Down}
            Send {k} 
            Send {Shift Up}
        }
    }
return

/*
~d::
  if WinActive("ahk_exe CDisplay.exe") {
    Send {MButton}
    sleep 650 ;
    Send {s}
    sleep 650 ;
    Send {o}
    sleep 500 ;
    Send {Enter}
  }
return

~e::
  if WinActive("ahk_exe CDisplay.exe") {
    Send {MButton}
    sleep 600 ;
    Send {s}
    sleep 600 ;
    Send {o}
  }
return

~f::
  if WinActive("ahk_exe CDisplay.exe") {
    Send {MButton}
    sleep 800 ;
    Send {s}
    sleep 800 ;
    Send {o}
    sleep 500 ;
    Send {Enter}
  }
return
*/


counterReset:
    counterFOne := 0
    counterFTwo := 0
    counterFThree := 0
    counterBOne := 0
    counterBTwo := 0
    counterBThree := 0
return

counterResetVLC:
  counterVLCFOne := 0
  counterVLCFTwo := 0
  counterVLCBOne := 0
  counterVLCBTwo := 0
return

counterResetYT:
    counterYTFOne := 0
    counterYTFTwo := 0
    counterYTFThree := 0
    counterYTBOne := 0
    counterYTBTwo := 0
    counterYTBThree := 0
return

counterResetPlayWinamp:
    counterWinOne := 0
    counterWinTwo := 0
return

counterVRRecord:
    counterVRRecOne := 0
    counterVRRecTwo := 0
return
