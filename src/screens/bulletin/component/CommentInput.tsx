import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { XMarkIcon } from 'react-native-heroicons/solid';
import { SafeAreaView } from 'react-native-safe-area-context';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from '@/src/component/AppText';
import { AppColors } from '@/src/constants/colors';
import { Send } from '@/src/constants/icons';

interface IReplyTo {
  commentId: string;
  authorName: string;
}

interface IProps {
  replyTo: IReplyTo | null;
  onCancelReply: () => void;
  onSend: (text: string, parentId?: string) => void;
}

export interface ICommentInputRef {
  focus: () => void;
}

const CommentInput = React.forwardRef<ICommentInputRef, IProps>(
  ({ replyTo, onCancelReply, onSend }, ref) => {
  const [commentText, setCommentText] = React.useState('');
  const inputRef = React.useRef<TextInput>(null);

  //---------------------------------------
  React.useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  //---------------------------------------
  React.useEffect(() => {
    if (replyTo) {
      inputRef.current?.focus();
    }
  }, [replyTo]);

  //---------------------------------------
  const handleSend = React.useCallback(() => {
    if (!commentText.trim()) return;
    onSend(commentText.trim(), replyTo?.commentId);
    setCommentText('');
  }, [commentText, onSend, replyTo]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      {replyTo && (
        <View style={styles.replyIndicator}>
          <AppText variant="body8" color={AppColors.gray80}>
            {replyTo.authorName}에게 답글 남기는 중
          </AppText>
          <Pressable onPress={onCancelReply} hitSlop={8}>
            <XMarkIcon color={AppColors.gray80} size={ms(16)} />
          </Pressable>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="내용을 입력해주세요"
          placeholderTextColor={AppColors.gray40}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />

        <Pressable style={styles.sendButton} onPress={handleSend}>
          <Send
            size={`${ms(20)}`}
            color={AppColors.gray90}
            variant="Linear"
            style={{ borderRadius: ms(1.5) }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
});

export const MemoCommentInput = React.memo(CommentInput);

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: AppColors.white,
  },
  replyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.gray10,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    backgroundColor: AppColors.white,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray20,
  },
  input: {
    flex: 1,
    backgroundColor: AppColors.gray10,
    borderRadius: ms(20),
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    fontSize: 14,
    color: AppColors.gray100,
    maxHeight: ms(80),
  },
  sendButton: {
    padding: ms(4),
  },
});
