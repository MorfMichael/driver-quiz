const path = "questions_2026.txt";
const file = Bun.file(path);
const text = await file.text();

const lines = text.split(/\r?\n/);

const questions = [];

for (let i = 1; i < lines.length; i++) {
    const split = lines[i].split('\t');

    questions.push(
    {
       id: split[0],
       themeId: split[1],
       subject: split[2],
       class: split[3]?.replace("C1.C1E.C.CE", "C95").replace("D1.D1E.D.DE", "D95").split(' / '),
       text: split[6],
       answers: [
        { correct: split[7] == "X", text: split[8] },
        { correct: split[9] == "X", text: split[10] },
        { correct: split[11] == "X", text: split[12] },
        { correct: split[13] == "X", text: split[14] },
       ]
    });
}

const content = JSON.stringify(questions, null, '\t');
Bun.write('questions_2026.json', content);