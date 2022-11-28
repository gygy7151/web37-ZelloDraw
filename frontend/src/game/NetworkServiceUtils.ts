import { networkServiceInstance as NetworkService } from '@services/socketService';
import {
    StartRoundEmitRequest,
    SubmitQuizReplyEmitRequest,
    SubmitQuizReplyRequest,
} from '@backend/core/game.dto';
import { SetterOrUpdater } from 'recoil';

export const emitStartGame = (lobbyId: string) => {
    NetworkService.emit('start-game', lobbyId);
};

export const onStartGame = (
    setPage: (url: string) => void,
    setRoundInfo: SetterOrUpdater<StartRoundEmitRequest>,
) => {
    NetworkService.on('start-game', () => {
        setPage('/game');
    });

    NetworkService.on('start-round', (roundInfo: StartRoundEmitRequest) => {
        setRoundInfo(roundInfo);
    });
};

export const emitSubmitQuizReply = (submitReply: SubmitQuizReplyRequest) => {
    NetworkService.emit('submit-quiz-reply', submitReply);
};

export const onSubmitQuizReply = () => {
    NetworkService.on(
        'submit-quiz-reply',
        ({ submittedQuizReplyCount }: SubmitQuizReplyEmitRequest) => {
            console.log(submittedQuizReplyCount);
        },
    );
};

export const onRoundTimeout = (setIsRoundTimeout: SetterOrUpdater<boolean>) => {
    NetworkService.on('round-timeout', () => setIsRoundTimeout(true));
};
