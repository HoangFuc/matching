import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Like1, Message } from 'iconsax-react-nativejs';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';

interface IProps {
  likes: number;
  comments: number;
  extra?: React.ReactNode;
  isAuthor?: boolean;
}

const PostStats: React.FC<IProps> = ({ likes, comments, extra, isAuthor }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Like1
            size={`${ms(16)}`}
            color={AppColors.gray100}
            variant="Linear"
          />
          <AppText variant="detail" color={AppColors.gray100}>
            {likes}
          </AppText>
        </View>

        {!isAuthor && (
          <View style={styles.stat}>
            <Message
              size={`${ms(16)}`}
              color={AppColors.gray100}
              variant="Linear"
            />
            <AppText variant="detail" color={AppColors.gray100}>
              {comments}
            </AppText>
          </View>
        )}
      </View>

      {!isAuthor && extra}
    </View>
  );
};

export const MemoPostStats = React.memo(PostStats);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(16),
  },
  stats: {
    flexDirection: 'row',
    gap: ms(16),
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
});
