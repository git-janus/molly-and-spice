Sub GETCONTACTINFO(href As String, ws As Worksheet)
    'THIS WILL EXTRACT THE ACTUAL CONTACT INFORMAT FROM THE INDIVIDUAL INFO PAGE
    
    Dim irow As Integer, colCount As Integer
    
    Dim IE As New SHDocVw.InternetExplorer
    
    Dim HTMLDoc As MSHTML.HTMLDocument
    
    Dim HTMLDocElements As MSHTML.IHTMLElementCollection
    
    Dim HTMLDocElement As MSHTML.IHTMLElement
    
    'THIS IS THE INITIAL URL CRAWL OF THE MAIN PRODUCT PAGE
    IE.navigate "https://directory.utexas.edu/index.php?q=James&scope=student&i=46"

    
    IE.Visible = True
    
    'THIS IS TO MAKES THE PAGE IS LOADED BEFORE SCRAPING FOR INFO
    Do While IE.readyState <> READYSTATE_COMPLETE
        
        Application.StatusBar = "Loading page main project page..."
    
    Loop
    
    Set HTMLDoc = IE.document

    'THIS IS THE TARGET HTML TAG
    Set HTMLDocElements = HTMLDoc.getElementsByTagName("tr")

    If HTMLDocElements.Length <> 0 Then

        colCount = 1
    
        irow = Cells(Rows.Count, 1).End(xlUp).Row + 1
            
        'ITERATE EACH HTML ELEMENTS COLLECTED
        For Each HTMLDocElement In HTMLDocElements
             
            Dim innerText As String
            
            Dim innerTextSplit As Variant
            
            innerText = HTMLDocElement.innerText
            
            innerTextSplit = Split(innerText, ":")
 
            'WRITE THE URL'S
            ws.Cells(irow, colCount).Value = innerTextSplit(UBound(innerTextSplit))
                            
            colCount = colCount + 1
            
        Next HTMLDocElement

    End If

    IE.Quit
    
End Sub