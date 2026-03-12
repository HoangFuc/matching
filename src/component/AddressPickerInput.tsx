import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import Postcode from '@actbase/react-daum-postcode';
import { moderateScale as ms } from 'react-native-size-matters/extend';

import { AppText } from './AppText';
import { MemoBottomSheetModal } from './BottomSheetModal';
import { AppColors } from '../constants/colors';

interface IProps {
  value: string;
  onChange: (address: string) => void;
  placeholder?: string;
}

const AddressPickerInput: React.FC<IProps> = ({
  value,
  onChange,
  placeholder = '방문 장소를 입력하세요',
}) => {
  const [showPostcode, setShowPostcode] = React.useState(false);

  return (
    <>
      <Pressable
        style={styles.dropdownBtn}
        onPress={() => setShowPostcode(true)}
      >
        <AppText
          variant="body7"
          color={value ? AppColors.gray100 : AppColors.gray40}
        >
          {value || placeholder}
        </AppText>
      </Pressable>

      <MemoBottomSheetModal
        visible={showPostcode}
        onClose={() => setShowPostcode(false)}
        title="주소 검색"
        sheetStyle={styles.postcodeSheet}
      >
        <Postcode
          style={styles.postcode}
          jsOptions={{ animation: true }}
          onSelected={data => {
            setShowPostcode(false);
            onChange(data.address);
          }}
          onError={() => setShowPostcode(false)}
        />
      </MemoBottomSheetModal>
    </>
  );
};

export const MemoAddressPickerInput = React.memo(AddressPickerInput);

const styles = StyleSheet.create({
  dropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: ms(8),
    paddingHorizontal: ms(16),
    paddingVertical: ms(10),
    backgroundColor: AppColors.gray10,
    marginTop: ms(4),
  },
  postcodeSheet: {
    height: '80%',
  },
  postcode: {
    flex: 1,
  },
});
