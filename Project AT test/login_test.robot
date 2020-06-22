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
Login success test
    Login To The Page    userName=&{adminAccount}[userName]    password=&{adminAccount}[password]
    Success Should be Visible    Login successfully

Login fail test
    Login To The Page    userName=failAdmin
    Success Should be Visible    Login failed

Log out test
    Login To The Page    userName=&{adminAccount}[userName]    password=&{adminAccount}[password]
    Success Should be Visible    Login successfully
    Click Button After It Is Visible    //button[normalize-space()='Logout']
    Wait Until Element Is Visible On Page    //h3[normalize-space()='Login']    timeout=${shortPeriodOfTime}    error=Logout is not success.