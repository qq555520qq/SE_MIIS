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
Test For Patient Make An Appointment
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Click Element After It Is Visible    //button[normalize-space()='Make an appointment']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Appointment Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Set Appointment Info
    Click Save Button And Show Success

Test For Patient Save Failed
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Click Element After It Is Visible    //button[normalize-space()='Make an appointment']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Appointment Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Select Dropdown By Name    Subject    Division of Cardiology
    Select Dropdown By Name    Doctor    Dr.Chucky
    Select Calender day    Date    29
    Click Save Button And Show Fail

Test For Doctor Should Only See Patient In Appointment Page
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Doctor Should Only See Role Of Patient On Appointment Page    mark_robot

Test For Send Email
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Click Element After It Is Visible    //button[normalize-space()='Make an appointment']
    Wait Until Element Is Visible On Page    //div[normalize-space()='Appointment Detail']    ${shortPeriodOfTime}    error=Appointment Detail should be visible.
    Set Appointment Info
    Click Save Button And Show Success
    Reopen To Login To Gmail

Test For Patient Should Only See Self In Appointment Page
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Doctor Should Only See Role Of Patient On Appointment Page    patient_mark_robot

Test For Patient Edit An Appointment
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Click Element After It Is Visible    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]
    Select Calender day    Date    29
    Click Save Button And Show Success

Test For Patient Cancel An Appointment
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Select First List And Cancel Appointment

Test For Doctor Cancel An Appointment
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    Online Service    Appointment
    Select First List And Cancel Appointment

*** Keywords ***
Clear Field By Id
    [Arguments]    ${fieldName}
    ${fieldText} =    Get Element Attribute    id=${fieldName}    value
    ${fieldTextLen} =    Get Length    ${fieldText}
    :FOR    ${index}    In Range    0    ${fieldTextLen}
    \    Press Key    id=${fieldName}    \\8

Clear Field By Class
    [Arguments]    ${fieldName}
    ${fieldText} =    Get Element Attribute    //*[contains(@class,${fieldName})]    value
    ${fieldTextLen} =    Get Length    ${fieldText}
    :FOR    ${index}    In Range    0    ${fieldTextLen}
    \    Press Key    id=${fieldName}    \\8

Set Appointment Info
    Select Dropdown By Name    Subject    Division of Cardiology
    Select Dropdown By Name    Doctor    Dr.Chucky
    Select Calender day    Date    29
    Select Dropdown By Name    Time    Afternoon diagnosis(14:00~17:00)

Doctor Should Only See Role Of Patient On Appointment Page
    [Arguments]    ${patientName}
    @{allPatientInfo} =    Get WebElements    //*[contains(@id,'appointment_name')]
    :FOR    ${allPatientInfo}    In    @{allPatientInfo}
    \    ${patientText} =    Get Text    ${allPatientInfo}
    \    Should Be Equal    ${patientText}    ${patientName}

Select First List And Cancel Appointment
    Click Element After It Is Visible    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]
    ${id} =    Get Element Attribute    (//tr[contains(@class,'ui-selectable-row ng-star-inserted')])[1]    id
    Click Element After It Is Visible    //span[normalize-space()='Cancel appointment']
    Click Element After It Is Visible    //span[normalize-space()='Yes']
    Wait Until Element Is Not Visible    id=${id}    ${shortPeriodOfTime}    error=Item should be deleted.

Reopen To Login To Gmail
    Open Browser    https://mail.google.com/    chrome
    Maximize Browser Window
    Input Text    id=identifierId    a0938765923
    Click Element After It Is Visible    id=identifierNext
    Input Text    name=password    a0938765923
    Click Element After It Is Visible    id=passwordNext