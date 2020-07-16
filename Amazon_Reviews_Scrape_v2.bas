Attribute VB_Name = "Amazon_Reviews_Scrape"

Function GETPAGEREVIEWSURL(href As String, pageNum As Variant) As String
    
    Dim splitter As Variant
    
    splitter = Split(href, "/")
    
    splitter(4) = "product-reviews"
    
    If pageNum = 1 Then
    
        splitter(6) = "ref=cm_cr_dp_d_show_all_btm?ie=UTF8&reviewerType=all_reviews"
    
    ElseIf pageNum = 2 Then
    
        splitter(6) = "ref=cm_cr_arp_d_paging_btm_next_" & pageNum & "?ie=UTF8&reviewerType=all_reviews&pageNumber=" & pageNum
        
    Else
        
        splitter(6) = "ref=cm_cr_getr_d_paging_btm_next_" & pageNum & "?ie=UTF8&reviewerType=all_reviews&pageNumber=" & pageNum
        
    End If
    
    GETPAGEREVIEWSURL = Join(splitter, "/")
    
End Function


Function GETPROD_AMAZONPARAM(href As String) As Object
    
    Dim param As New Collection
    
    Dim splitter As Variant
    
    splitter = Split(href, "/")
    
    param.Add splitter(5)
    
    param.Add splitter(3)
    
    Set GETPROD_AMAZONPARAM = param

End Function

Function GETREVIEWURL(ASIN As String, ID As String) As String

    GETREVIEWURL = "https://www.amazon.com/gp/customer-reviews/" & ID & "/ref=cm_cr_arp_d_rvw_ttl?ie=UTF8&ASIN=" & ASIN

End Function

Function GETREVIEWSCORE(score_string As String) As Integer

    Dim splitter As Variant
    
    splitter = Split(score_string, " out of ")
    
    GETREVIEWSCORE = CInt(splitter(0))

End Function

Function GETREVIEWCOUNTRY_DATE(countryDateString As String) As Object

    Dim revieTiming As New Collection
    
    Dim splitter As Variant
    
    Dim inTheSplitCheck As Variant
    
    splitter = Split(countryDateString, " on ")
    
    revieTiming.Add splitter(1)
    
    inTheSplitCheck = Split(splitter(0), " in the ")
    
    If UBound(inTheSplitCheck) = 0 Then inTheSplitCheck = Split(splitter(0), " in ")

    revieTiming.Add inTheSplitCheck(1)
    
    Set GETREVIEWCOUNTRY_DATE = revieTiming

End Function

Function GETUPVOTECOUNT(upvoteStr As String) As Integer

    Dim splitter As Variant
    
    splitter = Split(upvoteStr, " ")
    
    If splitter(0) = "One" Then splitter(0) = 1
    
    GETUPVOTECOUNT = CInt(splitter(0))

End Function

Function GETREVIEWSPAGESCOUNT(el As MSHTML.IHTMLElement) As Integer

    Dim el_innerText As String
    
    Dim splitter As Variant
    
    Dim pageCount As Integer
    
    el_innerText = el.innerText
    
    splitter = Split(el_innerText, " of ")
    
    splitter = Split(splitter(1), " ")
    
    pageCount = CInt(splitter(0))
    
    If pageCount Mod 10 > 0 Then pageCount = ((pageCount / 10) - (pageCount Mod 10 / 10)) + 1
    
    GETREVIEWSPAGESCOUNT = pageCount
    
End Function

