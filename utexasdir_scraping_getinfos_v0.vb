Sub GETALLCONTACTINFOS()
    'THIS WILL DO BULK FETCH
    
    Dim ws As Worksheet, ws1 As Worksheet
    
    Dim urlRng As Range, rng As Range
    
    Set ws = Sheets("utexas students dir")
    
    Set urlRng = ws.Range("A2:A" & ws.Cells(Rows.Count, 1).End(xlUp).Row + 1)
    
    Sheets.Add After:=ActiveSheet
    
    Set ws1 = ActiveSheet
    
    Application.ScreenUpdating = False
    
    For Each rng In urlRng

        GETCONTACTINFO rng.Value, ws1

    Next rng

    Application.ScreenUpdating = True
    
End Sub