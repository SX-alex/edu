let curSystem = 'esop';


function formatInputWithCommas(inputElement) {
    const input = inputElement.value;
    const cursorPosition = inputElement.selectionStart;
    const prevLength = input.length;

    // Remove any non-numeric characters
    const numericInput = input.replace(/[^0-9]/g, '');

    // Add comma every 3 digits
    const formattedInput = numericInput.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const inputValue = numericInput === '0' ? '' : formattedInput;

    inputElement.value = inputValue;

    let newCursorPosition = cursorPosition + (inputValue.length - prevLength);

    if (cursorPosition === prevLength && cursorPosition === input.length) {
        newCursorPosition = inputValue.length;
    }

    inputElement.setSelectionRange(newCursorPosition, newCursorPosition);
}

function monthsBetweenDates(date1, date2) {
    const [day1, month1, year1] = date1.split('/').map(Number);
    const [day2, month2, year2] = date2.split('/').map(Number);

    const date1Obj = new Date(year1, month1 - 1, day1);
    const date2Obj = new Date(year2, month2 - 1, day2);

    const months = (date2Obj.getFullYear() - date1Obj.getFullYear()) * 12 + (date2Obj.getMonth() - date1Obj.getMonth());

    return 0 - months;
}

function addMonthsToDate(inputDate, numberOfMonths) {
    const [day, month, year] = inputDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day); // Month is zero-based in JavaScript Date objects

    dateObj.setMonth(dateObj.getMonth() + numberOfMonths);

    const newDay = dateObj.getDate();
    const newMonth = dateObj.getMonth() + 1; // Adjust for 0-based month
    const newYear = dateObj.getFullYear();

    return `${newDay}.${newMonth}.${newYear}`;
}

const wrappers = document.querySelectorAll('.form-field__wrapper');

wrappers.forEach(wrapper => {
    const inputElement = wrapper.querySelector('.form-field__gray');

    inputElement.addEventListener('focus', () => {
        wrapper.classList.add('focus');
    });

    inputElement.addEventListener('blur', () => {
        wrapper.classList.remove('focus');
    });
});


const fieldCliff = document.getElementById('field-cliff');
const fieldVesting = document.getElementById('field-vesting');
const fieldExercise = document.getElementById('field-exercise');
const fieldStartDate = document.getElementById('field-start-date');
const fieldOptionsPool = document.getElementById('field-options-pool');
const eduTimeLineElement = document.getElementById('edu-time-line');
const companyName = document.getElementById('company-name');
const companySharesInput = document.getElementById('company-shares-input');

const cliffLabel = document.getElementById('cliff-label');
const vestingLabel = document.getElementById('vesting-label');
const vestingOptions = document.getElementById('vesting-options');

const termsCliffLabel = document.getElementById('terms-cliff-label');
const termsVestingLabel = document.getElementById('terms-vesting-label');
const termsExerciseInfo = document.getElementById('terms-exercise-info');
const preTimelineInfo = document.getElementById('pre-timeline-info');

const eduTimeLineCurrentIndicatorContainer = document.getElementById('edu-time-line-current-indicator-container');

const eduTimePostCliffOptions = document.getElementById('edu-time-post-cliff-options');
const eduTimeLineFinalOptions = document.getElementById('edu-time-line-final-options');
const eduVestingProgress = document.getElementById('edu-vesting-progress')

const cliffNumberOutput = document.getElementById('cliff-number-output')
const vestingNumberOutput = document.getElementById('vesting-number-output')
const exerciseNumberOutput = document.getElementById('exercise-number-output')

const eduGraphValueLow = document.getElementById('edu-graph-value-low');
const eduGraphValueHigh = document.getElementById('edu-graph-value-high');
const graphInput = document.getElementById('graph-input');

const timeLineLabel = document.getElementById('time-line-label');


let cliff;
let vesting;
let exercise;
let startDate;
let optionsPool;
let postVestingOptionPart;
let cName;

