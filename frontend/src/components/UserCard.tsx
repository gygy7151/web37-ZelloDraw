import React, { useCallback } from 'react';
import styled from 'styled-components';
import Card from '@components/Card';
import CameraButton from '@components/CameraButton';
import MicButton from '@components/MicButton';
import { userState } from '@atoms/user';
import { useRecoilState } from 'recoil';
import { networkServiceInstance as NetworkService } from '../services/socketService';
import { debounce } from 'lodash';
import { VideoProperty } from '@styles/styled';
import useLocalStream from '@hooks/useLocalStream';

function UserCard() {
    const [user, setUserState] = useRecoilState(userState);
    const { videoRef } = useLocalStream();

    const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setUserState({ ...user, name });
        debounceOnChange(name);
    };

    const debounceOnChange = useCallback(
        debounce((name: string) => {
            NetworkService.emit('update-user-name', name);
        }, 500),
        [],
    );

    return (
        <Card>
            <CardInner>
                <UserVideo>
                    <Video ref={videoRef} autoPlay playsInline></Video>
                </UserVideo>
                <UserName>
                    <span>&#123;</span>
                    <NameInput
                        type='text'
                        placeholder={user.name}
                        onChange={onChangeName}
                        maxLength={7}
                    />
                    <span>&#125;</span>
                </UserName>
                <ButtonWrapper>
                    <CameraButton />
                    <MicButton />
                </ButtonWrapper>
            </CardInner>
        </Card>
    );
}

export default UserCard;

const CardInner = styled.div`
    padding: 16px;
    height: 100%;
`;

const UserVideo = styled.div`
    width: 328px;
    height: 183.69px;
    border: 2px solid ${({ theme }) => theme.color.whiteT2};
    border-radius: 32px;
    background: ${({ theme }) => theme.gradation.purplePrimary};
    margin-bottom: 7.31px;
`;

const Video = styled(VideoProperty)`
    border-radius: 32px;
`;

const UserName = styled.div`
    text-align: center;
    span {
        // 중괄호
        color: ${({ theme }) => theme.color.whiteT2};
        font-family: 'Sniglet', cursive;
        font-weight: 800;
        font-size: 2rem;
        padding: 4px;
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 0;
    margin-top: 77px;
`;

const NameInput = styled.input`
    width: 201px;
    background: transparent;
    text-align: center;
    margin: 0 2px;
    transform: translateY(-2px);
    font-style: normal;
    font-weight: 600;
    font-size: ${({ theme }) => theme.typo.h3};
    line-height: 160%;
    letter-spacing: -0.05em;
    color: ${({ theme }) => theme.color.yellow};
    -webkit-text-stroke: 1px ${({ theme }) => theme.color.blackT1};
`;
