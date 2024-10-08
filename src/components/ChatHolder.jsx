import { useTranslation } from 'react-i18next';
import EmptyImg from '../assets/img/empty.svg';
import { CHAT_PLACEHOLDER_TEXT } from '../utils/types';
const getRandomChatPlaceHolderText = () =>
  CHAT_PLACEHOLDER_TEXT[
    Math.floor(Math.random() * CHAT_PLACEHOLDER_TEXT.length)
  ];

export default function ({ text, children, img }) {
  const { t } = useTranslation();
  return (
    <div className="w-full flex flex-col items-center justify-center h-full px-4 select-none">
      <img src={img || EmptyImg} alt="empty" className="max-h-28 max-w-1/2" />
      {!children && (
        <p className="text-[#666] mt-4 text-sm text-center">
          {typeof text === 'string' ? text : t(getRandomChatPlaceHolderText())}
        </p>
      )}
      {children}
    </div>
  );
}