const updateCalculations = () => {
    cliff = fieldCliff.value === '' ? 12 : fieldCliff.value * 12;
    vesting = fieldVesting.value === '' ? 48 : fieldVesting.value * 12;
    exercise = fieldExercise.value === '' ? 12 : fieldExercise.value * 12;
    postVestingOptionPart = cliff / vesting * 100;

    const currentDate = new Date();
    const curYear = currentDate.getFullYear();
    const curMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const curDay = String(currentDate.getDate()).padStart(2, '0');

    const curDate = `${curDay}/${curMonth}/${curYear}`;

    startDate = fieldStartDate.value === '' ? `12/01/2022`: fieldStartDate.value;

    const monthsDifference = monthsBetweenDates(curDate, startDate);
    const newDate = addMonthsToDate(startDate,  vesting);
    const nonVestedMonth = monthsBetweenDates(newDate, curDate);

    let vestedProgress;
    vestedProgress = ( ( optionsPool / ( vesting + cliff ) ) * monthsDifference ) / optionsPool * 100;
    if ( vestedProgress > 100){
        vestedProgress = 100;
    }
    if ( vestedProgress < postVestingOptionPart){
        vestedProgress = 0;
    }
    const year = currentDate.getFullYear();

    optionsPool = fieldOptionsPool.value === '' ? 3500 : parseInt(fieldOptionsPool.value.replace(/,/g, ''), 10);
    const startMo = parseInt(startDate.split('/')[1], 10);
    console.log(`startMo: ${startMo}`);

    if (eduTimeLineElement) {
        eduTimeLineElement.style.gridTemplateColumns = `${startMo}fr 0rem ${cliff}fr 0rem ${vesting - cliff}fr 0rem 12fr 0rem`;
    }
    const locStartYear = parseInt(startDate.split('/')[2], 10);
    //const oneSide = (cliff + vesting) -( (year - locStartYear)*12)
    eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `${startMo}fr ${monthsDifference}fr 0rem ${(cliff + vesting + exercise) - monthsDifference}fr`
    console.log(`monthsBetweenDates: ${monthsBetweenDates(curDate, startDate)}`)
    if ( monthsBetweenDates(curDate, startDate) > vesting + cliff + exercise ){
        eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `0rem 100% 0rem 0rem`
    }
    if ( parseInt(curDate.split('/')[2], 10) < parseInt(startDate.split('/')[2], 10) ){
        eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `0rem 0rem 0rem 100%`
    }

    const postVestingOptionPartValue = optionsPool * postVestingOptionPart / 100;
    //console.log(postVestingOptionPartValue);
    const numberOfVestedShares = optionsPool - (( optionsPool - postVestingOptionPartValue ) / vesting) *( ((year + vesting/12) - locStartYear))
    //const isPostCliff = year - parseInt(startDate.split('/')[2], 10) < cliff ? optionsPool * postVestingOptionPart / 100 : 0;
    //const monthlyOptions = ((optionsPool - optionsPool * postVestingOptionPart / 100) / ( vesting - cliff ) * (year - parseInt(startDate.split('/')[2], 10)))+  optionsPool * postVestingOptionPart / 100;

    cliffLabel.textContent = `Lock in period`;
    vestingLabel.textContent = `${ curSystem === 'esop' ? 'Options' : 'Virtual shares'} steadily accruing`;
    vestingOptions.textContent = `${Math.floor(optionsPool / vesting)} ${ curSystem === 'esop' ? 'options' : 'virtual shares'} / month`

    termsCliffLabel.textContent = `Your cliff: ${cliff / 12} ${cliff === '1' ? 'year': 'years'}`;
    //termsVestingInfo.textContent = `${optionsPool} options divided in ${vesting} months`;
    termsVestingLabel.textContent = `Your: ${optionsPool} ${ curSystem === 'esop' ? 'options' : 'virtual shares'} divided in ${vesting} months`;
    termsExerciseInfo.textContent = `Your: ${exercise} months`;

    eduTimePostCliffOptions.textContent = `${ (Math.floor(optionsPool / vesting * cliff)) } ${ curSystem === 'esop' ? 'options' : 'virtual shares'} added instantly`;
    //console.log(`123: ${ optionsPool / (vesting/12) * (cliff/12) }`)
    eduTimeLineFinalOptions.textContent = `${ optionsPool } ${ curSystem === 'esop' ? 'options' : 'virtual shares'}, vesting ends`;

    //console.log(numberOfVestedShares);
    eduVestingProgress.textContent = `${ Math.floor(vestedProgress)}% vested`;

    cliffNumberOutput.textContent = `${ cliff/12 } years`
    vestingNumberOutput.textContent = `${ vesting/12 - cliff/12 } years`
    exerciseNumberOutput.textContent = `${ Math.floor(exercise/12) } years`;

    const inputValue = graphInput.value === '' ? 4000000 : parseInt(graphInput.value.replace(/,/g, ''), 10);

    const companyShares = companySharesInput.value === '' ? 12000000 : parseInt(companySharesInput.value.replace(/,/g, ''), 10);

    eduGraphValueLow.textContent = `€${(Math.floor( inputValue*(numberOfVestedShares / companyShares) )) * multiX}`;
    eduGraphValueHigh.textContent = `€${(Math.floor( inputValue*(optionsPool / companyShares) )) * multiX}`;

    const eduCalendarDateLayout = document.getElementById('edu-calendar-date-layout');

    const totalYears = Math.ceil(cliff/12 + vesting/12 + 1);
    const startYear = parseInt(startDate.split('/')[2], 10);

    eduCalendarDateLayout.innerHTML = '';

    for (let i = 0; i < totalYears; i++) {
        const year = startYear + i;

        // Create the new element
        const newElement = document.createElement('div');
        newElement.classList.add('edu-calendar-date-item');
        newElement.innerHTML = `
            <div>${Math.ceil(year)}</div>
            <div class = "edu-calendar-date-item-border"></div>
        `;

        // Append the new element to eduCalendarDateLayout
        eduCalendarDateLayout.appendChild(newElement);
        updatePreTimelineInfo();
        updateGraph();
    }

    const eduCalendar = document.getElementById('edu-calendar');

    // if ( (vesting + exercise)/12 > 5 ) {
    //     document.getElementById('edu-calendar').style.width = `${100 + (-5 + (vesting + exercise)/12) * 5}vw`;
    // }
    console.log(`vesting + exercise ${(vesting + exercise)/12}`)
    console.log(`${100 + (-5 + (vesting + exercise)/12) * 5}`)
}

