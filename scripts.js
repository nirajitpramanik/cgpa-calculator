const grades = ["S", "A", "B", "C", "D", "E", "F"];
let credits = {};

async function create_sub_list() {
    const response = await fetch("subjects.json");
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    credits = data;
    return Object.keys(data);
}

function subject_input(subjects, index) {
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `subject${index}`;
    input.id = `subject${index}`;
    input.setAttribute('list', `subject_datalist${index}`);
    input.autocomplete = "off";

    const datalist = document.createElement('datalist');
    datalist.id = `subject_datalist${index}`;

    subjects.forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        datalist.appendChild(option);
    });

    input.addEventListener('input', () => filter_invalid(input, subjects, datalist));

    return { input, datalist };
}

function filter_invalid(input, subjects, datalist) {
    const value = input.value.toLowerCase();
    datalist.innerHTML = '';

    subjects.filter(subject => subject.toLowerCase().includes(value)).forEach(subject => {
        const option = document.createElement('option');
        option.value = subject;
        datalist.appendChild(option);
    });
}

async function createForm() {
    try {
        const subjects = await create_sub_list();
        const form_body = document.getElementById('form-body');

        for (let i = 0; i < 15; i++) {
            const row = document.createElement('tr');

            const subject_cell = document.createElement('td');
            const { input, datalist } = subject_input(subjects, i);
            subject_cell.appendChild(input);
            subject_cell.appendChild(datalist);

            const grade_cell = document.createElement('td');
            const grade_drop = document.createElement('select');
            grade_drop.name = `grade${i}`;
            grade_drop.id = `grade${i}`;

            grades.forEach(grade => {
                const option = document.createElement('option');
                option.value = grade;
                option.text = grade;
                grade_drop.appendChild(option);
            });

            grade_cell.appendChild(grade_drop);

            row.appendChild(subject_cell);
            row.appendChild(grade_cell);

            form_body.appendChild(row);
        }
    } catch (error) {
        console.error('Error fetching subjects:', error);
    }
}

function submission_handler(event) {
    event.preventDefault();

    const form_body = {};
    let total = 0;
    let creditsxgrade = 0;
    let total_credits_opted = 0;

    for (let i = 0; i < 15; i++) {
        const subject = document.getElementById(`subject${i}`).value;
        const grade = document.getElementById(`grade${i}`).value;

        if (subject !== '') {
            if (grade === "S") {
                creditsxgrade += credits[subject] * 10;
                total_credits_opted += credits[subject];
            } 
            
            else if (grade === "A") {
                creditsxgrade += credits[subject] * 9;
                total_credits_opted += credits[subject];
            } 
            
            else if (grade === "B") {
                creditsxgrade += credits[subject] * 8;
                total_credits_opted += credits[subject];
            } 
            
            else if (grade === "C") {
                creditsxgrade += credits[subject] * 7;
                total_credits_opted += credits[subject];
            } 
            
            else if (grade === "D") {
                creditsxgrade += credits[subject] * 6;
                total_credits_opted += credits[subject];
            } 
            
            else if (grade === "E") {
                creditsxgrade += credits[subject] * 5;
                total_credits_opted += credits[subject];
            } 
            
            else if (grade === "F") {
                creditsxgrade += credits[subject] * 0;
                total_credits_opted += credits[subject];
            }
        }

        form_body[`subject${i + 1}`] = { subject, grade };

        if (subject in credits) {
            total += credits[subject];
        }
    }

    let GPA = total_credits_opted > 0 ? creditsxgrade / total_credits_opted : 0;

    console.log('Form Data:', form_body);
    console.log('Total Credits:', total);
    alert(`Your GPA is: ${GPA.toFixed(2)}\nTotal Credits: ${total}`);
}

function cgpa_sub_handler(event) {
    event.preventDefault();

    let pastcredits = Number(document.getElementById("past-sem-credits").value);
    let pastgpa = Number(document.getElementById("past-sem-gpa").value);
    let currentcredits = Number(document.getElementById("current-sem-credits").value);
    let currentgpa = Number(document.getElementById("current-sem-gpa").value);

    let finalgpa = ((pastcredits * pastgpa) + (currentcredits * currentgpa)) / (pastcredits + currentcredits);

    alert(`Your expected CGPA is: ${finalgpa.toFixed(2)}`);
}

document.getElementById('gpa-form').addEventListener('submit', submission_handler);
document.getElementById('cgpa-form').addEventListener('submit', cgpa_sub_handler);

createForm();
