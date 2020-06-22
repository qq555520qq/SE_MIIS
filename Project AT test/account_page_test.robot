*** Settings ***
Library    SeleniumLibrary
Library    String    
Library    Collections
Resource    ./Keyword.txt

Test Setup    Run Keywords    Open Browser    http://localhost:4200/    chrome
...                    AND    Maximize Browser Window
Test Teardown    Close Browser

*** Variables ***
${shortPeriodOfTime} =    3s
*** Test Cases ***

Test for Doctor create an account
    Login To The Page    userName=F129642705    password=1224
    Success Should be Visible    Login successfully
    Click Tab     User Account Management
    Click Element After It Is Visible    //button[normalize-space()='Add an account']
    Set Create Account Info
    Click Save Button And Show Success

Test For Patient Should Only See Self On Account Page
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    Doctor Should Only See Role Of Patient On Account Page    patient_mark_robot

Test For Click Patient Detail Is Correct
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    @{expectedPatientDetail}    Create List
    @{patientDetails} =    Get WebElements    //*[contains(@class,'autoNewline')]
    :FOR    ${patientDetail}    In    @{patientDetails}
    \    ${detail} =    Get Text    ${patientDetail}
    \    Append To List    ${expectedPatientDetail}    ${detail}
    Click Element After It Is Visible    //*[contains(@class,'ui-selectable-row')]
    @{actualPatientDetail}    Create List    
    @{patientDetails} =    Get WebElements    //*[contains(@class,'ui-g')]//input[@ng-reflect-model]
    :FOR    ${patientDetail}    In    @{patientDetails}
    \    ${detail} =    Get Element Attribute    ${patientDetail}    value
    \    Append To List    ${actualPatientDetail}    ${detail}
    ${patientDetails} =    Get WebElement    //*[contains(@class,'ui-g')]//*[@ng-reflect-model]//input
    ${detail} =    Get Element Attribute    ${patientDetails}    value
    Append To List    ${actualPatientDetail}    ${detail}
    Sort List    ${expectedPatientDetail}
    Sort List    ${actualPatientDetail}
    Lists Should Be Equal    ${expectedPatientDetail}    ${actualPatientDetail}    

Test For Patient Can Edit Address And Email
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    Edit First Row For Address And Email    addrName=板橋3333號11樓            email=a0938765923@gmail.com
    ${newEmail} =    Get Text    //*[contains(@id,'account_email')]
    ${newAddress} =    Get Text    //*[contains(@id,'account_userAddress')]
    Should Be Equal    ${newEmail}    a0938765923@gmail.com    
    Should Be Equal    ${newAddress}    板橋3333號11樓    