let multiX = 1;

const element1 = document.getElementById("edu-graph-x1");
const element3 = document.getElementById("edu-graph-x3");
const element5 = document.getElementById("edu-graph-x5");

// Add click event listeners to the elements
element1.addEventListener("click", function() {
    multiX = 1;
    updateGraph();
});

element3.addEventListener("click", function() {
    multiX = 5;
    updateGraph();
});

element5.addEventListener("click", function() {
    multiX = 16;
    updateGraph();
});

const updateGraph = () => {
    const currentDate = new Date();
    const curYear = currentDate.getFullYear();
    const curMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const curDay = String(currentDate.getDate()).padStart(2, '0');
    const curDate = `${curDay}/${curMonth}/${curYear}`;

    startDate = fieldStartDate.value === '' ? `12/01/2022`: fieldStartDate.value;

    const monthsDifference = monthsBetweenDates(curDate, startDate);
    const inputValue = graphInput.value === '' ? 20000000 : parseInt(graphInput.value.replace(/,/g, ''), 10);
    const companyShares = companySharesInput.value === '' ? 12000000 : parseInt(companySharesInput.value.replace(/,/g, ''), 10);

    if ( monthsDifference <= cliff ){
        eduGraphValueLow.textContent = `$0`
    }else{
        eduGraphValueLow.textContent = `$${(Math.floor( (( optionsPool / ( vesting + cliff ) ) * monthsDifference )*(inputValue/companyShares))) * multiX}`;
    }
    eduGraphValueHigh.textContent = `$${ multiX === 30 ? 1000000000 : (Math.floor(optionsPool * (inputValue/companyShares)))*multiX}`
    //console.log(`${monthsDifference} monthsDifference`)
    //console.log(((optionsPool / ( vesting + cliff ) ) * monthsDifference));
    //console.log(((optionsPool / ( vesting + cliff ) ) * monthsDifference)*(inputValue/companyShares));
}

