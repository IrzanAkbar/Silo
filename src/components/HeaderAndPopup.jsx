import { useRequest } from 'ahooks';
import { useEffect, useRef, useState } from 'react';
import { useActiveModels, useIsRowMode } from '../store/app';
import { isExperienceSK, useSecretKey, useZenMode } from '../store/storage';
import ScLogo from '../assets/img/sc-logo.png';
import { fetchUserInfo } from '../services/api';
import { useDarkMode, useIsMobile } from '../utils/use';
import CustomModelDrawer from './CustomModelDrawer';
import { message, notification, Button } from 'tdesign-react';
import { Dropdown } from 'tdesign-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { useNavigate, useLocation } from 'react-router-dom';
import Tooltip from './MobileCompatible/Tooltip';
import { useTranslation } from 'react-i18next';

export default function () {
  const [showPopup, setShowPopup] = useState();
  const [secretKey, setSecretKey] = useSecretKey();
  const [isDark, setDarkMode] = useDarkMode();
  const { i18n, t } = useTranslation();

  const location = useLocation();
  const isImageMode = location.pathname === '/image';
  const customModelRef = useRef();
  const { data, error, runAsync } = useRequest(fetchUserInfo, {
    pollingErrorRetryCount: 60 * 1000,
    debounceWait: 300,
    manual: true,
  });
  useEffect(() => {
    if (isExperienceSK()) {
      notification.info({
        title: t('您正在使用体验密钥'),
        content: t(
          '体验密钥因为多人使用可能会触发限速，建议您及时更换为自己的密钥'
        ),
        closeBtn: true,
        duration: 1000 * 6,
        placement: 'bottom-right',
        offset: [-20, -20],
      });
    }
    runAsync().then(() => {
      setShowPopup(false);
    });
  }, [secretKey]);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isRowMode, setIsRowMode] = useIsRowMode();
  const [isZenMode, setIsZenMode] = useZenMode();

  const [showInZen, setShowInZen] = useState(false);
  useEffect(() => {
    if (isZenMode) {
      setShowInZen(false);
    }
  }, [isZenMode]);

  useEffect(() => {
    setShowPopup(error);
  }, [error]);
  const { addMoreModel, activeModels } = useActiveModels();

  return (
    <>
      {isZenMode && (
        <div
          className="h-3 hover:bg-primary hover:bg-opacity-10 transition-colors"
          onMouseOver={() => setShowInZen(true)}
        ></div>
      )}
      <div
        onMouseLeave={() => setShowInZen(false)}
        className={
          'h-12 w-full filter backdrop-blur text-xl flex items-center px-4 ' +
          (isZenMode
            ? 'fixed top-0 left-0 right-0 z-50 transform transition-visible duration-300 delay-150 ' +
              (showInZen
                ? 'translate-y-0 opacity-100'
                : '-translate-y-full opacity-0')
            : ' ')
        }
      >
        <img
          src="/logo.svg"
          alt="logo"
          className="w-6 mr-6 cursor-pointer"
          onClick={() => navigate('/chat')}
        />

        <span className="mr-auto"></span>

        {!isImageMode && (
          <Tooltip placement="bottom" content={t('新增模型')}>
            <i
              className="block i-ri-apps-2-add-line cursor-pointer mr-4"
              onClick={addMoreModel}
            ></i>
          </Tooltip>
        )}
        <Tooltip
          placement="bottom"
          content={t(isImageMode ? '切换对话模式' : '切换文生图模式')}
        >
          <i
            onClick={() => navigate(isImageMode ? '/chat' : '/image')}
            className={
              (isImageMode
                ? 'iconify mingcute--chat-1-line'
                : 'iconify mingcute--pic-ai-line') +
              ' block color-current mr-4 cursor-pointer'
            }
          ></i>
        </Tooltip>
        <i
          className={
            (isDark ? 'i-ri-sun-line' : 'i-ri-moon-line') +
            ' cursor-pointer mr-4'
          }
          onClick={() => setDarkMode(!isDark)}
        ></ i>
        <Dropdown
          maxColumnWidth="160"
          direction="left"
          trigger="click"
          options={[
            {
              icon: isRowMode
                ? 'i-mingcute-columns-3-fill'
                : 'i-mingcute-rows-3-fill',
              onClick: () => setIsRowMode(!isRowMode),
              hidden: isMobile || isImageMode,
              disabled: activeModels.length <= 1,
              title: t(isRowMode ? '多列模式' : '双行模式'),
            },
            {
              icon: 'iconify mingcute--radiobox-line',
              onClick: () => setIsZenMode(!isZenMode),
              hidden: isMobile,
              title: t(isZenMode ? '退出禅模式' : '禅模式'),
            },
            {
              icon: 'iconify mingcute--translate-2-line',
              title: t('选择语言'),
              children: [
                {
                  content: '简体中文',
                  onClick: () => i18n.changeLanguage('zh'),
                },
                {
                  content: 'English',
                  onClick: () => i18n.changeLanguage('en'),
                },
              ],
            },
            {
              icon: 'iconify mingcute--more-3-fill',
              title: t('更多'),
              divider: true,
              children: [
                {
                  icon: 'i-ri-global-fill',
                  onClick: () => {
                    window.open('https://irzan.us', '_blank');
                  },
                  title: 'Website',
                },
                {
                  icon: 'i-ri-instagram-fill',
                  onClick: () => {
                    window.open('https://www.instagram.com/zannonly_', '_blank');
                  },
                  title: 'Instagram',
                },
                {
                  icon: 'i-mingcute-wechat-fill',
                  onClick: async () => {
                    const notify = await notification.info({
                      placement: 'bottom-right',
                      offset: [-20, -20],
                      title: t('联系开发者'),
                      content: t('您可以通过邮箱或是微信直接联系开发者'),
                      closeBtn: true,
                      duration: 0,
                      footer: (
                        <>
                          <a
                            href={`mailto:admin@irzan.us?subject=${encodeURIComponent(
                              'Silo Feedback'
                            )}&body=${encodeURIComponent('')}`}
                            onClick={() => {
                              notify.close();
                            }}
                          >
                            <Button
                              className="ml-2"
                              theme="default"
                              variant="text"
                            >
                              {t('发邮件')}
                            </Button>
                          </a>
                          <CopyToClipboard
                            text="6281342111149"
                            onCopy={() => {
                              message.success(t('已复制'));
                              notify.close();
                            }}
                          >
                            <Button
                              className="ml-2"
                              theme="primary"
                              variant="text"
                            >
                              {t('使用微信')}
                            </Button>
                          </CopyToClipboard>
                        </>
                      ),
                    });
                  },
                  title: t('联系开发者'),
                },
              ].map(item => ({
                prefixIcon: <i className={item.icon + ' mr-0'} />,
                content: item.title,
                onClick: item.onClick,
                disabled: item.disabled,
                value: item.title,
                children: item.children,
              })),
            },
          ]
            .filter(item => !item.hidden)
            .map(item => ({
              prefixIcon: <i className={item.icon + ' mr-0'} />,
              content: item.title,
              onClick: item.onClick,
              disabled: item.disabled,
              value: item.title,
              children: item.children,
            }))}
        >
          <i className={'i-ri-more-fill cursor-pointer'}></i>
        </Dropdown>
        <CustomModelDrawer
          ref={customModelRef}
          onClose={() => customModelRef.current.close()}
        />
      </div>
      <CustomModelDrawer ref={customModelRef} />
    </>
  );
      }
