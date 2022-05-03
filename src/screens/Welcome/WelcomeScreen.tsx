import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { RootStackNavigatorParams } from '../../App';

import * as S from './WelcomeScreen.styles';

type WelcomeScreenProp = StackNavigationProp<
  RootStackNavigatorParams,
  'Welcome'
>;

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<WelcomeScreenProp>();

  const handleContinue = () => {
    navigation.navigate('Camera');
  };

  return (
    <S.Container accessible>
      <S.TextContainer>
        <S.Title>{t('welcome.title')}</S.Title>
        <S.Text>{t('welcome.intro.one')}</S.Text>
        <S.Text>{t('welcome.intro.two')}</S.Text>
      </S.TextContainer>
      <S.Touchable onPress={handleContinue}>
        <S.Button>
          <S.ButtonText
            accessibilityHint={t('welcome.button.accessibility.hint')}
          >
            {t('welcome.button.text')}
          </S.ButtonText>
        </S.Button>
      </S.Touchable>
    </S.Container>
  );
};

export default WelcomeScreen;