const updatePreTimelineInfo = () => {
    cName = companyName.value === '' ? 'Your company' : companyName.value;
    //preTimelineInfo.textContent = `${ cName } gave you ${ optionsPool } stock options, distributed over ${ vesting } months.`
    timeLineLabel.innerHTML = `${ cName } ${ curSystem === 'esop' ?  `creates <br/> your option plan`: `creates <br/> your virtual shares plan`}`;

    document.getElementById('edu-journey-title').textContent = `${cName} ${curSystem === 'esop' ? "Stock Options Journey" : "Virstual Shares Journey"}`;
}

updateCalculations();

graphInput.addEventListener('input', (event) => {
    formatInputWithCommas(event.target);
    updateGraph();
});
companySharesInput.addEventListener('input', (event) => {
    formatInputWithCommas(event.target);
    updateGraph();
});

companyName.addEventListener('input', updatePreTimelineInfo);

fieldCliff.addEventListener('input', updateCalculations);
fieldVesting.addEventListener('input', updateCalculations);
fieldExercise.addEventListener('input', updateCalculations);
fieldStartDate.addEventListener('input', updateCalculations);
fieldOptionsPool.addEventListener('input', (event) => {
    formatInputWithCommas(event.target);
    updateCalculations();
});

fieldStartDate.addEventListener("input", function (e) {
    let value = fieldStartDate.value;

    // Remove all characters except numbers and /
    value = value.replace(/[^0-9/]/g, "");

    // Replace . with /
    value = value.replace(".", "/");

    // Remove extra slashes
    value = value.replace(/\/+/g, "/");

    // Ensure the first two numbers are separated by a /
    if (value.length >= 2 && value.indexOf("/") === -1) {
        value = value.substring(0, 2) + "/" + value.substring(2);
    }

    // Ensure the second pair of numbers are separated by a /
    if (value.length >= 5 && value.lastIndexOf("/") === 2) {
        value = value.substring(0, 5) + "/" + value.substring(5);
    }

    // Handle deleting '/'
    if (
        e.inputType === "deleteContentBackward" &&
        (value.length === 2 || value.length === 5)
    ) {
        value = value.substring(0, value.length - 1);
    }

    fieldStartDate.value = value;
});

updateCalculations();

let loading = false;

document.getElementById("pdfInput").addEventListener("change", function () {
    const formData = new FormData();
    const fileInput = this;
    loading = true;

    document.getElementById("edu-upload-bubble").style.display = 'none';
    document.getElementById("edu-upload-loading").style.display = 'flex';

    if (fileInput.files.length > 0) {

        formData.append("file", fileInput.files[0]);

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.chatpdf.com/v1/sources/add-file", true);
        xhr.setRequestHeader("x-api-key", "sec_gwH7BUyTzfkZeFBVyyWnEUFoPfUyQVVs");

        xhr.onload = function () {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                getDataFromFile( response.sourceId, "sec_gwH7BUyTzfkZeFBVyyWnEUFoPfUyQVVs" )
                loading = false;
            } else {
                loading = false;
            }
        };

        xhr.onerror = function () {
            loading = false;
        };

        xhr.send(formData);
    } else {
        loading = false;
    }
});

