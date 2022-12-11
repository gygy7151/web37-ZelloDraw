import { Injectable } from '@nestjs/common';
import { User } from './user.model';
import { UserService } from './user.service';
import { GameLobby } from './gameLobby.model';
import { GameLobbyRepository } from './gamelobby.repository';

@Injectable()
export class LobbyService {
    constructor(
        private readonly userService: UserService,
        private readonly gameLobbyRepository: GameLobbyRepository,
    ) {}

    async createLobby(user: User): Promise<string> {
        return await this.gameLobbyRepository.create(user);
    }

    async joinLobby(user: User, lobbyId: string): Promise<User[]> {
        const lobby = await this.getLobby(lobbyId);
        // TODO: Define 파일을 통해 상수 관리하기
        if (lobby.users.length >= 8) {
            throw Error('초대받은 방이 꽉 차버렸네요!');
        }
        lobby.joinLobby(user);
        await this.userService.updateUser(user.socketId, { lobbyId });
        await this.gameLobbyRepository.save(lobby);
        return lobby.getUsers();
    }

    async leaveLobby(user: User, lobbyId: string): Promise<User[]> {
        const lobby = await this.getLobby(lobbyId);
        lobby.leaveLobby(user);
        if (lobby.users.length === 0) {
            await this.gameLobbyRepository.delete(lobby);
            return [];
        }
        await this.userService.updateUser(user.socketId, { lobbyId: undefined });
        await this.gameLobbyRepository.save(lobby);
        return lobby.getUsers();
    }

    async validateLobby(lobbyId: string): Promise<void> {
        const gameLobby = await this.gameLobbyRepository.findById(lobbyId);
        if (gameLobby === undefined) {
            throw Error('Lobby is not exists');
        }
    }

    async isLobbyHost(user: User, lobbyId: string): Promise<boolean> {
        const lobby = await this.getLobby(lobbyId);
        return lobby.getHost().socketId === user.socketId;
    }

    async getLobby(lobbyId: string): Promise<GameLobby | undefined> {
        await this.validateLobby(lobbyId);
        return await this.gameLobbyRepository.findById(lobbyId);
    }
}
