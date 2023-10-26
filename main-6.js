function monthsBetweenDates(date1, date2) {
    const [day1, month1, year1] = date1.split('.').map(Number);
    const [day2, month2, year2] = date2.split('.').map(Number);

    const date1Obj = new Date(year1, month1 - 1, day1);
    const date2Obj = new Date(year2, month2 - 1, day2);

    const months = (date2Obj.getFullYear() - date1Obj.getFullYear()) * 12 + (date2Obj.getMonth() - date1Obj.getMonth());

    return 0 - months;
}

function addMonthsToDate(inputDate, numberOfMonths) {
    const [day, month, year] = inputDate.split('.').map(Number);
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
const termsVestingInfo = document.getElementById('terms-vesting-info');
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


let cliff;
let vesting;
let exercise;
let startDate;
let optionsPool;
let postVestingOptionPart;
let cName;

const eduVestingOverlay = document.getElementById('edu-vesting-overlay');

const updateCalculations = () => {
    cliff = fieldCliff.value === '' ? 12 : fieldCliff.value * 12;
    vesting = fieldVesting.value === '' ? 48 : fieldVesting.value * 12;
    exercise = fieldExercise.value === '' ? 12 : fieldExercise.value * 12;
    postVestingOptionPart = cliff / vesting * 100;

    const currentDate = new Date();
    const curYear = currentDate.getFullYear();
    const curMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const curDay = String(currentDate.getDate()).padStart(2, '0');

    const curDate = `${curDay}.${curMonth}.${curYear}`;

    startDate = fieldStartDate.value === '' ? `23.10.2022`: fieldStartDate.value;

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

    optionsPool = fieldOptionsPool.value === '' ? 3500 : fieldOptionsPool.value;
    const startMo = parseInt(startDate.split('.')[1], 10);
    console.log(`startMo: ${startMo}`);

    if (eduTimeLineElement) {
        eduTimeLineElement.style.gridTemplateColumns = `${startMo}fr 0rem ${cliff}fr 0rem ${vesting - cliff}fr 0rem ${exercise}fr 0rem`;
    }
    const locStartYear = parseInt(startDate.split('.')[2], 10);
    //const oneSide = (cliff + vesting) -( (year - locStartYear)*12)
    eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `${startMo}fr ${monthsDifference}fr 0rem ${(cliff + vesting + exercise) - monthsDifference}fr`
    console.log(`monthsBetweenDates: ${monthsBetweenDates(curDate, startDate)}`)
    if ( monthsBetweenDates(curDate, startDate) > vesting + cliff + exercise ){
        eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `0rem 100% 0rem 0rem`
    }
    if ( parseInt(curDate.split('.')[2], 10) < parseInt(startDate.split('.')[2], 10) ){
        eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `0rem 0rem 0rem 100%`
    }

    const postVestingOptionPartValue = optionsPool * postVestingOptionPart / 100;
    //console.log(postVestingOptionPartValue);
    const numberOfVestedShares = optionsPool - (( optionsPool - postVestingOptionPartValue ) / vesting) *( ((year + vesting/12) - locStartYear))
    //const isPostCliff = year - parseInt(startDate.split('.')[2], 10) < cliff ? optionsPool * postVestingOptionPart / 100 : 0;
    //const monthlyOptions = ((optionsPool - optionsPool * postVestingOptionPart / 100) / ( vesting - cliff ) * (year - parseInt(startDate.split('.')[2], 10)))+  optionsPool * postVestingOptionPart / 100;

    cliffLabel.textContent = `Lock in period`;
    vestingLabel.textContent = `Options steadily accruing`;
    vestingOptions.textContent = `${Math.floor(optionsPool / vesting)} options / month`

    termsCliffLabel.textContent = `${cliff / 12} ${cliff === '1' ? 'year': 'years'} cliff`;
    //termsVestingInfo.textContent = `${optionsPool} options divided in ${vesting} months`;
    termsVestingLabel.textContent = `${vesting / 12} year vesting`;
    termsExerciseInfo.textContent = `${exercise} months`;

    eduTimePostCliffOptions.textContent = `${ (Math.floor(optionsPool * postVestingOptionPart / 100)) } options added instantly`;
    eduTimeLineFinalOptions.textContent = `${ optionsPool } options, vesting ends`;

    //console.log(numberOfVestedShares);
    eduVestingProgress.textContent = `${ Math.floor(vestedProgress)}% vested`;

    cliffNumberOutput.textContent = `${ cliff/12 } year cliff`
    vestingNumberOutput.textContent = `${ vesting/12 - cliff/12 } years vesting`
    exerciseNumberOutput.textContent = `${ Math.floor(exercise/12) } years exercise`;

    if (eduVestingOverlay) {
        while (eduVestingOverlay.firstChild) {
            eduVestingOverlay.removeChild(eduVestingOverlay.firstChild);
        }

        for (let i = 0; i < vesting; i++) {
            const newElement = document.createElement('div');
            newElement.classList.add('vesting-overlay-item');
            eduVestingOverlay.appendChild(newElement);
        }
    }

    const inputValue = graphInput.value === '' ? 4000000 : graphInput.value;

    eduGraphValueLow.textContent = `$${(Math.floor(inputValue/12000000 * numberOfVestedShares)) * multiX}`;
    eduGraphValueHigh.textContent = `$${(Math.floor(inputValue/12000000 *optionsPool))*multiX}`

    const eduCalendarDateLayout = document.getElementById('edu-calendar-date-layout');

    const totalYears = Math.ceil(cliff/12 + vesting/12 + exercise/12);
    const startYear = parseInt(startDate.split('.')[2], 10);

    eduCalendarDateLayout.innerHTML = '';

    for (let i = 0; i < totalYears; i++) {
        const year = startYear + i;

        // Create the new element
        const newElement = document.createElement('div');
        newElement.classList.add('edu-calendar-date-item');
        newElement.innerHTML = `
            <div class="opacity-30">
              <div class="text-size-body text-weight-bold text-color-primary">${Math.ceil(year)}</div>
            </div>
        `;

        // Append the new element to eduCalendarDateLayout
        eduCalendarDateLayout.appendChild(newElement);
        updatePreTimelineInfo();
        updateGraph();
    }
}

let multiX = 1;

const element1 = document.getElementById("edu-graph-x1");
const element3 = document.getElementById("edu-graph-x3");
const element5 = document.getElementById("edu-graph-x5");
const element10 = document.getElementById("edu-graph-x10");

// Add click event listeners to the elements
element1.addEventListener("click", function() {
    multiX = 1;
    updateGraph();
});

element3.addEventListener("click", function() {
    multiX = 3;
    updateGraph();
});

element5.addEventListener("click", function() {
    multiX = 5;
    updateGraph();
});

element10.addEventListener("click", function() {
    multiX = 10;
    updateGraph();
});

const updateGraph = () => {
    const currentDate = new Date();
    const curYear = currentDate.getFullYear();
    const curMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const curDay = String(currentDate.getDate()).padStart(2, '0');
    const curDate = `${curDay}.${curMonth}.${curYear}`;

    startDate = fieldStartDate.value === '' ? `08.02.2020`: fieldStartDate.value;

    const monthsDifference = monthsBetweenDates(curDate, startDate);
    const inputValue = graphInput.value === '' ? 20000000 : graphInput.value;
    const companyShares = companySharesInput.value === '' ? 12000000 : companySharesInput.value;

    if ( monthsDifference < cliff ){
        eduGraphValueLow.textContent = `$0`
    }else{
        eduGraphValueLow.textContent = `$${(Math.floor( (( optionsPool / ( vesting + cliff ) ) * monthsDifference )*(inputValue/companyShares))) * multiX}`;
    }
    eduGraphValueHigh.textContent = `$${ multiX === 10 ? 1000000000 : (Math.floor(optionsPool * (inputValue/companyShares)))*multiX}`
    console.log(((optionsPool / ( vesting + cliff ) ) * monthsDifference));
    console.log(((optionsPool / ( vesting + cliff ) ) * monthsDifference)*(inputValue/companyShares));
}

const updatePreTimelineInfo = () => {
    cName = companyName.value === '' ? 'Your company' : companyName.value;
    preTimelineInfo.textContent = `${ cName } gave you ${ optionsPool } stock options, distributed over ${ vesting } months.`
}

updateCalculations();

graphInput.addEventListener('input', updateGraph);
companyName.addEventListener('input', updatePreTimelineInfo);

fieldCliff.addEventListener('input', updateCalculations);
fieldVesting.addEventListener('input', updateCalculations);
fieldExercise.addEventListener('input', updateCalculations);
fieldStartDate.addEventListener('input', updateCalculations);
fieldOptionsPool.addEventListener('input', updateCalculations);

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
                console.log("Source ID:", response.sourceId);
                getDataFromFile( response.sourceId, "sec_gwH7BUyTzfkZeFBVyyWnEUFoPfUyQVVs" )
                loading = false;
            } else {
                console.log("Error:", xhr.statusText);
                console.log("Response:", xhr.responseText);
                loading = false;
            }
        };

        xhr.onerror = function () {
            console.log("Request failed");
            loading = false;
        };

        xhr.send(formData);
    } else {
        console.log("No file selected");
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
                Start Date for vesting/cliff in the format day.month.year.
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