function extractObject(text) {
    const lines = text.split('\n');

    const extractedObject = {
        cliff: "",
        vesting: "",
        exercise: "",
        numberOfShares: "",
        startDate: "",
        companyName: ""
    };

    for (const line of lines) {
        // Split each line based on ':'
        const parts = line.split(':');

        if (parts.length === 2) {
            const key = parts[0].trim();
            const value = parts[1].trim().replace(/"/g, '').replace(',', '');

            if (key === "cliff") extractedObject.cliff = value;
            if (key === "vesting") extractedObject.vesting = value;
            if (key === "exercise") extractedObject.exercise = value;
            if (key === "numberOfShares") extractedObject.numberOfShares = value;
            if (key === "startDate") extractedObject.startDate = value;
            if (key === "companyName") extractedObject.companyName = value;
        }
    }

    return extractedObject;
}

const getDataFromFile = (sourceId, apiKey) =>{
    const data = {
        sourceId: sourceId,
        messages: [
            {
                role: "user",
                content: `Could you find this information from pages:
                Cliff period in years (if it in months convert in years).
                Vesting period in years (if it in months convert in years).
                Exercise period in years (if it in months convert in years).
                Total number of shares/tokens/options that company grants/vests to the Participant ( find number ).
                How many tokens/options/shares will be granted/vested after cliff period.
                Start Date for vesting/cliff in the format {day/month/year}.
                Company name.
                
                Important note for respond: If any of the data is not found, return null for the respective field.
                
                Here is how respond should look like:
                Object:{
                cliff: just number without word years,
                vesting: just number without word years,
                exercise: just number without word years,
                numberOfShares: number or null,
                startDate: date,
                companyName: name,
                postCliffOptions: number
                }`
            },
        ],
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.chatpdf.com/v1/chats/message", true);
    xhr.setRequestHeader("x-api-key", apiKey);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                console.log("Result:", extractObject(response.content));
                setData(extractObject(response.content));
                document.getElementById("edu-upload-skip-button").click();
                updateCalculations();
                updatePreTimelineInfo();

                document.getElementById("edu-upload-bubble").style.display = 'flex';
                document.getElementById("edu-upload-loading").style.display = 'none';
            } else {
                console.error("Error:", xhr.statusText);
                console.log("Response:", xhr.responseText);
            }
        }
    };

    xhr.send(JSON.stringify(data));
}


const setData = (data) => {
    if (data.cliff !== 'null') {
        fieldCliff.value = data.cliff
    }else{
        fieldCliff.value = '';
    };
    if (data.vesting !== 'null') {
        fieldVesting.value = data.vesting
    }else{
        fieldVesting.value = '';
    };
    if (data.exercise !== 'null') {
        fieldExercise.value = data.exercise
    }else{
        fieldExercise.value = ''
    };
    if (data.startDate !== 'null') {
        fieldStartDate.value = data.startDate
    }else{
        fieldStartDate.value = '';
    };
    if (data.numberOfShares !== 'null') {
        fieldOptionsPool.value = data.numberOfShares
    }else{
        fieldOptionsPool.value = '';
    }
    if (data.companyName !== 'null') {
        companyName.value = data.companyName
    }else{
        companyName.value = '';
    };
}


const eduEsop = document.getElementById("edu-esop");
const eduVsop = document.getElementById("edu-vsop");

const cNumberOfShares = document.getElementById("c-number-of-shares");
const sectionEduOnboardingSlide3Info = document.getElementById("section_edu-onboarding-slide-3-info");
const sectionEduOnboardingSlide4Info = document.getElementById("section_edu-onboarding-slide-4-info");
const sectionEduOnboardingSlide5Info = document.getElementById("section_edu-onboarding-slide-5-info");
const sectionEduOnboardingSlide6Info = document.getElementById("section_edu-onboarding-slide-6-info");
const sectionEduOnboardingSlide7Info = document.getElementById("section_edu-onboarding-slide-7-info");

const exerciseBubbleLabel = document.getElementById("exercise-bubble-label");
const exercisePeriodInfoCard = document.getElementById("exercise-period-info-card");

