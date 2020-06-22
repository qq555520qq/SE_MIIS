*** Settings ***
Library    SeleniumLibrary
Library    String    
Library    Collections
Library    DateTime
Resource    ./Keyword.txt

Test Setup    Run Keywords    Open Browser    http://localhost:4200/    chrome
...                    AND    Maximize Browser Window
Test Teardown    Close Browser

*** Variables ***
${shortPeriodOfTime} =    3

*** Test Cases ***
Test For Patient Should Only See Myself In Rental Page
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service   Rental
    Doctor Should Only See Role Of Patient On Rental Page

Test For Patient Make A Rental
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Rental
    Click Element After It Is Visible    //button[normalize-space()='Make an rental']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Rental Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Set Rental Information
    Click Save Button And Show Success

Test For Patient Save Failed
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Rental
    Click Element After It Is Visible    //button[normalize-space()='Make an rental']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Rental Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Select Dropdown By Name    Quantity    1
    Select Calender day    StartDate    29
    Click Save Button And Show Fail

Test For Start Date And End Date Should Be Expected
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Rental
    Click Element After It Is Visible    //button[normalize-space()='Make an rental']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Rental Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Select Calender day    StartDate    29
    ${actualEndDate} =    Get Element Attribute    //*[(@class='ui-inputtext ui-corner-all ui-state-default ui-widget ui-state-filled')]    value
    ${date} =    Add Time To Date    ${actualEndDate}    -7days
    ${date} =    Convert Date    ${date}    datetime
    Should Be Equal As Integers    ${date.day}    29

Test For Patient Modify A Rental
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Rental
    Click Element After It Is Visible    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]
    ${id} =    Get Element Attribute    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]    id
    Select Dropdown By Name    DeviceName    Standup wheelchair    Wheelchair
    Click Save Button And Show Success
    ${deviceName} =    Get Text    id=rental_deviceName_${id}
    Should Be Equal    ${deviceName}    Standup wheelchair

Test For Doctor Delete A Rental
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Rental
    Delete A Rental For First List

*** Keywords ***
Doctor Should Only See Role Of Patient On Rental Page
    @{allPatientInfo} =    Get WebElements    //*[contains(@id,'rental_patientName')]
    :FOR    ${allPatientInfo}    In    @{allPatientInfo}
    \    ${patientText} =    Get Text    ${allPatientInfo}
    \    Should Be Equal    ${patientText}    mark_robot

Delete A Rental For First List
    ${id} =    Get Element Attribute    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]    id
    Click Element After It Is Visible    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]
    Wait Until Element Is Visible On Page    //div[normalize-space()='Rental Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Click Element After It Is Visible    //span[normalize-space()='Cancel Rental']
    Click Element After It Is Visible    //span[normalize-space()='Yes']
    Success Should be Visible    Delete successfully
    Wait Until Element Is Not Visible    id=rental_patientName_${id}    timeout=${shortPeriodOfTime}    error=Rental Should Be Deleted.

Set Rental Information
    Select Dropdown By Name    DeviceName    Wheelchair
    Select Dropdown By Name    Quantity    1
    Select Calender day    StartDate    29