import Component from 'main/component';
import gameWebSocket from './gameWebSocket';

class GameField extends Component {
    constructor(props) {
        super(props, {
            started: false,
            question: null,
            questionResult: null,
            winners: null,
        });
        gameWebSocket.registerCallback('new-question', this.onNewQuestion);
        gameWebSocket.registerCallback(
            'question-result',
            this.onQuestionResult
        );
        gameWebSocket.registerCallback('game-finished', this.onGameFinished);
    }

    onMount = () => {
        this.addEventByClassName('start-game', 'click', this.startGame);
        if (!this.state.questionResult) {
            this.addEventsByClassName('answer', 'click', this.onAnswer);
        } else {
            this.addClassToElementByID(
                `answer_${this.state.questionResult.correctAnswer}`,
                'correct'
            );
            if (!this.state.questionResult.correct) {
                this.addClassToElementByID(
                    `answer_${this.state.questionResult.answer}`,
                    'wrong'
                );
            }
        }
    };

    startGame = () => {
        gameWebSocket.onStartGame({
            username: this.props.username,
            room: this.props.room,
        });
    };

    onAnswer = (event) => {
        const answer = event.target.id.replace('answer_', '');
        const questionSentAt = this.state.question.sentAt;

        gameWebSocket.onSendAnswer({
            score: 15 - Math.floor((Date.now() - questionSentAt) / 1000),
            username: this.props.username,
            room: this.props.room,
            answer,
        });
    };

    onNewQuestion = (question) => {
        if (!this.state.started) {
            this.setState({
                ...this.state,
                started: true,
                question,
                questionResult: null,
                winners: null,
            });
            return;
        }
        this.setState({
            ...this.state,
            question,
            questionResult: null,
        });
    };

    onQuestionResult = (questionResult) => {
        this.setState({
            ...this.state,
            questionResult,
        });
    };

    onGameFinished = ({ winners }) => {
        this.setState({
            started: false,
            question: null,
            questionResult: null,
            winners,
        });
    };

    renderQuestionAnswers = () => {
        return this.state.question.answers.reduce((acc, answer) => {
            acc += `
            <div id='${'answer_' + answer}' class='answer'>${answer}</div>
          `;
            return acc;
        }, '');
    };

    renderGameContent = () => {
        if (!this.state.started) {
            if (this.props.admin) {
                return `<div class="start-game">Start the game</div>`;
            } else {
                return `<div class="wait-for-admin">Waiting for admin to start the game...</div>`;
            }
        }
        if (this.state.question) {
            return `
                <div class="question-container">
                    <div class="question">
                        ${this.state.question.question}
                    </div>
                    <div class="answers-container">
                        ${this.renderQuestionAnswers()}
                    </div>
                </div>
            `;
        }
    };

    renderQuestionResult = () => {
        if (!this.state.questionResult) {
            return '';
        }
        if (this.state.questionResult.correct) {
            return `
                <div class="result correct-answer">${this.state.questionResult.correctAnswer} is correct! You get ${this.state.questionResult.score} points ^_^</div>
            `;
        }
        return `
            <div class="result wrong-answer">${this.state.questionResult.correctAnswer} is the correct answer! You get no points :( </div>
        `;
    };

    renderWinners = () => {
        if (this.state.winners === null) {
            return '';
        }

        const message =
            this.state.winners === ''
                ? 'Nobody won, you all have 0 points! Soooo saaaad!'
                : `${this.state.winners} won the game! Yeeeey party!`;
        return `
            <div class="winners-container">
                ${message}
            </div>
        `;
    };

    render = () => `
        <div id='${this.id}' class="game-field-container">
            ${this.renderGameContent()}
            ${this.renderQuestionResult()}
            ${this.renderWinners()}
        </div>
    `;
}

export default GameField;