Function GETREVIEWIDS(href As String) As Object

    Dim href1 As String
    
    Dim IE As New SHDocVw.InternetExplorer, IE2 As New SHDocVw.InternetExplorer
    
    Dim HTMLDoc As MSHTML.HTMLDocument, HTMLDoc2 As MSHTML.HTMLDocument, HTMLDoc3 As MSHTML.HTMLDocument
    
    Dim HTMLDocElements As MSHTML.IHTMLElementCollection
    
    Dim HTMLDocElement As MSHTML.IHTMLElement
    
    Dim REVIEW_IDS As New Collection
    
    Dim US_TOTAL_PAGE_REVIEWS As Integer
   
    'THIS IS THE INITIAL URL CRAWL OF THE MAIN PRODUCT PAGE
    IE.navigate href
    
    IE.Visible = False
    
    'THIS IS TO MAKES THE PAGE IS LOADED BEFORE SCRAPING FOR INFO
    Do While IE.readyState <> READYSTATE_COMPLETE
        
        Application.StatusBar = "Loading page main project page..."
    
    Loop
    
    Set HTMLDoc = IE.document

    'GET THE INTERNATIONAL REVIEWS ID
    
    'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE INTERNATIONAL REVIEWS ARE CONTAINED
    Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-section review aok-relative cr-desktop-review-page-0")
    
    If HTMLDocElements.Length <> 0 Then
    
        Debug.Print vbCr & "International Reviews" & vbCr & "-----------------------------"
        Application.StatusBar = "Extracting International Review ID's..."
        'ITERATE EACH HTML ELEMENTS COLLECTED
        For Each HTMLDocElement In HTMLDocElements
    
            'COLLECT THE EXTRACTED REVIEW ID
            REVIEW_IDS.Add HTMLDocElement.getAttribute("id")
            
            Debug.Print HTMLDocElement.getAttribute("id")
    
        Next HTMLDocElement
        
    End If
    
    'CAPTURE THE HIDDEN FRAMES WHERE SOME OF THE INTERNATIONAL REVIEWS ARE CONTAINED
    Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-section review aok-relative cr-desktop-review-page-1 aok-hidden")
    
    If HTMLDocElements.Length <> 0 Then
    
        Debug.Print vbCr & "Hidden International Reviews" & vbCr & "-----------------------------"
        Application.StatusBar = "Extracting Hidden International Review ID's..."
        'ITERATE EACH HTML ELEMENTS COLLECTED
        For Each HTMLDocElement In HTMLDocElements
    
            'COLLECT THE EXTRACTED REVIEW ID
            REVIEW_IDS.Add HTMLDocElement.getAttribute("id")
            
            Debug.Print HTMLDocElement.getAttribute("id")
    
        Next HTMLDocElement
    
    End If
    
    IE.Quit

    'START OF US REVIEWS CRAWL

    'CONVERT THE INITIAL URL ABOVE AND CONVERT'S IT TO THE PRODUCT REVIEW PAGE 1
    'THIS IS NEEDED TO CAPTURE EXPECTED NUMBER REVIEW PAGES
    href1 = GETPAGEREVIEWSURL(href, 1)

    IE2.navigate href1

    IE2.Visible = False

    'THIS IS TO MAKES THE PAGE IS LOADED BEFORE SCRAPING FOR INFO
    Do While IE2.readyState <> READYSTATE_COMPLETE

        Application.StatusBar = "Loading page..."

    Loop

    Set HTMLDoc2 = IE2.document

    'GET THE EXPECTED NUMBER OF US REVIEW PAGES
    Set HTMLDocElements = HTMLDoc2.getElementsByClassName("a-size-base")
    
    For Each HTMLDocElement In HTMLDocElements
    
        Dim x_test As String
        
        x = HTMLDocElement.getAttribute("data-hook")
        
        If HTMLDocElement.getAttribute("data-hook") = "cr-filter-info-review-count" Then
        
            US_TOTAL_PAGE_REVIEWS = GETREVIEWSPAGESCOUNT(HTMLDocElement)
            
            Exit For
            
        End If
        
    Next HTMLDocElement

    'CRAWL THE FIRST 10 US REVIEWS
    
    'CAPTURE THE ELEMENT WHERE THE FIRST 10 US REVIEW ID'S ARE CONTAINED
    Set HTMLDocElements = HTMLDoc2.getElementsByClassName("a-section review aok-relative")
    
    Debug.Print vbCr & "First 10 US Reviews" & vbCr & "-----------------------------"
    
    Application.StatusBar = "Extracting First 10 US Review ID's..."
    
    'ITERATE EACH HTML ELEMENTS COLLECTED
    For Each HTMLDocElement In HTMLDocElements

        'COLLECT THE EXTRACTED REVIEW ID
        REVIEW_IDS.Add HTMLDocElement.getAttribute("id")
        
        Debug.Print HTMLDocElement.getAttribute("id")

    Next HTMLDocElement

    'TERMINATES IE
    IE2.Quit
    
    'CRAWL THE NEXT REVIEW PAGES FOR ITS REVIEW IDS
    
    'GET THE US REVIEW IDS
    For i = 2 To US_TOTAL_PAGE_REVIEWS

        'TRANSFORMS THE INITIAL URL TO MATCH EACH REVIEW PAGE URL
        href1 = GETPAGEREVIEWSURL(href, i)
        
        Debug.Print vbCr & "Crawling Page " & i & "..." & vbCr & "-----------------------------"
        
        Dim IE3 As New SHDocVw.InternetExplorer
        
        IE3.navigate href1 '

        IE3.Visible = False

        'THIS IS TO MAKES THE PAGE IS LOADED BEFORE SCRAPING FOR INFO
        Do While IE3.readyState <> READYSTATE_COMPLETE 'READYSTATE_COMPLETE

            Application.StatusBar = "Loading Review pages..."

        Loop

        Set HTMLDoc3 = IE3.document

        'COLLECTS THE ELEMENT WITH CLASS NAME THAT CONTAINTS THE REVIEW ID
        Set HTMLDocElements = HTMLDoc3.getElementsByClassName("a-section review aok-relative")

        Application.StatusBar = "Extracting Rest of the US Review ID's..."
        
        'ITERATES EACH ELEMENTS
        For Each HTMLDocElement In HTMLDocElements

            REVIEW_IDS.Add HTMLDocElement.getAttribute("id")

            Debug.Print HTMLDocElement.getAttribute("id")

        Next HTMLDocElement
       
    Next i
    
    IE3.Quit
    
    Set GETREVIEWIDS = REVIEW_IDS
    
