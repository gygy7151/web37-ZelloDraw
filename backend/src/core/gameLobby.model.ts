import { Game } from './game.interface';
import { Lobby } from './lobby.interface';
import { QuizReply } from './quizReply.model';
import { QuizReplyChain } from './quizReplyChain.model';
import { User } from './user.model';

export class GameLobby implements Lobby, Game {
    readonly id: string;
    readonly host: User;
    users: User[];
    maxRound: number;
    curRound: number;
    readonly roundType: 'DRAW' | 'ANSWER';
    roundLimitTime: number;
    submittedQuizRepliesOnCurrentRound: Array<QuizReply | undefined>;
    quizReplyChains: QuizReplyChain[];
    isPlaying: boolean;

    constructor(user: User) {
        this.id = `${user.socketId}${new Date().getTime()}`;
        this.host = user;
        this.users = [];
        this.maxRound = 0;
        this.curRound = 0;
        this.roundType = 'ANSWER';
        this.roundLimitTime = 0;
        this.quizReplyChains = [];
        this.isPlaying = false;
    }

    getId(): string {
        return this.id;
    }

    getUsers(): User[] {
        return this.users;
    }

    getHost(): User {
        return this.host;
    }

    joinLobby(user: User) {
        this.users.push(user);
    }

    leaveLobby(user: User) {
        this.users = this.users.filter((iUser) => iUser.socketId !== user.socketId);
    }

    // TODO: 게임 시작시, 혹은 게임 종료 시 프로퍼티 초기화 로직 필요.
    startGame(roundLimitTime: number) {
        this.maxRound = this.users.length - 1;
        this.roundLimitTime = roundLimitTime;
        this.isPlaying = true;
        this.quizReplyChains = this.users.map(() => {
            const quizReplyChain = new QuizReplyChain();
            // TODO: 랜덤 키워드는 외부 모듈에 의존하도록 수정
            const randomKeyword = `RANDOM${Math.floor(Math.random() * 100)}`;
            quizReplyChain.add(new QuizReply('ANSWER', randomKeyword));
            return quizReplyChain;
        });
        this.submittedQuizRepliesOnCurrentRound = this.users.map(() => undefined);
    }

    getCurrentRoundQuizReplyChain(user: User): QuizReplyChain {
        const currentRoundQuizReplyChainIndex = this.currentRoundQuizReplyChainIndex(user);
        return this.quizReplyChains[currentRoundQuizReplyChainIndex];
    }

    submitQuizReply(user: User, quizReply: QuizReply) {
        const currentRoundQuizReplyChainIndex = this.currentRoundQuizReplyChainIndex(user);
        this.quizReplyChains[currentRoundQuizReplyChainIndex].put(this.curRound, quizReply);
        this.submittedQuizRepliesOnCurrentRound[this.getUserIndex(user)] = quizReply;
    }

    proceedRound() {
        // TODO: Round Type 바꾸는 로직 추가
        // TODO: Round Type에 맞게 RoundLimitTime 바뀌는 로직 추가
        this.curRound += 1;
        if (this.curRound > this.maxRound) {
            this.isPlaying = false;
        }
        this.submittedQuizRepliesOnCurrentRound = this.users.map(() => undefined);
    }

    getSubmittedQuizRepliesCount(): number {
        return this.submittedQuizRepliesOnCurrentRound.filter(
            (quizReply) => quizReply !== undefined,
        ).length;
    }

    getQuizReplyChains(): QuizReplyChain[] {
        return this.quizReplyChains;
    }

    private getUserIndex(user: User): number {
        return this.users.findIndex((iUser) => iUser.socketId === user.socketId);
    }

    // TODO: 유저별 가져가야 할 ReplyChainIndex를 따로 관리 하도록 하여 다른 메서드 에서는 유저가 각라운드에 가져가야 할 ReplyChainIndex 계산식을 모르게 하도록 수정
    private currentRoundQuizReplyChainIndex(user: User): number {
        return (this.getUserIndex(user) + this.curRound) % this.users.length;
    }
}