Test For Patient Save Failed
    Login To The Page    userName=&{patientAccount}[userName]    password=&{patientAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    Click Element After It Is Visible    //*[contains(@class,'ui-selectable-row')]
    Clear Field By Id    email
    Click Save Button And Show Fail

Test For Doctor Should See Self And Patient In Account Page
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    @{allPatientNames} =    Get WebElements    //*[contains(@id,'account_userName')]
    @{allPatientRoles} =    Get WebElements    //*[contains(@id,'account_role')]
    ${listLen} =    Get Length    ${allPatientNames}
    :FOR    ${index}    IN RANGE    0    ${listLen}
    \    ${patientNameText} =    Get Text    @{allPatientNames}[${index}]
    \    ${patientRoleText} =    Get Text    @{allPatientRoles}[${index}]
    \    Run Keyword If    '${patientNameText}'!='doctor_mark_robot'    Should Be Equal    ${patientRoleText}    patient    

Test For Click Doctor Detail Is Correct
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    ${id} =    Get Element Attribute    (//*[contains(@class,'ui-selectable-row')])[1]    id
    @{expectlPatientDetail}    Create List    
    @{patientDetails} =    Get WebElements    //*[@class='autoNewline ng-star-inserted' and contains(@id,'${id}')]
    :FOR    ${patientDetail}    In    @{patientDetails}
    \    ${detail} =    Get Text    ${patientDetail}
    \    Append To List    ${expectlPatientDetail}    ${detail}
    Click Element After It Is Visible    //*[contains(@class,'ui-selectable-row')][1]
    @{actualPatientDetail}    Create List    
    @{patientDetails} =    Get WebElements    //*[contains(@class,'ui-g')]//input[@ng-reflect-model]
    :FOR    ${patientDetail}    In    @{patientDetails}
    \    ${detail} =    Get Element Attribute    ${patientDetail}    value
    \    Append To List    ${actualPatientDetail}    ${detail}
    ${dropdownValue} =    Get Element Attribute    //*[@id='id']//input    value
    Append To List    ${actualPatientDetail}    ${dropdownValue}
    ${subjectDetail} =    Get Text    //*[contains(@class,'ui-dropdown-label')]
    Append To List    ${actualPatientDetail}    ${subjectDetail}
    Sort List    ${expectlPatientDetail}
    Sort List    ${actualPatientDetail}
    Lists Should Be Equal    ${expectlPatientDetail}    ${actualPatientDetail}


Test For Docter Can Modify An Account
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab     User Account Management
    Click Row By User Account Management    testForRobotCreatePatient    F129642708
    Input Text    id=address    板橋1122號33樓
    Click Save And Is Success

Test For Doctor Save Failed
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    Click Element After It Is Visible    //*[contains(@class,'ui-selectable-row')][1]
    Clear Field By Id    email
    Click Button After It Is Visible    //button[normalize-space()='Save Change']
    Success Should be Visible    Save failed

Test For Admin Disable Account
    Login To The Page    userName=&{adminAccount}[userName]
    Success Should be Visible    Login successfully
    Click Tab    User Account Management
    Click Element After It Is Visible    //*[contains(@class,'ui-selectable-row')][1]
    Click Element After It Is Visible    //*[contains(@class,'ui-inputswitch-slider')]
    Click Save And Is Success
    Click Button After It Is Visible    //button[normalize-space()='Logout']
    Login To The Page    A123    0101
    Success Should be Visible    Login failed

Test for Docter can delete an account
    Login To The Page    userName=&{doctorAccount}[userName]    password=&{doctorAccount}[password]
    Success Should be Visible    Login successfully
    Click Tab     User Account Management
    Click Row By User Account Management    testForRobotCreatePatient    F129642708
    Click Element After It Is Visible    //span[normalize-space()='Delete']
    Click Element After It Is Visible    //span[normalize-space()='Yes']
    Wait Until Element Is Not Visible    //*[contains(@class,'ng-star-inserted') and normalize-space()='mm']//following-sibling::*[normalize-space()='555666777']

*** Keywords ***
Clear Field By Id
    [Arguments]    ${fieldName}
    ${fieldText} =    Get Element Attribute    id=${fieldName}    value
    ${fieldTextLen} =    Get Length    ${fieldText}
    :FOR    ${index}    In Range    0    ${fieldTextLen}
    \    Press Key    id=${fieldName}    \\8
    # Click Element After It Is Visible    id=addresss

Set Create Account Info
    Input Text    id=name    testForRobotCreatePatient
    Input Text    //*[@id='id']//input    F129642708
    Select Dropdown By Name    Gender    Male
    Select Dropdown By Name    Role    Patient
    Select Calender day    BirthDate    22
    Input Text    id=email    testForRobot@gmail.com
    Input Text    id=address    板橋1111號11樓

Click Save And Is Success
    Click Element After It Is Visible    //span[normalize-space()='Save Change']
    Success Should be Visible    Save successfully

Doctor Should Only See Role Of Patient On Account Page
    [Arguments]    ${patientName}
    @{allPatientInfo} =    Get WebElements    //*[contains(@id,'account_userName')]
    :FOR    ${allPatientInfo}    In    @{allPatientInfo}
    \    ${patientText} =    Get Text    ${allPatientInfo}
    \    Should Be Equal    ${patientText}    ${patientName}

Edit First Row For Address And Email
    [Arguments]    ${addrName}    ${email}
    Click Element After It Is Visible    //*[contains(@class,'ui-selectable-row')]
    Input Text    id=address    板橋3333號11樓
    Input Text    id=email    a0938765923@gmail.com
    Click Button After It Is Visible    //button[normalize-space()='Save Change']
    Click Button After It Is Visible    //button[contains(@icon,'refresh')]