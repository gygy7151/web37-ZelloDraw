import { networkServiceInstance as NetworkService } from '@services/socketService';
import { roundInfoType } from '@atoms/game';

export const emitStartGame = (lobbyId: string) => {
    NetworkService.emit('start-game', lobbyId);
};

export const onStartGame = (setPage: (url: string) => void) => {
    NetworkService.on('start-game', (payload: any) => {
        console.log('onStartGame payload', payload);
        emitStartRound(payload.lobbyId);
        setPage('/game');
    });
};

export const emitStartRound = (lobbyId: string) => {
    NetworkService.emit('start-round', lobbyId);
};

export const getRoundInfo = async () => {
    return await new Promise<roundInfoType>((resolve) => {
        NetworkService.on('start-round', (userRound: roundInfoType) => {
            resolve(userRound);
        });
    });
};
