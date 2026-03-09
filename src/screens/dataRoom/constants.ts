//---------------------------------------
export const DATA_ROOM_TAB_TYPE = {
  MARKET_PRICE: 'MARKET_PRICE',
  SALES: 'SALES',
} as const;

//---------------------------------------
export type TDataRoomTabType =
  (typeof DATA_ROOM_TAB_TYPE)[keyof typeof DATA_ROOM_TAB_TYPE];

//---------------------------------------
export const DATA_ROOM_TAB_LABEL: Record<TDataRoomTabType, string> = {
  [DATA_ROOM_TAB_TYPE.MARKET_PRICE]: '시세 자료',
  [DATA_ROOM_TAB_TYPE.SALES]: '분양자료',
};

//---------------------------------------
export const DATA_ROOM_TABS: TDataRoomTabType[] = [
  DATA_ROOM_TAB_TYPE.MARKET_PRICE,
  DATA_ROOM_TAB_TYPE.SALES,
];

//---------------------------------------
export const DATA_ROOM_LABEL_TO_TYPE: Record<string, TDataRoomTabType> =
  Object.fromEntries(
    Object.entries(DATA_ROOM_TAB_LABEL).map(([key, label]) => [label, key]),
  ) as Record<string, TDataRoomTabType>;