const liquidityPeriodInfo = document.getElementById("liquidity-period-info");
const taxesPeriodInfo = document.getElementById("taxes-period-info");
const vestingPeriodInfo = document.getElementById("vesting-period-info");
const cliffPeriodInfo = document.getElementById("cliff-period-info");

const taxesVestingLabel = document.getElementById("taxes-vesting-label");

eduEsop.addEventListener("click", () => {
    curSystem = "esop";
    cNumberOfShares.textContent = "Company number of shares";

    sectionEduOnboardingSlide3Info.textContent = "In addition to regular salary, founders offered you a part of company’s future.";
    sectionEduOnboardingSlide4Info.textContent = "To do this, they gave “special tickets” – stock options.";
    sectionEduOnboardingSlide5Info.innerHTML = `
        Those tickets allow you to buy a piece of the company in the future at 
        <span class="text-color-purple-500">minimal</span>
         and 
        <span class="text-color-purple-500">fixed</span>
         price.
    `;
    sectionEduOnboardingSlide6Info.innerHTML = `
        While the company and its value grows, price of your “special tickets” stays <span class="text-color-purple-500">fixed</span>.
    `;
    sectionEduOnboardingSlide7Info.textContent = "It is like buying a skyscraper at the price of a garage.";

    exerciseBubbleLabel.textContent = "Turn options into shares";
    exercisePeriodInfoCard.style.display = "none";
    updateCalculations();

    liquidityPeriodInfo.textContent = "You’ve exercised your options at a special price and now own shares. If the company goes public or is acquired, you have the chance to sell your shares for a profit.";
    taxesPeriodInfo.textContent = "You’ve exercised your options at a special price and now own shares. If the company goes public or is acquired, you have the chance to sell your shares for a profit. This opportunity to sell is known as “liquidity.”";
    vestingPeriodInfo.textContent = "Once your cliff period ends, you don’t receive all the options immediately. Instead, you’re given a few options each month. As months pass, your collection of options grows.";
    cliffPeriodInfo.textContent = "With options it’s easy - if you quit too early, you get nothing. You have to wait until a certain point (the “cliff”) to start earning your options.";

    taxesVestingLabel.textContent = "after cliff year ends";
});

eduVsop.addEventListener("click", () => {
    curSystem = "vsop";
    cNumberOfShares.textContent = "Company number of shares (including phantom stock)";

    sectionEduOnboardingSlide3Info.textContent = "In addition to regular salary, founders offered you a part of company’s financial success. ";
    sectionEduOnboardingSlide4Info.textContent = "To do it, they gave you “special tickets” - virtual shares ";
    sectionEduOnboardingSlide5Info.innerHTML = `Those tickets give you rights to participate in company's financial success (get cash) in case of a liquidity event. `;
    sectionEduOnboardingSlide6Info.innerHTML = `If the company value grows, your financial success grows proportionately, too `;
    sectionEduOnboardingSlide7Info.innerHTML = `It is a win-win: if you do good - your company does good, and otherwise. It makes your work an <span class="text-color-purple-500">investment</span>.`;

    exerciseBubbleLabel.textContent = "Wait for liquidity event";
    exercisePeriodInfoCard.style.display = "grid";
    updateCalculations();

    liquidityPeriodInfo.textContent = "You’ve exercised your virtual shares at a special price and now own shares. If the company goes public or is acquired, you have the chance to sell your shares for a profit.";
    taxesPeriodInfo.textContent = "You’ve exercised your virtual shares at a special price and now own shares. If the company goes public or is acquired, you have the chance to sell your shares for a profit. This opportunity to sell is known as “liquidity.”";
    vestingPeriodInfo.textContent = "Once your cliff period ends, you don’t receive all virtual shares immediately. Instead, you’re given a few virtual shares each month. As months pass, your collection of virtual shares grows.";
    cliffPeriodInfo.textContent = "With virtual shares it’s easy - if you quit too early, you get nothing. You have to wait until a certain point (the “cliff”) to start earning your virtual shares.";

    taxesVestingLabel.textContent = "Your virtual shares are taxed upon sale";
});
