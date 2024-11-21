const vscode = require('vscode');

let timer;
let Timeend = 25 * 60;
let isWorkSession = true; 
let workSessionsCount = 1;
let statusBarItem;

function Timer() {
    const minute = Math.floor(Timeend / 60);
    const second = Timeend % 60;
    const sessionType = isWorkSession ? `Рабочая сессия: ${workSessionsCount}` : 'Отдых';
    statusBarItem.text = `$(clock) ${minute}:${second} | ${sessionType}`;
}

function startTimer() {
    if (timer) {
        vscode.window.showInformationMessage('Таймер уже запущен.');
        return;
    }

    timer = setInterval(() => {
        if (Timeend > 0) {
            Timeend--;
            Timer();
        } else {
            clearInterval(timer);
            timer = undefined;

            const message = isWorkSession
                ? 'Время отдохнуть!'
                : 'Отдых окончен!';
            vscode.window.showInformationMessage(message);

            if (isWorkSession) {
                if (workSessionsCount % 4 === 0) {
                    Timeend = 25 * 60;
                    vscode.window.showInformationMessage('Время длинного отдыха!');
                } else {
                    Timeend = 5 * 60;
                }
            } else {
                workSessionsCount++;
                Timeend = 25 * 60;
            }

            Timer();
            isWorkSession = !isWorkSession;
        }
    }, 1000);
}

function stopTimer() {
    if (timer) {
        clearInterval(timer);
        timer = undefined;
        vscode.window.showInformationMessage('Таймер остановлен.');
    }
    Timer();
}

function resetTimer() {
    Timeend = 25 * 60;
    workSessionsCount = 1;
    isWorkSession = true;
    Timer();
    vscode.window.showInformationMessage('Таймер сброшен.');
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
}

function activate(context) {
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.show();

    Timer();

    context.subscriptions.push(
        vscode.commands.registerCommand('pomodoro.start', startTimer),
        vscode.commands.registerCommand('pomodoro.stop', stopTimer),
        vscode.commands.registerCommand('pomodoro.reset', resetTimer),
        statusBarItem
    );
}

function deactivate() {
    if (timer) {
        clearInterval(timer);
    }
}

module.exports = {
    activate,
    deactivate
};
