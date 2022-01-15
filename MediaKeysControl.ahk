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

SetTitleMatchMode, 2

Media_Next::
    if WinActive("ahk_exe CDisplay.exe") {
        if (counterFOne = 0 && counterFTwo = 0 && counterFThree = 0 && counterBOne = 0 && counterBTwo = 0 && counterBThree = 0) {
            counterFOne := 1
            if WinExist("ahk_class Winamp v1.x") {
                ControlSend, ahk_parent, b
            }
            SetTimer, counterReset, 1500 ; 
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
            SetTimer, counterResetYT, 1500 ; 
        }
        else if (counterYTFOne = 1 && counterYTFTwo = 1 && counterYTBOne = 0 && counterYTBTwo = 0) {
            Send {Shift Down}
            Send {n} 
            Send {Shift Up}
        }
        else if (counterYTFOne = 0 && counterYTFTwo = 0 && counterYTBOne = 1 && counterYTBTwo = 0) {
            counterYTBTwo := 1
            Send {l}
        }
        else {
            Send {l}
        }
    }
    else if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        if (counterVLCFOne = 0) {
            counterVLCFOne := 1
            Send {LControl Down}
            Send {Right} 
            Send {LControl Up}
            SetTimer, counterResetVLC, 850 ; 
        }
        else if (counterVLCFOne = 1) {
            Send {n}
        }
    }
    else if WinActive("Joe Rogan Experience") {
        
    }
    else {
        if WinExist("ahk_class Winamp v1.x") {
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
            SetTimer, counterReset, 1500 ; 
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
            SetTimer, counterResetYT, 1500 ; 
        }
        else if (counterYTFOne = 0 && counterYTFTwo = 0 && counterYTBOne = 1 && counterYTBTwo = 1) {
            Send {Shift Down}
            Send {p} 
            Send {Shift Up}
        }
        else if (counterYTFOne = 1 && counterYTFTwo = 0 && counterYTBOne = 0 && counterYTBTwo = 0) {
            counterYTFTwo := 1
            Send {j}
        }
        else {
            Send {j}
        }
    }
    else if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        if (counterVLCBOne = 0) {
            counterVLCBOne := 1
            Send {LControl Down}
            Send {Left} 
            Send {LControl Up}
            SetTimer, counterResetVLC, 850 ; 
        }
        else if (counterVLCBOne = 1) {
            Send {p}
        }
    }
    else if WinActive("Joe Rogan Experience") {
        
    }
    else {
        if WinExist("ahk_class Winamp v1.x") {
            ControlSend, ahk_parent, z
        }
        else {
            Send {Media_Prev}
        }
    }
return

Media_Play_Pause::
    if WinActive(" - YouTube") {
        Send {k}
    }
    else if WinActive(" - VLC media player") or WinActive("ahk_class vlc.exe") {
        Send {Space}
    }
    else if WinActive("Joe Rogan Experience") {
        Send {Space}
    }
    else {
        if WinExist("ahk_class Winamp v1.x") {
            ControlSend, ahk_parent, c
        }
        else {
            Send {Media_Play_Pause}
        }
    }
return


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
  counterVLCBOne := 0
return

counterResetYT:
    counterYTFOne := 0
    counterYTFTwo := 0
    counterYTFThree := 0
    counterYTBOne := 0
    counterYTBTwo := 0
    counterYTBThree := 0
return
