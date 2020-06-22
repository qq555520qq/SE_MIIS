*** Settings ***
Library    SeleniumLibrary
Library    String    
Library    Collections
Resource    ./Keyword.txt

Test Setup    Run Keywords    Open Browser    http://localhost:4200/    chrome
...                    AND    Maximize Browser Window
Test Teardown    Close All Browsers

*** Variables ***
${shortPeriodOfTime} =    3s

*** Test Cases ***
Test For Doctor Can Add Medication
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Medical Record Management
    Click Element After It Is Visible    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]
    Click Element After It Is Visible    //button[normalize-space()='Add a record']
    Select Dropdown By Name    Condition    Sore throat
    Input Text    //input[contains(@class,'ng-star-inserted')]    FM2
    Click Element After It Is Visible    //span[normalize-space()='FM2']
    Input Text    (//label[normalize-space()='dose:']/../following-sibling::div//input)[1]    3
    Click Element After It Is Visible    //span[normalize-space()='Save']
    Success Should be Visible    Save successfully

Test For Doctor Can Modify Medication
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Medical Record Management
    Click Element After It Is Visible    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]
    Click Element After It Is Visible    (//*[contains(@id,'medical_condition')])[1]
    Clear Field By Class
    Input Text    //input[contains(@class,'ui-autocomplete-input')]    FM2
    Click Element After It Is Visible    //span[normalize-space()='FM2']
    Click Element After It Is Visible    //span[normalize-space()='Save']
    Success Should be Visible    Save successfully

Test For Patient Should Only See Myself In Case Page
    Login To The Page    userName=&{patientAccount}[userName]     password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Medical Record Management
    @{allPatientInfo} =    Get WebElements    //*[contains(@id,'rental_patientName')]
    :FOR    ${allPatientInfo}    In    @{allPatientInfo}
    \    ${patientText} =    Get Text    ${allPatientInfo}
    \    Should Be Equal    ${patientText}    mark

Test For Chart Should Be Visible When User Click Chart
    Login To The Page    userName=&{patientAccount}[userName]     password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Medical Record Management
    Click Button After It Is Visible    //button[normalize-space()='Chart']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Medical Record Chart']    timeout=${shortPeriodOfTime}    error='Medical Record Chart' should be visible.
    Click Button After It Is Visible    //button[normalize-space()='pie']
    Click Button After It Is Visible    //button[normalize-space()='Exit']
    Wait Until Element Is Not Visible    //div[normalize-space()='Medical Record Chart']


*** Keywords ***
Clear Field By Class
    ${fieldText} =    Get Element Attribute    //*[contains(@class,'ui-autocomplete-input')]    value
    ${fieldTextLen} =    Get Length    ${fieldText}
    :FOR    ${index}    In Range    0    ${fieldTextLen}
    \    Press Key    //*[contains(@class,'ui-autocomplete-input')]    \\8
