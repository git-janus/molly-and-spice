Sub GETINDIVIDUALCONTACTURLS()
    'THIS WILL SCRAPE ALL CONTACT URLS FOR A SPECIFIC NAME
    'AND LIST ALL THOSE URLS IN A SHEET
    
    Dim href As String
    
    Dim targetName As String
    
    Dim ws As Worksheet
            
    Dim irow As Integer
    
    Dim IE As New SHDocVw.InternetExplorer
    
    Dim HTMLDoc As MSHTML.HTMLDocument
    
    Dim HTMLDocElements As MSHTML.IHTMLElementCollection
    
    Dim HTMLDocElement As MSHTML.IHTMLElement
   
    Set ws = Sheets("utexas students dir") '<--- you can create another tab to where we will write the fetched URLs
    
    targetName = "James" '<--- you can change target name here
    
    href = "https://directory.utexas.edu/index.php?q=" & targetName & "&scope=student&submit=Search"
    
    'THIS IS THE INITIAL URL CRAWL OF THE MAIN PRODUCT PAGE
    IE.navigate href
    
    IE.Visible = False
    
    'THIS IS TO MAKES THE PAGE IS LOADED BEFORE SCRAPING FOR INFO
    Do While IE.readyState <> READYSTATE_COMPLETE
        
        Application.StatusBar = "Loading page main project page..."
    
    Loop
    
    Set HTMLDoc = IE.document

    'THIS IS THE TARGET HTML TAG
    Set HTMLDocElements = HTMLDoc.getElementsByTagName("a")

    If HTMLDocElements.Length <> 0 Then

        'ITERATE EACH HTML ELEMENTS COLLECTED
        For Each HTMLDocElement In HTMLDocElements
            
            'FILTER OUT THE NON TARGET a TAG
            If HTMLDocElement.innerText <> "About the Directory " _
                And HTMLDocElement.innerText <> "Frequently Asked Questions" _
                And HTMLDocElement.innerText <> "University Offices" _
                And HTMLDocElement.innerText <> "UT System Administration Directory" _
                And HTMLDocElement.innerText <> "Advanced Search" _
                And HTMLDocElement.innerText <> "UT Austin Home" _
                And HTMLDocElement.innerText <> "Emergency Information" _
                And HTMLDocElement.innerText <> "Site Policies" _
                And HTMLDocElement.innerText <> "Web Accessibility Policy" _
                And HTMLDocElement.innerText <> "Web Privacy Policy" _
                And HTMLDocElement.innerText <> "Adobe Reader" _
                And HTMLDocElement.innerText <> "Skip to main content" _
                And HTMLDocElement.className <> "logo" Then
                
                    If HTMLDocElement.innerText <> "" Then
                        
                        'DETERMINE LAST NON-EMPTY ROW IN A COLUMN
                        irow = ws.Cells(Rows.Count, 1).End(xlUp).Row + 1
                        
                        'WRITE THE URL'S
                        ws.Cells(irow, 1).Value = HTMLDocElement.getAttribute("href")
                        
                    End If
                        
            End If
                
        Next HTMLDocElement

    End If

    IE.Quit
    
End Sub