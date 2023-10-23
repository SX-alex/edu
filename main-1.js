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
const showResultButton = document.getElementById('show-result-button');

const cliffLabel = document.getElementById('cliff-label');
const vestingLabel = document.getElementById('vesting-label');
const vestingOptions = document.getElementById('vesting-options');

const termsCliffLabel = document.getElementById('terms-cliff-label');
const termsVestingInfo = document.getElementById('terms-vesting-info');
const termsVestingLabel = document.getElementById('terms-vesting-label');
const termsExerciseInfo = document.getElementById('terms-exercise-info');

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

const eduVestingOverlay = document.getElementById('edu-vesting-overlay');

const updateCalculations = () => {
    cliff = fieldCliff.value === '' ? 12 : fieldCliff.value * 12;
    vesting = fieldVesting.value === '' ? 48 : fieldVesting.value * 12;
    exercise = fieldExercise.value === '' ? 12 : fieldExercise.value;
    postVestingOptionPart = cliff / vesting * 100;

    const currentDate = new Date();
    const curYear = currentDate.getFullYear();
    const curMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const curDay = String(currentDate.getDate()).padStart(2, '0');

    const curDate = `${curDay}.${curMonth}.${curYear}`;

    if (fieldExercise.value === ''){
        startDate = fieldStartDate.value === '' ? `08.02.2020`: fieldStartDate.value;
    }

    const monthsDifference = monthsBetweenDates(curDate, startDate);
    console.log(monthsDifference);
    const newDate = addMonthsToDate(startDate,  vesting);
    console.log(newDate);
    const nonVestedMonth = monthsBetweenDates(newDate, curDate);
    console.log(`nonVestedMonth ${nonVestedMonth}`);
    let vestedProgress;
    vestedProgress = (optionsPool - ( optionsPool / vesting ) * nonVestedMonth) / optionsPool * 100;
    console.log(`vestedProgress ${vestedProgress}`)
    if ( vestedProgress > 100){
        vestedProgress = 100;
    }
    if ( vestedProgress < postVestingOptionPart){
        vestedProgress = 0;
    }



    const year = currentDate.getFullYear();

    optionsPool = fieldOptionsPool.value === '' ? 42300 : fieldOptionsPool.value;
    const startMo = parseInt(startDate.split('.')[1], 10);

    if (eduTimeLineElement) {
        eduTimeLineElement.style.gridTemplateColumns = `${startMo}fr 0rem ${cliff}fr 0rem ${vesting - cliff}fr 0rem ${exercise}fr 0rem`;
    }
    const locStartYear = parseInt(startDate.split('.')[2], 10);
    //const oneSide = (cliff + vesting) -( (year - locStartYear)*12)
    eduTimeLineCurrentIndicatorContainer.style.gridTemplateColumns = `${monthsDifference}fr 0rem ${(vesting + exercise) - monthsDifference}fr`

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
    exerciseNumberOutput.textContent = `${ Math.floor(exercise) } months exercise period`;

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
    const inputValue = graphInput.value === '' ? 4000000 : graphInput.value;
    const postVestingOptionPartValue = optionsPool * postVestingOptionPart/100;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const locStartYear = parseInt(startDate.split('.')[2], 10);
    const numberOfVestedShares = optionsPool- (( optionsPool - postVestingOptionPartValue ) / vesting) *( ((year + vesting/12) - locStartYear))
    eduGraphValueLow.textContent = `$${(Math.floor(inputValue/12000000 * numberOfVestedShares)) * multiX}`;
    eduGraphValueHigh.textContent = `$${(Math.floor(inputValue/12000000 *optionsPool))*multiX}`
}

updateCalculations();

graphInput.addEventListener('input', updateGraph);

fieldCliff.addEventListener('input', updateCalculations);
fieldVesting.addEventListener('input', updateCalculations);
fieldExercise.addEventListener('input', updateCalculations);
fieldStartDate.addEventListener('input', updateCalculations);
fieldOptionsPool.addEventListener('input', updateCalculations);
//showResultButton.addEventListener('click', updateCalculations);

updateCalculations();

const pdfInput = document.getElementById('pdfInput');
const state4Trigger = document.getElementById('state-4-trigger');

pdfInput.addEventListener('change', function() {
    // Check if a file has been selected
    if (pdfInput.files.length > 0) {
        state4Trigger.click(); // Trigger a click event on the button with id "state-4-trigger"
    }
});