End Function


Function GETTHEREVIEWS(href As String) As Object

    Dim PROD_AMAZONPARAM As New Collection
    
    Dim REVIEW_IDS As New Collection
    
    Dim REVIEW_ID As Variant
    
    Dim ASIN As String
    
    Dim PROD_DESC As String
    
    Dim DATABASE_PATH As String
    
    Dim i As Integer
    
    DATABASE_PATH = GET_USERDBPATH
    
    Set REVIEW_IDS = GETREVIEWIDS(href)
    
    Set PROD_AMAZONPARAM = GETPROD_AMAZONPARAM(href)
    
    ASIN = PROD_AMAZONPARAM(1)
    
    'Product Description as stated in the href
    PROD_DESC = PROD_AMAZONPARAM(2)
    
    Debug.Print vbCr & "Extracting the Reviews Info..." & vbCr & "-----------------------------"
    
    i = 1
    
    For Each REVIEW_ID In REVIEW_IDS
    
        Dim href1 As String
    
        Dim IE As New SHDocVw.InternetExplorer
         
        Dim HTMLDoc As MSHTML.HTMLDocument
         
        Dim HTMLDocElements As MSHTML.IHTMLElementCollection
         
        Dim HTMLDocElement As MSHTML.IHTMLElement
        
        Dim REVIEW_URL As String
        
        Dim REVIEWER_PROFILE_NAME As String
        
        Dim REVIEW_SCORE As Integer
        
        Dim REVIEW_TIMING As New Collection
        
        Dim REVIEW_DATE As String
        
        Dim REVIEW_COUNTRY As String
        
        Dim PRODUCT_MODEL As String
        
        Dim BADGE_INFO As String
        
        Dim REVIEW_TITLE As String
        
        Dim REVIEW_COMMENT As String
        
        Dim UPVOTES As Integer
        
        Dim REVIEW_NUM_OF_COMMENTS As Integer
        
        Dim DID_MANUFACTURER_RESPONDED As String
        
        Dim MANUFACTURERS_RESPONSE As String
        
        Dim MANUFACTURERS_REPLIES As New Collection
        
        UPVOTES = 0
        
        REVIEW_NUM_OF_COMMENTS = 0
        
        DID_MANUFACTURER_RESPONDED = "N"
        
        MANUFACTURERS_RESPONSE = vbNullString
        
        REVIEW_URL = GETREVIEWURL(ASIN, CStr(REVIEW_ID))
        
        'OPEN THE REVIEW URL
        IE.navigate REVIEW_URL
         
        'THIS IS TO MAKES THE PAGE IS LOADED BEFORE SCRAPING FOR INFO
        Do While IE.readyState <> READYSTATE_COMPLETE
             
            Application.StatusBar = "Loading individual review page..."
         
        Loop
         
        Set HTMLDoc = IE.document
         
        'GET THE REVIEW PAGE ESSENTIAL INFO
         
        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE PROFILE NAME IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-profile-name")
        
        REVIEWER_PROFILE_NAME = HTMLDocElements(0).innerText
        
        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE SCORE IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-icon-alt")
        
        REVIEW_SCORE = GETREVIEWSCORE(HTMLDocElements(0).innerText)

        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE REVIEW TITLE IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-size-base a-link-normal review-title a-color-base review-title-content a-text-bold")
        
        REVIEW_TITLE = HTMLDocElements(0).innerText

        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE REVIEW DATE AND COUNTRY IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-size-base a-color-secondary review-date")
        
        Set REVIEW_TIMING = GETREVIEWCOUNTRY_DATE(HTMLDocElements(0).innerText)
        
        REVIEW_DATE = REVIEW_TIMING.Item(1)
        
        REVIEW_COUNTRY = REVIEW_TIMING.Item(2)

        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE PRODUCT MODEL IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-size-mini a-link-normal a-color-secondary")
        
        If HTMLDocElements.Length <> 0 Then PRODUCT_MODEL = HTMLDocElements(0).innerText

        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE PROFILE BADGE IS CONTAINED
        'CHECK FOR AVP-BADGE = Verified Purchase
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-size-mini a-color-state a-text-bold")
        
        'CHECK FOR VINE VOICE INFO = Vine Customer Review of Free Product
        If HTMLDocElements.Length = 0 Then Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-color-success a-text-bold")
        
        'CHEDK IF THERE ARE BADGES PRESENT
        If HTMLDocElements.Length = 0 Then
        
            BADGE_INFO = ""
            
        Else
        
            BADGE_INFO = HTMLDocElements(0).innerText
            
        End If

        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE REVIEW TEXT IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-size-base review-text review-text-content")
    
        REVIEW_COMMENT = WorksheetFunction.Trim(WorksheetFunction.Clean(HTMLDocElements(0).innerText))
        
        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE UPVOTE INFO IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-size-base a-color-tertiary cr-vote-text")
        
        'CHECK IF THERE ARE REVIEWS UPVOTES
        If HTMLDocElements.Length <> 0 Then UPVOTES = GETUPVOTECOUNT(HTMLDocElements(0).innerText)
            
        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE NUMBER OF COMMENTS IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("review-comment-total aok-hidden")
        
        If HTMLDocElements.Length <> 0 Then REVIEW_NUM_OF_COMMENTS = CInt(HTMLDocElements(0).innerText)
            
        'CAPTURE THE CLASS NAME OF THE SAMPLE WHERE THE MANUFACTURER'S COMMENTS/REPLY IS CONTAINED
        Set HTMLDocElements = HTMLDoc.getElementsByClassName("a-box a-spacing-large official-comment-container")
   
        If HTMLDocElements.Length <> 0 Then
            
            For Each HTMLDocElement In HTMLDocElements
            
                MANUFACTURERS_REPLIES.Add HTMLDocElement.innerText
                
            Next HTMLDocElement
            
        End If
        
        If MANUFACTURERS_REPLIES.Count <> 0 Then
        
            DID_MANUFACTURER_RESPONDED = "Y"
            
            MANUFACTURERS_RESPONSE = MANUFACTURERS_REPLIES(1)
            
        End If
        
        Application.StatusBar = "Extracting Reviews by ID " & Format(i / REVIEW_IDS.Count, "0%") & " complete"
        
        Debug.Print ASIN, PROD_DESC, PRODUCT_MODEL, REVIEW_ID, REVIEW_URL, REVIEW_COUNTRY, REVIEW_DATE, REVIEWER_PROFILE_NAME, BADGE_INFO, REVIEW_SCORE, REVIEW_TITLE, UPVOTES, REVIEW_COMMENT, REVIEW_NUM_OF_COMMENTS, DID_MANUFACTURER_RESPONDED, MANUFACTURERS_RESPONSE
        
        Dim REVIEW_DATA As New Collection
        
        REVIEW_DATA.Add ASIN
        REVIEW_DATA.Add PROD_DESC
        REVIEW_DATA.Add PRODUCT_MODEL
        REVIEW_DATA.Add REVIEW_ID
        REVIEW_DATA.Add REVIEW_URL
        REVIEW_DATA.Add REVIEW_COUNTRY
        REVIEW_DATA.Add REVIEW_DATE
        REVIEW_DATA.Add REVIEWER_PROFILE_NAME
        REVIEW_DATA.Add BADGE_INFO
        REVIEW_DATA.Add REVIEW_SCORE
        REVIEW_DATA.Add REVIEW_TITLE
        REVIEW_DATA.Add UPVOTES
        REVIEW_DATA.Add REVIEW_COMMENT
        REVIEW_DATA.Add REVIEW_NUM_OF_COMMENTS
        REVIEW_DATA.Add DID_MANUFACTURER_RESPONDED
        REVIEW_DATA.Add MANUFACTURERS_RESPONSE

        WRITETOSHEET REVIEW_DATA
        
        Set REVIEW_DATA = Nothing
        
        i = i + 1
    Next REVIEW_ID
    
    IE.Quit
    
End Function

Sub WRITETOSHEET(passedData As Object)
    
    For i = 1 To passedData.Count
    
        ActiveCell.Value = passedData(i)
        
        ActiveCell.Offset(0, 1).Select
        
    Next i
    
    ActiveCell.Offset(1, (passedData.Count) * -1).Select
    
End Sub

Sub GETALLREVIEWS()

    Dim prodUrl As String
    
    prodUrl = InputBox("Please input product URL", "Scraping URL")
    
    If Len(prodUrl) = 0 Then
    
        MsgBox "You have not provided a valide url", vbCritical
        
        Exit Sub
        
    End If
    
    Dim ws As Worksheet
    
    Sheets.Add After:=ActiveSheet
    
    Set ws = ActiveSheet
    
    GETTHEREVIEWS prodUrl

End Sub


